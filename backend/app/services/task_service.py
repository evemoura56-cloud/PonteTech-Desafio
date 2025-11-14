from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.task import Task, TaskStatus
from app.models.user import User
from app.schemas.task import DashboardSummary, TaskCreate, TaskRead, TaskUpdate


def _normalize_due_date(value: datetime | None) -> datetime | None:
    if value is None:
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


def list_tasks(session: Session, user: User) -> list[TaskRead]:
    tasks = session.scalars(
        select(Task).where(Task.owner_id == user.id).order_by(Task.created_at.desc())
    ).all()
    return [TaskRead.model_validate(task) for task in tasks]


def create_task(session: Session, user: User, task_in: TaskCreate) -> TaskRead:
    task = Task(
        title=task_in.title,
        description=task_in.description,
        status=task_in.status,
        priority=task_in.priority,
        due_date=_normalize_due_date(task_in.due_date),
        owner_id=user.id,
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return TaskRead.model_validate(task)


def _get_user_task(session: Session, user: User, task_id: int) -> Task:
    task = session.get(Task, task_id)
    if task is None or task.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


def update_task(session: Session, user: User, task_id: int, task_in: TaskUpdate) -> TaskRead:
    task = _get_user_task(session, user, task_id)
    payload = task_in.model_dump(exclude_unset=True)
    if "due_date" in payload:
        payload["due_date"] = _normalize_due_date(payload["due_date"])
    for field, value in payload.items():
        setattr(task, field, value)
    session.add(task)
    session.commit()
    session.refresh(task)
    return TaskRead.model_validate(task)


def delete_task(session: Session, user: User, task_id: int) -> None:
    task = _get_user_task(session, user, task_id)
    session.delete(task)
    session.commit()


def generate_dashboard_summary(session: Session, user: User) -> DashboardSummary:
    total_tasks = session.scalar(select(func.count(Task.id)).where(Task.owner_id == user.id)) or 0
    completed_tasks = (
        session.scalar(
            select(func.count(Task.id)).where(Task.owner_id == user.id, Task.status == TaskStatus.done)
        )
        or 0
    )
    completion_rate = round((completed_tasks / total_tasks) * 100, 2) if total_tasks else 0.0
    upcoming_threshold = datetime.now(timezone.utc) + timedelta(days=3)
    upcoming_tasks = (
        session.scalar(
            select(func.count(Task.id)).where(
                Task.owner_id == user.id,
                Task.due_date.is_not(None),
                Task.due_date <= upcoming_threshold,
                Task.status != TaskStatus.done,
            )
        )
        or 0
    )
    active_projects = session.scalar(
        select(func.count(func.distinct(Task.priority))).where(Task.owner_id == user.id)
    ) or 0

    return DashboardSummary(
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        completion_rate=completion_rate,
        upcoming_tasks=upcoming_tasks,
        active_projects=active_projects,
    )
