from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from db.database import get_db
from services.auth_service import find_or_create_user_by_email, issue_jwt, decode_jwt
from models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])


class EmailLoginRequest(BaseModel):
    email: EmailStr


@router.post("/login")
def email_login(body: EmailLoginRequest, db: Session = Depends(get_db)):
    user = find_or_create_user_by_email(db=db, email=body.email)
    jwt_token = issue_jwt(user.id)
    return {
        "data": {
            "access_token": jwt_token,
            "user": {"id": user.id, "name": user.name, "email": user.email},
        }
    }


@router.get("/me")
def get_me(authorization: str = Header(), db: Session = Depends(get_db)):
    token = authorization.replace("Bearer ", "")
    user_id = decode_jwt(token)
    user = db.query(User).filter(User.id == user_id).first()
    return {"data": {"id": user.id, "name": user.name, "email": user.email}}


@router.post("/logout")
def logout():
    return {"data": {"message": "로그아웃 됐어요"}}

