import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from evaluation_service import (
    YANDEX_TRACKER_LOOKBACK_MONTHS,
    YANDEX_TRACKER_MAX_ISSUES,
    build_tracker_context,
    build_tracker_headers,
    fetch_tracker_issues,
    normalize_tracker_login,
    render_tracker_context,
    resolve_tracker_user,
)


PORT = int(os.environ.get("TRACKER_PROXY_PORT", "4040"))
TRACKER_PROXY_SHARED_SECRET = os.environ.get("TRACKER_PROXY_SHARED_SECRET", "").strip()


class TrackerProxyHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"{self.address_string()} - {format % args}")

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        if self.path != "/tracker/context":
            self.send_error(404, "Not Found")
            return

        if not authorize_proxy_request(self.headers.get("Authorization", "")):
            self.respond_json({"error": "Unauthorized"}, status=401)
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            self.respond_json({"error": "Некорректный JSON в запросе."}, status=400)
            return

        designer_name = str(payload.get("designer_name") or "").strip()
        tracker_login = str(payload.get("tracker_login") or "").strip()

        if not designer_name and not tracker_login:
            self.respond_json({"error": "Передай designer_name или tracker_login."}, status=400)
            return

        try:
            tracker_context = build_proxy_tracker_context(designer_name=designer_name, tracker_login=tracker_login)
        except RuntimeError as error:
            self.respond_json({"error": str(error)}, status=502)
            return

        self.respond_json({"tracker_context": tracker_context}, status=200)

    def respond_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def authorize_proxy_request(authorization_header):
    if not TRACKER_PROXY_SHARED_SECRET:
        return True

    expected = f"Bearer {TRACKER_PROXY_SHARED_SECRET}"
    return str(authorization_header or "").strip() == expected


def build_proxy_tracker_context(designer_name="", tracker_login=""):
    normalized_login = normalize_tracker_login(tracker_login)
    if normalized_login:
        user = {
            "login": normalized_login,
            "display": str(designer_name or normalized_login).strip() or normalized_login,
            "first_name": "",
            "last_name": "",
        }
    else:
        user = resolve_tracker_user(designer_name)
        if not user:
            raise RuntimeError(
                "Не удалось автоматически определить пользователя в Яндекс Трекере. Передай tracker_login."
            )

    issues = fetch_tracker_issues(user["login"])
    if not issues:
        return (
            "## данные из Яндекс Трекера\n\n"
            f"- дизайнер: {user['display']} ({user['login']})\n"
            f"- период: последние {YANDEX_TRACKER_LOOKBACK_MONTHS} месяца\n"
            f"- лимит выборки: {YANDEX_TRACKER_MAX_ISSUES}\n"
            "- задач по фильтру не найдено\n"
        )

    return render_tracker_context(user, issues)


def main():
    auth_preview = build_tracker_headers(has_json_body=False)
    auth_mode = (
        "tvm"
        if "X-Ya-Service-Ticket" in auth_preview or "X-Ya-User-Ticket" in auth_preview
        else "oauth"
        if "Authorization" in auth_preview
        else "none"
    )
    server = ThreadingHTTPServer(("0.0.0.0", PORT), TrackerProxyHandler)
    print(f"tracker proxy listening on http://0.0.0.0:{PORT} (tracker auth: {auth_mode})")
    server.serve_forever()


if __name__ == "__main__":
    main()
