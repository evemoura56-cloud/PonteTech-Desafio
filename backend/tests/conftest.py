from __future__ import annotations

import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from app.core.config import get_settings

get_settings.cache_clear()

from app.core.dependencies import get_db
from app.db.base import Base
from app.main import app

engine = create_engine(get_settings().database_url, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


@pytest.fixture(scope="session", autouse=True)
def prepare_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def _clean_tables():
    with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            conn.execute(table.delete())


@pytest.fixture(autouse=True)
def clean_db():
    _clean_tables()
    yield
    _clean_tables()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)
