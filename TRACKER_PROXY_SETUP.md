# Внутренний Proxy Для Яндекс Трекера

## Зачем

`designer-competency-form` крутится на Vercel, а Яндекс Трекер режет server-side OAuth-запросы с внешней инфраструктуры и требует `TVM`.

Поэтому рабочая схема такая:

1. Vercel-приложение ходит не в Трекер напрямую, а во внутренний proxy.
2. Внутренний proxy крутится внутри инфраструктуры Яндекса.
3. Proxy сам ходит в `st-api.yandex-team.ru` через `TVM` или, для локальной отладки, через `OAuth`.

## Что уже сделано в коде

- Vercel backend умеет использовать `TRACKER_PROXY_URL`.
- Внутренний сервис лежит в [tracker_proxy_server.py](/Users/bolshakovd/Desktop/кк/tracker_proxy_server.py).
- Proxy endpoint: `POST /tracker/context`

## Env для Vercel

Нужно добавить:

- `TRACKER_PROXY_URL=https://<internal-proxy-host>/tracker/context`
- `TRACKER_PROXY_TOKEN=<shared-secret>`

После этого Vercel перестанет ходить в Трекер напрямую и начнет ходить в proxy.

## Env для внутреннего proxy

Минимум:

- `TRACKER_PROXY_PORT=4040`
- `TRACKER_PROXY_SHARED_SECRET=<shared-secret>`

Для доступа к Трекеру:

Вариант 1. Предпочтительный, production:

- `YANDEX_TRACKER_SERVICE_TICKET=<service-ticket>`
- `YANDEX_TRACKER_USER_TICKET=<user-ticket>` если нужен user context

Вариант 2. Только для локальной отладки:

- `YANDEX_TRACKER_TOKEN=<oauth-token>`

Дополнительно при желании:

- `YANDEX_TRACKER_LOOKBACK_MONTHS=3`
- `YANDEX_TRACKER_MAX_ISSUES=40`
- `YANDEX_TRACKER_PAGE_SIZE=20`

## Как запустить proxy

```bash
python3 tracker_proxy_server.py
```

Или в контейнере:

```bash
docker build -f tracker-proxy.Dockerfile -t tracker-proxy .
docker run --env-file tracker-proxy.env.example -p 4040:4040 tracker-proxy
```

Сервис поднимется на:

```text
http://0.0.0.0:4040/tracker/context
```

## Формат запроса в proxy

```json
{
  "designer_name": "Денис Большаков",
  "tracker_login": "bolshakovd",
  "lookback_months": 3,
  "max_issues": 40
}
```

Заголовок авторизации:

```text
Authorization: Bearer <TRACKER_PROXY_SHARED_SECRET>
```

## Формат ответа

```json
{
  "tracker_context": "## данные из Яндекс Трекера ..."
}
```

## Что важно

- Если `tracker_login` передан, proxy не пытается искать пользователя через `/v3/users`, а сразу ищет задачи по логину.
- Это важно, потому что авто-поиск пользователя через внешний runtime чаще ломается на ограничениях Трекера.
- Для production лучше всегда передавать логин дизайнера явно.
