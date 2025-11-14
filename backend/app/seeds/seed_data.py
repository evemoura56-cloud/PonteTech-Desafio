from __future__ import annotations

from datetime import datetime, timedelta, timezone

from faker import Faker
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.schemas.task import TaskCreate, TaskStatus
from app.schemas.user import UserCreate
from app.services import task_service, user_service

fake = Faker()


def seed() -> None:
    session: Session = SessionLocal()
    try:
        primary_email = "leader@pontetech.com"
        user = user_service.get_user_by_email(session, primary_email)
        if not user:
            user = user_service.create_user(
                session,
                UserCreate(
                    email=primary_email,
                    full_name="Leader Ponte",
                    password="PonteTech123",
                ),
            )
            session.commit()
            session.refresh(user)

        existing_tasks = task_service.list_tasks(session, user)
        if not existing_tasks:
            for index in range(5):
                task_service.create_task(
                    session,
                    user,
                    TaskCreate(
                        title=f"Initiative {index + 1}",
                        description=fake.paragraph(nb_sentences=3),
                        status=TaskStatus.backlog if index < 3 else TaskStatus.in_progress,
                        priority="high" if index % 2 == 0 else "medium",
                        due_date=datetime.now(timezone.utc) + timedelta(days=index + 1),
                    ),
                )
    finally:
        session.close()


if __name__ == "__main__":
    seed()
