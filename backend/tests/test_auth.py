from __future__ import annotations

from fastapi.testclient import TestClient


def _register_payload(email: str = "crew@pontetech.com") -> dict[str, str]:
    return {
        "email": email,
        "full_name": "Crew Mate",
        "password": "Secure123",
    }


def test_register_user(client: TestClient):
    response = client.post("/auth/register", json=_register_payload())
    assert response.status_code == 201
    body = response.json()
    assert body["email"] == "crew@pontetech.com"


def test_login_returns_token(client: TestClient):
    client.post("/auth/register", json=_register_payload())
    response = client.post(
        "/auth/login",
        json={"email": "crew@pontetech.com", "password": "Secure123"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body and body["token_type"] == "bearer"
