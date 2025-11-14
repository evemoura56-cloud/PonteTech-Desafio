from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.timestamps import utcnow
from app.utils.validators import ensure_password_strength


def get_user_by_email(session: Session, email: str) -> User | None:
    return session.scalar(select(User).where(User.email == email.lower()))


def create_user(session: Session, user_in: UserCreate) -> User:
    ensure_password_strength(user_in.password)
    user = User(
        email=user_in.email.lower(),
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
    )
    session.add(user)
    session.flush()
    return user


def authenticate_user(session: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(session, email)
    if user and verify_password(password, user.hashed_password):
        return user
    return None


def ensure_unique_email(session: Session, email: str) -> None:
    if get_user_by_email(session, email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")


def touch_last_login(session: Session, user: User) -> None:
    user.last_login = utcnow()
    session.add(user)
