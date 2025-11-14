from __future__ import annotations

import logging
import time
import uuid

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from structlog.contextvars import bind_contextvars
from starlette.middleware.base import BaseHTTPMiddleware

from app.api.routes import api_router
from app.core.config import get_settings

settings = get_settings()


def configure_logging() -> None:
    level = getattr(logging, settings.log_level.upper(), logging.INFO)
    logging.basicConfig(level=level, format="%(message)s")
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(level),
        cache_logger_on_first_use=True,
    )


def create_app() -> FastAPI:
    configure_logging()
    application = FastAPI(title=settings.project_name, version="1.0.0")
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.backend_cors_origins or ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    application.add_middleware(SecureHeadersMiddleware)

    logger = structlog.get_logger("ponte.api")

    @application.middleware("http")
    async def log_requests(request: Request, call_next):
        bind_contextvars(path=request.url.path, method=request.method)
        trace_id = str(uuid.uuid4())
        start = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            duration = round((time.perf_counter() - start) * 1000, 2)
            logger.exception("request_error", trace_id=trace_id, duration_ms=duration)
            raise
        duration = round((time.perf_counter() - start) * 1000, 2)
        logger.info(
            "request_completed",
            trace_id=trace_id,
            status_code=response.status_code,
            duration_ms=duration,
        )
        response.headers["X-Trace-Id"] = trace_id
        return response

    application.include_router(api_router)

    @application.get("/health", tags=["health"])
    def health_check():
        return {"status": "ok", "environment": settings.environment}

    return application


class SecureHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        return response


app = create_app()
