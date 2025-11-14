from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_active_user
from app.models.user import User
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.services import task_service

router = APIRouter()


@router.get("/", response_model=list[TaskRead])
def list_tasks(
    session: Session = Depends(get_db),
    current_user: User = Depends(require_active_user),
):
    return task_service.list_tasks(session, current_user)


@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    session: Session = Depends(get_db),
    current_user: User = Depends(require_active_user),
):
    return task_service.create_task(session, current_user, task_in)


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    session: Session = Depends(get_db),
    current_user: User = Depends(require_active_user),
):
    return task_service.update_task(session, current_user, task_id, task_in)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    session: Session = Depends(get_db),
    current_user: User = Depends(require_active_user),
):
    task_service.delete_task(session, current_user, task_id)
    return
