from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models.task import TaskStatus


class TaskBase(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: TaskStatus = TaskStatus.backlog
    priority: str = Field(default="medium", max_length=50)
    due_date: Optional[datetime] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=3, max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: Optional[TaskStatus] = None
    priority: Optional[str] = Field(default=None, max_length=50)
    due_date: Optional[datetime] = None


class TaskRead(TaskBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class DashboardSummary(BaseModel):
    total_tasks: int
    completed_tasks: int
    completion_rate: float
    upcoming_tasks: int
    active_projects: int
