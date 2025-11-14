from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient


def authenticate(client: TestClient) -> dict[str, str]:
    payload = {
        "email": "pilot@pontetech.com",
        "full_name": "Pilot",
        "password": "Secure123",
    }
    client.post("/auth/register", json=payload)
    response = client.post("/auth/login", json={"email": payload["email"], "password": payload["password"]})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_and_list_tasks(client: TestClient):
    headers = authenticate(client)
    due_date = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
    create_resp = client.post(
        "/tasks/",
        json={
            "title": "Deploy API",
            "description": "Align release window",
            "priority": "high",
            "status": "backlog",
            "due_date": due_date,
        },
        headers=headers,
    )
    assert create_resp.status_code == 201
    list_resp = client.get("/tasks/", headers=headers)
    assert list_resp.status_code == 200
    tasks = list_resp.json()
    assert len(tasks) == 1
    assert tasks[0]["title"] == "Deploy API"


def test_update_and_delete_task(client: TestClient):
    headers = authenticate(client)
    create_resp = client.post(
        "/tasks/",
        json={"title": "Sync", "description": "", "priority": "low", "status": "backlog"},
        headers=headers,
    )
    task_id = create_resp.json()["id"]
    update_resp = client.put(
        f"/tasks/{task_id}",
        json={"status": "done", "title": "Sync Updated"},
        headers=headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "done"
    delete_resp = client.delete(f"/tasks/{task_id}", headers=headers)
    assert delete_resp.status_code == 204
    list_resp = client.get("/tasks/", headers=headers)
    assert list_resp.json() == []
