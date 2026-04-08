import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
PORT = int(os.environ.get("PORT", "4020"))
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4.1")
OPENAI_API_URL = "https://api.openai.com/v1/responses"
EVALUATION_INSTRUCTIONS = """
проанализируй содержимое анкеты, критерии карты компетенции, и подготовь оценку дизайнера, его грейд и точки роста.

верни результат в markdown на русском языке.

структура ответа:
# оценка дизайнера

## итог
- рекомендуемый грейд
- уверенность в оценке
- краткий вывод

## обоснование грейда

## сильные стороны

## точки роста

## риски и пробелы в данных

## рекомендации для следующего шага
""".strip()


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def log_message(self, format, *args):
        print(f"{self.address_string()} - {format % args}")

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        if self.path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def do_POST(self):
        if self.path != "/api/evaluate":
            self.send_error(404, "Not Found")
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            self.respond_json({"error": "Некорректный JSON в запросе."}, status=400)
            return

        card_markdown = str(payload.get("card_markdown") or "").strip()
        if not card_markdown:
            self.respond_json({"error": "Пустая анкета. Нечего отправлять на оценку."}, status=400)
            return

        if not OPENAI_API_KEY:
            self.respond_json(
                {
                    "error": "На сервере не настроен OPENAI_API_KEY. Добавь ключ в переменные окружения перед запуском."
                },
                status=500,
            )
            return

        try:
            evaluation_text = request_openai_evaluation(card_markdown)
        except RuntimeError as error:
            self.respond_json({"error": str(error)}, status=502)
            return

        self.respond_json(
            {
                "file_name": "designer-assessment-result.md",
                "content": evaluation_text,
            }
        )

    def respond_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def request_openai_evaluation(card_markdown):
    request_payload = {
        "model": OPENAI_MODEL,
        "instructions": EVALUATION_INSTRUCTIONS,
        "input": card_markdown,
    }

    request = Request(
        OPENAI_API_URL,
        data=json.dumps(request_payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=120) as response:
            response_body = response.read().decode("utf-8")
    except HTTPError as error:
        details = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI вернул ошибку {error.code}: {details}")
    except URLError as error:
        raise RuntimeError(f"Не удалось подключиться к OpenAI: {error.reason}")

    parsed = json.loads(response_body)
    output_text = extract_output_text(parsed).strip()
    if not output_text:
        raise RuntimeError("OpenAI не вернул текст оценки.")

    return output_text


def extract_output_text(payload):
    direct_text = payload.get("output_text")
    if isinstance(direct_text, str) and direct_text.strip():
        return direct_text

    output = payload.get("output") or []
    fragments = []
    for item in output:
        for content in item.get("content", []):
            if content.get("type") == "output_text" and content.get("text"):
                fragments.append(content["text"])

    return "\n".join(fragments)


def main():
    STATIC_DIR.mkdir(exist_ok=True)
    server = ThreadingHTTPServer(("127.0.0.1", PORT), AppHandler)
    print(f"Local competency app is running at http://127.0.0.1:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
