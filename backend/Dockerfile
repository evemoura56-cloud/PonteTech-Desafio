FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app

RUN chmod +x scripts/entrypoint.sh

EXPOSE 8000

CMD ["./scripts/entrypoint.sh"]
