from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import create_access_token
from app.schemas.auth import AuthRequest, AuthResponse
from app.schemas.user import UserCreate, UserRead
from app.services import user_service

settings = get_settings()


def register_user(session: Session, user_in: UserCreate) -> UserRead:
    user_service.ensure_unique_email(session, user_in.email)
    user = user_service.create_user(session, user_in)
    session.commit()
    session.refresh(user)
    return UserRead.model_validate(user)


def login(session: Session, credentials: AuthRequest) -> AuthResponse:
    user = user_service.authenticate_user(session, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(
        subject=user.id,
        extra_claims={"email": user.email},
    )
    user_service.touch_last_login(session, user)
    session.commit()
    session.refresh(user)
    return AuthResponse(
        access_token=access_token,
        expires_in=settings.access_token_expire_minutes * 60,
        user=UserRead.model_validate(user),
    )
