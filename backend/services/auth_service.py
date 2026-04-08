from datetime import datetime, timedelta
from jose import jwt
from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.user import User
from core.config import settings


def find_or_create_user_by_email(db: Session, email: str) -> User:
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        return existing_user

    name = email.split("@")[0]
    new_user = User(email=email, name=name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def issue_jwt(user_id: int) -> str:
    expire_at = datetime.utcnow() + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {"sub": str(user_id), "exp": expire_at}
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_jwt(token: str) -> int:
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        return int(payload["sub"])
    except Exception:
        raise HTTPException(status_code=401, detail="인증 토큰이 유효하지 않습니다")
