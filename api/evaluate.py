import json
from http.server import BaseHTTPRequestHandler

from evaluation_service import evaluate_designer


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

        card_markdown = str(payload.get("card_markdown") or "").strip()
        designer_name = str(payload.get("designer_name") or "").strip()
        tracker_login = str(payload.get("tracker_login") or "").strip()
        if not card_markdown:
            return self.respond_json({"error": "Пустая анкета. Нечего отправлять на оценку."}, status=400)

        try:
            evaluation = evaluate_designer(
                card_markdown=card_markdown,
                designer_name=designer_name,
                tracker_login=tracker_login,
            )
        except ValueError as error:
            return self.respond_json({"error": str(error)}, status=400)
        except RuntimeError as error:
            return self.respond_json({"error": str(error)}, status=502)

        return self.respond_json(evaluation, status=200)

    def respond_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
