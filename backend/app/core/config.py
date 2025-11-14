from __future__ import annotations

from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    project_name: str = "PonteTech Mission Control"
    environment: str = Field(default="local")
    secret_key: str = Field(default="super-secret")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7
    database_url: str = Field(default="postgresql+psycopg://ponte:ponte@db:5432/ponte")
    alembic_database_url: str | None = None
    backend_cors_origins: List[str] = Field(default_factory=lambda: ["http://localhost:5173"])
    frontend_url: str = Field(default="http://localhost:5173")
    log_level: str = Field(default="INFO")


@lru_cache
def get_settings() -> Settings:
    return Settings()
