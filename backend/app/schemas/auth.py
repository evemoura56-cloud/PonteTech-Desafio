from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserRead


class AuthRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserRead
