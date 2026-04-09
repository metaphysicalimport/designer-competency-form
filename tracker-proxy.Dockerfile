FROM python:3.11-slim

WORKDIR /app

COPY evaluation_service.py tracker_proxy_server.py ./

ENV PYTHONUNBUFFERED=1
ENV TRACKER_PROXY_PORT=4040

EXPOSE 4040

CMD ["python", "tracker_proxy_server.py"]
