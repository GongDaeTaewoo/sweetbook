import os
import re
import uuid
import aiofiles
from datetime import date
from fastapi import APIRouter, Depends, Header, UploadFile, File, Form
from sqlalchemy.orm import Session
from services.linky_service import generate_weekly_review, generate_monthly_review

from db.database import get_db
from models.user import User
from services.diary_service import save_diary, get_diary_by_id, get_diaries_by_month, parse_photo_urls
from schemas.diary import DiaryCreate
from core.config import settings
from core.utils import get_user_id

router = APIRouter(prefix="/diaries", tags=["diaries"])


def _make_photo_filename(email: str, written_at: date, original_filename: str) -> str:
    email_local = re.sub(r"[^a-zA-Z0-9]", "_", email.split("@")[0])
    ext = original_filename.rsplit(".", 1)[-1].lower() if "." in original_filename else "jpg"
    uid8 = uuid.uuid4().hex[:8]
    return f"{email_local}_{written_at}_{uid8}.{ext}"


def diary_to_response(diary) -> dict:
    return {
        "id": diary.id,
        "written_at": str(diary.written_at),
        "mood": diary.mood,
        "content": diary.content,
        "photo_urls": parse_photo_urls(diary),
        "linky_oneline": diary.linky_oneline,
        "linky_cheer": diary.linky_cheer,
    }


@router.post("")
async def create_diary(
    mood: int = Form(),
    content: str = Form(default=""),
    written_at: date = Form(),
    photos: list[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
):
    user = db.query(User).filter(User.id == user_id).first()
    saved_photo_urls = []
    os.makedirs(settings.upload_dir, exist_ok=True)

    for photo in photos:
        file_name = _make_photo_filename(user.email, written_at, photo.filename)
        file_path = os.path.join(settings.upload_dir, file_name)
        async with aiofiles.open(file_path, "wb") as fp:
            await fp.write(await photo.read())
        saved_photo_urls.append(f"/uploads/{file_name}")

    diary_data = DiaryCreate(mood=mood, content=content, written_at=written_at)
    diary = save_diary(db=db, user_id=user_id, body=diary_data, photo_urls=saved_photo_urls)

    return {"data": diary_to_response(diary)}


@router.get("")
def get_diaries(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
):
    diaries = get_diaries_by_month(db=db, user_id=user_id, year=year, month=month)
    return {"data": [diary_to_response(d) for d in diaries]}


@router.get("/review/weekly")
def get_weekly_review(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
):
    review = generate_weekly_review(db=db, user_id=user_id)
    return {"data": review}


@router.get("/review/monthly")
def get_monthly_review(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
):
    review = generate_monthly_review(db=db, user_id=user_id)
    return {"data": review}


@router.get("/{diary_id}")
def get_diary(
    diary_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
):
    diary = get_diary_by_id(db=db, diary_id=diary_id, user_id=user_id)
    return {"data": diary_to_response(diary)}
