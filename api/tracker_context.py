import json
from http.server import BaseHTTPRequestHandler

from evaluation_service import build_tracker_context_from_token


class handler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            return self.respond_json({"error": "Некорректный JSON в запросе."}, status=400)

        designer_name = str(payload.get("designer_name") or "").strip()
        tracker_login = str(payload.get("tracker_login") or "").strip()
        tracker_token = str(payload.get("tracker_token") or "").strip()
        period_start = str(payload.get("period_start") or "").strip()
        period_end = str(payload.get("period_end") or "").strip()

        if not designer_name and not tracker_login:
            return self.respond_json({"error": "Передай designer_name или tracker_login."}, status=400)
        if not tracker_token:
            return self.respond_json({"error": "Не указан OAuth-токен Трекера."}, status=400)

        try:
            tracker_context = build_tracker_context_from_token(
                designer_name=designer_name,
                tracker_login=tracker_login,
                tracker_token=tracker_token,
                period_start=period_start,
                period_end=period_end,
            )
        except RuntimeError as error:
            return self.respond_json({"error": str(error)}, status=502)

        return self.respond_json({"tracker_context": tracker_context}, status=200)

    def respond_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
