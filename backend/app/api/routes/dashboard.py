from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_active_user
from app.models.user import User
from app.schemas.task import DashboardSummary
from app.services import task_service

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(
    session: Session = Depends(get_db),
    current_user: User = Depends(require_active_user),
):
    return task_service.generate_dashboard_summary(session, current_user)
