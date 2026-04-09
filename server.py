import json
import os
import secrets
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from evaluation_service import build_tracker_context_from_token, evaluate_designer


BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
PORT = int(os.environ.get("PORT", "4020"))
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
OPENAI_MODEL = "gpt-5-pro"
OPENAI_API_URL = "https://api.openai.com/v1/responses"
OPENAI_TRANSCRIPTION_MODEL = os.environ.get("OPENAI_TRANSCRIPTION_MODEL", "gpt-4o-mini-transcribe")
OPENAI_TRANSCRIPTION_API_URL = "https://api.openai.com/v1/audio/transcriptions"


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
        if self.path == "/api/evaluate":
            return self.handle_evaluation_request()
        if self.path in {"/api/tracker-context", "/api/tracker_context"}:
            return self.handle_tracker_context_request()
        if self.path == "/api/transcribe":
            return self.handle_transcription_request()
        self.send_error(404, "Not Found")
        return

    def handle_evaluation_request(self):
        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            self.respond_json({"error": "Некорректный JSON в запросе."}, status=400)
            return

        card_markdown = str(payload.get("card_markdown") or "").strip()
        designer_name = str(payload.get("designer_name") or "").strip()
        tracker_login = str(payload.get("tracker_login") or "").strip()
        tracker_context = str(payload.get("tracker_context") or "").strip()
        tracker_warning = str(payload.get("tracker_warning") or "").strip()
        if not card_markdown:
            self.respond_json({"error": "Пустая анкета. Нечего отправлять на оценку."}, status=400)
            return

        try:
            evaluation = evaluate_designer(
                card_markdown=card_markdown,
                designer_name=designer_name,
                tracker_login=tracker_login,
                tracker_context_override=tracker_context,
                tracker_warning_override=tracker_warning,
            )
        except ValueError as error:
            self.respond_json({"error": str(error)}, status=400)
            return
        except RuntimeError as error:
            self.respond_json({"error": str(error)}, status=502)
            return

        self.respond_json(evaluation)

    def handle_tracker_context_request(self):
        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            self.respond_json({"error": "Некорректный JSON в запросе."}, status=400)
            return

        designer_name = str(payload.get("designer_name") or "").strip()
        tracker_login = str(payload.get("tracker_login") or "").strip()
        tracker_token = str(payload.get("tracker_token") or "").strip()
        period_start = str(payload.get("period_start") or "").strip()
        period_end = str(payload.get("period_end") or "").strip()

        if not designer_name and not tracker_login:
            self.respond_json({"error": "Передай designer_name или tracker_login."}, status=400)
            return
        if not tracker_token:
            self.respond_json({"error": "Не указан OAuth-токен Трекера."}, status=400)
            return

        try:
            tracker_context = build_tracker_context_from_token(
                designer_name=designer_name,
                tracker_login=tracker_login,
                tracker_token=tracker_token,
                period_start=period_start,
                period_end=period_end,
            )
        except RuntimeError as error:
            self.respond_json({"error": str(error)}, status=502)
            return

        self.respond_json({"tracker_context": tracker_context})

    def handle_transcription_request(self):
        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)
        content_type = self.headers.get("Content-Type", "")

        if "application/json" in content_type:
            try:
                payload = json.loads(raw_body.decode("utf-8"))
            except json.JSONDecodeError:
                self.respond_json({"error": "Некорректный JSON в запросе."}, status=400)
                return

            audio_bytes, mime_type = parse_json_audio_payload(payload)
        else:
            audio_bytes = raw_body
            mime_type = self.headers.get("X-Audio-Mime-Type") or content_type or "audio/webm"

        if not audio_bytes:
            self.respond_json({"error": "Пустая аудиозапись. Нечего отправлять на расшифровку."}, status=400)
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
            transcript_text = request_openai_transcription(audio_bytes, mime_type)
        except RuntimeError as error:
            self.respond_json({"error": str(error)}, status=502)
            return

        self.respond_json({"text": transcript_text})

    def respond_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def parse_json_audio_payload(payload):
    import base64

    audio_base64 = str(payload.get("audio_base64") or "").strip()
    mime_type = str(payload.get("mime_type") or "audio/webm").strip() or "audio/webm"
    if not audio_base64:
        raise RuntimeError("Пустая аудиозапись. Нечего отправлять на расшифровку.")

    try:
        audio_bytes = base64.b64decode(audio_base64, validate=True)
    except Exception as error:
        raise RuntimeError("Не удалось декодировать аудиозапись.") from error

    return audio_bytes, mime_type


def request_openai_transcription(audio_bytes, mime_type):
    boundary = f"----OpenAIBoundary{secrets.token_hex(16)}"
    file_name = f"voice-note.{get_audio_extension(mime_type)}"
    body = build_transcription_multipart_body(boundary, audio_bytes, file_name, mime_type)

    request = Request(
        OPENAI_TRANSCRIPTION_API_URL,
        data=body,
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
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
    transcript_text = str(parsed.get("text") or "").strip()
    if not transcript_text:
        raise RuntimeError("OpenAI не вернул текст транскрибации.")

    return transcript_text


def build_transcription_multipart_body(boundary, audio_bytes, file_name, mime_type):
    parts = []

    for name, value in (
        ("model", OPENAI_TRANSCRIPTION_MODEL),
        ("language", "ru"),
    ):
        parts.append(
            (
                f"--{boundary}\r\n"
                f'Content-Disposition: form-data; name="{name}"\r\n\r\n'
                f"{value}\r\n"
            ).encode("utf-8")
        )

    parts.append(
        (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="file"; filename="{file_name}"\r\n'
            f"Content-Type: {mime_type}\r\n\r\n"
        ).encode("utf-8")
    )
    parts.append(audio_bytes)
    parts.append(b"\r\n")
    parts.append(f"--{boundary}--\r\n".encode("utf-8"))

    return b"".join(parts)


def get_audio_extension(mime_type):
    if "wav" in mime_type or "wave" in mime_type:
        return "wav"
    if "mpeg" in mime_type or "mp3" in mime_type or "mpga" in mime_type:
        return "mp3"
    if "mp4" in mime_type:
        return "mp4"
    if "ogg" in mime_type:
        return "ogg"
    return "webm"


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
