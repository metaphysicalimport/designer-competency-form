import json
import os
import re
from datetime import datetime, timezone
from html import unescape
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


def normalize_env_token(value):
    normalized = str(value or "").strip().lower()
    normalized = re.sub(r"[^a-z0-9а-яё]+", "", normalized)
    return normalized


OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4.1")
OPENAI_API_URL = "https://api.openai.com/v1/responses"

YANDEX_TRACKER_TOKEN = os.environ.get("YANDEX_TRACKER_TOKEN", "")
YANDEX_TRACKER_SERVICE_TICKET = os.environ.get("YANDEX_TRACKER_SERVICE_TICKET", "").strip()
YANDEX_TRACKER_USER_TICKET = os.environ.get("YANDEX_TRACKER_USER_TICKET", "").strip()
YANDEX_TRACKER_BASE_URL = os.environ.get("YANDEX_TRACKER_BASE_URL", "https://st-api.yandex-team.ru").rstrip("/")
TRACKER_PROXY_URL = os.environ.get("TRACKER_PROXY_URL", "").strip()
TRACKER_PROXY_TOKEN = os.environ.get("TRACKER_PROXY_TOKEN", "").strip()
TRACKER_PROXY_TIMEOUT_SECONDS = max(5, int(os.environ.get("TRACKER_PROXY_TIMEOUT_SECONDS", "60")))
YANDEX_TRACKER_LOOKBACK_MONTHS = max(1, int(os.environ.get("YANDEX_TRACKER_LOOKBACK_MONTHS", "3")))
YANDEX_TRACKER_MAX_ISSUES = max(1, int(os.environ.get("YANDEX_TRACKER_MAX_ISSUES", "40")))
YANDEX_TRACKER_PAGE_SIZE = min(50, max(1, int(os.environ.get("YANDEX_TRACKER_PAGE_SIZE", "20"))))
TRACKER_DESCRIPTION_LIMIT = 360
TRACKER_TASK_SNIPPET_LIMIT = 20
YANDEX_TRACKER_EXCLUDED_QUEUE_KEYS = {
    normalize_env_token(token)
    for token in os.environ.get(
        "YANDEX_TRACKER_EXCLUDED_QUEUE_KEYS",
        "EQUIPMENT,CORPORATEETHICS,SECURITYAWARENESS,SECURITY_AWARENESS",
    ).split(",")
    if normalize_env_token(token)
}
YANDEX_TRACKER_EXCLUDED_TYPE_KEYS = {
    normalize_env_token(token)
    for token in os.environ.get(
        "YANDEX_TRACKER_EXCLUDED_TYPE_KEYS",
        "newdocument,education",
    ).split(",")
    if normalize_env_token(token)
}
YANDEX_TRACKER_EXCLUDED_TYPE_NAMES = {
    normalize_env_token(token)
    for token in os.environ.get(
        "YANDEX_TRACKER_EXCLUDED_TYPE_NAMES",
        "Новый документ,Обучение",
    ).split(",")
    if normalize_env_token(token)
}

EVALUATION_INSTRUCTIONS = """
проанализируй содержимое анкеты, критерии карты компетенции и данные из Яндекс Трекера, если они приложены, и подготовь оценку дизайнера, его грейд и точки роста.

используй данные из Трекера как дополнительный сигнал, а не как единственный источник истины. смотри на сложность, масштаб, тип задач, повторяемость вкладов, продуктовый контекст, качество формулировок и косвенные сигналы зрелости. не делай вывод только по количеству задач.

верни результат в markdown на русском языке.

структура ответа:
# оценка дизайнера

## итог
- рекомендуемый грейд
- уверенность в оценке
- краткий вывод

## обоснование грейда

## сигналы из Яндекс Трекера

## сильные стороны

## точки роста

## риски и пробелы в данных

## рекомендации для следующего шага
""".strip()


def evaluate_designer(card_markdown, designer_name="", tracker_login=""):
    normalized_card = str(card_markdown or "").strip()
    if not normalized_card:
        raise ValueError("Пустая анкета. Нечего отправлять на оценку.")

    if not OPENAI_API_KEY:
        raise RuntimeError("На сервере не настроен OPENAI_API_KEY.")

    tracker_context = ""
    tracker_warning = ""
    if designer_name or tracker_login:
        try:
            tracker_context = build_tracker_context(designer_name=designer_name, tracker_login=tracker_login)
        except RuntimeError as error:
            tracker_warning = humanize_tracker_error(error)

    evaluation_text = request_openai_evaluation(
        build_openai_input(
            card_markdown=normalized_card,
            tracker_context=tracker_context,
            tracker_warning=tracker_warning,
        )
    )
    return {
        "file_name": "designer-assessment-result.md",
        "content": evaluation_text,
        "tracker_context_used": bool(tracker_context),
        "tracker_warning": tracker_warning or None,
    }


def build_openai_input(card_markdown, tracker_context, tracker_warning=""):
    sections = [
        "# анкета для оценки дизайнера",
        "",
        card_markdown.strip(),
    ]

    if tracker_context:
        sections.extend(["", tracker_context.strip()])
    elif tracker_warning:
        sections.extend(
            [
                "",
                "## статус данных из Яндекс Трекера",
                "",
                tracker_warning.strip(),
            ]
        )

    return "\n".join(sections).strip()


def build_tracker_context(designer_name="", tracker_login=""):
    if TRACKER_PROXY_URL:
        return build_tracker_context_via_proxy(
            designer_name=designer_name,
            tracker_login=tracker_login,
        )

    if not any((YANDEX_TRACKER_TOKEN, YANDEX_TRACKER_SERVICE_TICKET, YANDEX_TRACKER_USER_TICKET)):
        raise RuntimeError(
            "На сервере не настроен ни TRACKER_PROXY_URL, ни прямой доступ к Трекеру через OAuth/TVM."
        )

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
                "Не удалось автоматически определить пользователя в Яндекс Трекере. Укажи логин дизайнера в поле \"логин в Трекере\"."
            )

    issues = fetch_tracker_issues(user["login"])
    if not issues:
        return (
            "## данные из Яндекс Трекера\n\n"
            f"- дизайнер: {user['display']} ({user['login']})\n"
            f"- период: последние {YANDEX_TRACKER_LOOKBACK_MONTHS} месяца\n"
            "- задач по фильтру не найдено\n"
        )

    return render_tracker_context(user, issues)


def build_tracker_context_via_proxy(designer_name="", tracker_login=""):
    request_payload = {
        "designer_name": str(designer_name or "").strip(),
        "tracker_login": str(tracker_login or "").strip(),
        "lookback_months": YANDEX_TRACKER_LOOKBACK_MONTHS,
        "max_issues": YANDEX_TRACKER_MAX_ISSUES,
    }

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    if TRACKER_PROXY_TOKEN:
        headers["Authorization"] = f"Bearer {TRACKER_PROXY_TOKEN}"

    request = Request(
        TRACKER_PROXY_URL,
        data=json.dumps(request_payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with urlopen(request, timeout=TRACKER_PROXY_TIMEOUT_SECONDS) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        details = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Внутренний proxy вернул ошибку {error.code}: {details}")
    except URLError as error:
        raise RuntimeError(f"Не удалось подключиться к внутреннему proxy: {error.reason}")

    tracker_context = str(payload.get("tracker_context") or "").strip()
    if not tracker_context:
        raise RuntimeError("Внутренний proxy не вернул tracker_context.")

    return tracker_context


def request_openai_evaluation(evaluation_input):
    request_payload = {
        "model": OPENAI_MODEL,
        "instructions": EVALUATION_INSTRUCTIONS,
        "input": evaluation_input,
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


def humanize_tracker_error(error):
    message = str(error).strip()
    lowered = message.lower()

    if "используйте tvm" in lowered or "use tvm" in lowered:
        return (
            "Яндекс Трекер отклонил OAuth-запрос с Vercel. Для автоматической server-side интеграции нужен TVM "
            "или внутренний proxy внутри инфраструктуры Яндекса. Оценка ниже построена только по анкете и вложениям."
        )

    return f"Данные из Яндекс Трекера временно недоступны: {message}"


def resolve_tracker_user(identifier):
    normalized = normalize_lookup_value(identifier)
    if not normalized:
        return None

    direct_user = resolve_tracker_user_by_login(normalized)
    if direct_user:
        return direct_user

    encoded_query = quote(normalized)
    payload = tracker_request_json(f"/v3/users?query={encoded_query}", method="GET")
    users = payload if isinstance(payload, list) else []
    if not users:
        return None

    scored_users = []
    for user in users:
        if not isinstance(user, dict):
            continue
        score = score_tracker_user_candidate(user, normalized)
        if score <= 0:
            continue
        scored_users.append((score, user))

    if not scored_users:
        return None

    scored_users.sort(key=lambda item: item[0], reverse=True)
    winner = scored_users[0][1]
    return {
        "login": str(winner.get("login") or "").strip(),
        "display": str(winner.get("display") or "").strip() or str(winner.get("login") or "").strip(),
        "first_name": str(winner.get("firstName") or "").strip(),
        "last_name": str(winner.get("lastName") or "").strip(),
    }


def resolve_tracker_user_by_login(login):
    candidate = str(login or "").strip()
    if not candidate or " " in candidate:
        return None

    try:
        payload = tracker_request_json(f"/v3/users/{quote(candidate)}", method="GET")
    except RuntimeError:
        return None

    if not isinstance(payload, dict):
        return None

    resolved_login = str(payload.get("login") or "").strip()
    if not resolved_login:
        return None

    return {
        "login": resolved_login,
        "display": str(payload.get("display") or "").strip() or resolved_login,
        "first_name": str(payload.get("firstName") or "").strip(),
        "last_name": str(payload.get("lastName") or "").strip(),
    }


def fetch_tracker_issues(login):
    query = (
        f'Assignee: {login}@ AND Updated: > today() - "{YANDEX_TRACKER_LOOKBACK_MONTHS}M" '
        '"Sort by": Updated DESC'
    )

    issues = []
    page = 1
    while len(issues) < YANDEX_TRACKER_MAX_ISSUES:
        batch = tracker_request_json(
            f"/v3/issues/_search?perPage={YANDEX_TRACKER_PAGE_SIZE}&page={page}",
            method="POST",
            payload={"query": query},
        )
        batch = batch if isinstance(batch, list) else []
        if not batch:
            break

        issues.extend(issue for issue in batch if is_issue_relevant(issue))
        if len(batch) < YANDEX_TRACKER_PAGE_SIZE:
            break

        page += 1

    return issues[:YANDEX_TRACKER_MAX_ISSUES]


def tracker_request_json(path, method="GET", payload=None):
    request = Request(
        f"{YANDEX_TRACKER_BASE_URL}{path}",
        data=json.dumps(payload).encode("utf-8") if payload is not None else None,
        headers=build_tracker_headers(payload is not None),
        method=method,
    )

    try:
        with urlopen(request, timeout=60) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        details = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Яндекс Трекер вернул ошибку {error.code}: {details}")
    except URLError as error:
        raise RuntimeError(f"Не удалось подключиться к Яндекс Трекеру: {error.reason}")


def build_tracker_headers(has_json_body):
    headers = {"Accept": "application/json"}

    if YANDEX_TRACKER_SERVICE_TICKET:
        headers["X-Ya-Service-Ticket"] = YANDEX_TRACKER_SERVICE_TICKET
    if YANDEX_TRACKER_USER_TICKET:
        headers["X-Ya-User-Ticket"] = YANDEX_TRACKER_USER_TICKET
    if not YANDEX_TRACKER_SERVICE_TICKET and not YANDEX_TRACKER_USER_TICKET and YANDEX_TRACKER_TOKEN:
        headers["Authorization"] = f"OAuth {YANDEX_TRACKER_TOKEN}"

    if (
        "Authorization" not in headers
        and "X-Ya-Service-Ticket" not in headers
        and "X-Ya-User-Ticket" not in headers
    ):
        raise RuntimeError(
            "Не настроены credentials для Яндекс Трекера. Укажи TRACKER_PROXY_URL или TVM/OAuth переменные."
        )

    if has_json_body:
        headers["Content-Type"] = "application/json"
    return headers


def score_tracker_user_candidate(user, lookup):
    lookup_normalized = normalize_lookup_value(lookup)
    login = normalize_lookup_value(user.get("login"))
    display = normalize_lookup_value(user.get("display"))
    full_name = normalize_lookup_value(f"{user.get('firstName') or ''} {user.get('lastName') or ''}")
    dismissed = bool(user.get("dismissed"))

    if not login:
        return 0

    if login == lookup_normalized:
        return 800 if dismissed else 1000
    if display == lookup_normalized:
        return 750 if dismissed else 950
    if full_name == lookup_normalized:
        return 700 if dismissed else 900
    if login.startswith(lookup_normalized):
        return 500 if dismissed else 700
    if display.startswith(lookup_normalized) or full_name.startswith(lookup_normalized):
        return 450 if dismissed else 650
    if lookup_normalized in login:
        return 300 if dismissed else 500
    if lookup_normalized in display or lookup_normalized in full_name:
        return 250 if dismissed else 450

    lookup_tokens = set(token for token in lookup_normalized.split() if token)
    full_name_tokens = set(token for token in full_name.split() if token)
    if lookup_tokens and lookup_tokens.issubset(full_name_tokens):
        return (200 if dismissed else 400) + len(lookup_tokens)

    return 0


def render_tracker_context(user, issues):
    queue_counts = {}
    status_counts = {}
    type_counts = {}
    with_description_count = 0
    resolved_count = 0

    for issue in issues:
        queue_name = extract_nested_display(issue.get("queue"))
        status_name = extract_nested_display(issue.get("status"))
        type_name = extract_nested_display(issue.get("type"))

        if queue_name:
            queue_counts[queue_name] = queue_counts.get(queue_name, 0) + 1
        if status_name:
            status_counts[status_name] = status_counts.get(status_name, 0) + 1
        if type_name:
            type_counts[type_name] = type_counts.get(type_name, 0) + 1
        if normalize_issue_description(issue):
            with_description_count += 1
        if issue.get("resolvedAt"):
            resolved_count += 1

    lines = [
        "## данные из Яндекс Трекера",
        "",
        f"- дизайнер: {user['display']} ({user['login']})",
        f"- период: последние {YANDEX_TRACKER_LOOKBACK_MONTHS} месяца",
        f"- найдено задач: {len(issues)}",
        f"- закрыто задач: {resolved_count}",
        f"- задач с описанием: {with_description_count}",
        f"- основные очереди: {format_counter(queue_counts)}",
        f"- статусы: {format_counter(status_counts)}",
        f"- типы задач: {format_counter(type_counts)}",
        "",
        "### последние задачи",
        "",
    ]

    for issue in issues[:TRACKER_TASK_SNIPPET_LIMIT]:
        lines.extend(render_issue_snippet(issue))

    return "\n".join(lines).strip()


def render_issue_snippet(issue):
    key = str(issue.get("key") or "").strip() or "без ключа"
    summary = str(issue.get("summary") or "").strip() or "без названия"
    issue_type = extract_nested_display(issue.get("type")) or "без типа"
    status = extract_nested_display(issue.get("status")) or "без статуса"
    queue_name = extract_nested_display(issue.get("queue")) or "без очереди"
    updated_at = format_tracker_date(issue.get("updatedAt"))
    resolved_at = format_tracker_date(issue.get("resolvedAt"))
    description = trim_text(normalize_issue_description(issue), TRACKER_DESCRIPTION_LIMIT)

    lines = [
        f"- {key} | {summary}",
        f"  очередь: {queue_name}; тип: {issue_type}; статус: {status}; updated: {updated_at}"
        + (f"; resolved: {resolved_at}" if resolved_at else ""),
    ]

    if description:
        lines.append(f"  описание: {description}")

    return lines


def is_issue_relevant(issue):
    if not isinstance(issue, dict):
        return False

    queue_value = issue.get("queue") or {}
    issue_type_value = issue.get("type") or {}

    queue_key = normalize_env_token(extract_nested_value(queue_value, "key"))
    queue_display = normalize_env_token(extract_nested_value(queue_value, "display"))
    issue_type_key = normalize_env_token(extract_nested_value(issue_type_value, "key"))
    issue_type_display = normalize_env_token(extract_nested_value(issue_type_value, "display"))

    if queue_key in YANDEX_TRACKER_EXCLUDED_QUEUE_KEYS or queue_display in YANDEX_TRACKER_EXCLUDED_QUEUE_KEYS:
        return False
    if issue_type_key in YANDEX_TRACKER_EXCLUDED_TYPE_KEYS:
        return False
    if issue_type_display in YANDEX_TRACKER_EXCLUDED_TYPE_NAMES:
        return False

    return True


def normalize_issue_description(issue):
    description = str(issue.get("description") or "")
    if not description:
        return ""

    text = unescape(description)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\[[^\]]+\]\(([^)]+)\)", r"\1", text)
    text = text.replace("&nbsp;", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_nested_display(value):
    if isinstance(value, dict):
        display = str(value.get("display") or "").strip()
        if display:
            return display
        key = str(value.get("key") or "").strip()
        if key:
            return key
    return ""


def extract_nested_value(value, key):
    if isinstance(value, dict):
        return str(value.get(key) or "").strip()
    return ""


def format_counter(counter_map):
    if not counter_map:
        return "нет данных"

    pairs = sorted(counter_map.items(), key=lambda item: (-item[1], item[0].lower()))
    return ", ".join(f"{name} ({count})" for name, count in pairs[:5])


def trim_text(value, limit):
    text = str(value or "").strip()
    if len(text) <= limit:
        return text
    return text[: max(0, limit - 1)].rstrip() + "…"


def format_tracker_date(value):
    if not value:
        return ""

    try:
        normalized = str(value).replace("Z", "+00:00")
        if re.search(r"[+-]\d{4}$", normalized):
            normalized = normalized[:-5] + normalized[-5:-2] + ":" + normalized[-2:]
        moment = datetime.fromisoformat(normalized)
        if not moment.tzinfo:
            moment = moment.replace(tzinfo=timezone.utc)
        return moment.astimezone(timezone.utc).strftime("%Y-%m-%d")
    except ValueError:
        return str(value)


def normalize_lookup_value(value):
    normalized = str(value or "").strip().lower()
    normalized = normalized.replace("@yandex-team.ru", "").replace("@", " ")
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized


def normalize_tracker_login(value):
    normalized = str(value or "").strip().lower()
    normalized = normalized.replace("@yandex-team.ru", "").replace("@", "")
    normalized = re.sub(r"\s+", "", normalized)
    return normalized


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
