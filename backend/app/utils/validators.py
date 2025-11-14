from __future__ import annotations

import re

from fastapi import HTTPException, status

PASSWORD_REGEX = re.compile(r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$")


def ensure_password_strength(password: str) -> None:
    if not PASSWORD_REGEX.match(password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain upper, lower case letters and numbers",
        )
