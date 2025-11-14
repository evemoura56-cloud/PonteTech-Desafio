from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.schemas.auth import AuthRequest, AuthResponse
from app.schemas.user import UserCreate, UserRead
from app.services import auth_service

router = APIRouter()


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, session: Session = Depends(get_db)):
    return auth_service.register_user(session, user_in)


@router.post("/login", response_model=AuthResponse)
def login(credentials: AuthRequest, session: Session = Depends(get_db)):
    return auth_service.login(session, credentials)
