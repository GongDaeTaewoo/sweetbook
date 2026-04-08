import json
from datetime import date, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.diary import Diary
from schemas.diary import DiaryCreate


def save_diary(db: Session, user_id: int, body: DiaryCreate, photo_urls: list[str]) -> Diary:
    already_written_today = db.query(Diary).filter(
        Diary.user_id == user_id,
        Diary.written_at == body.written_at,
    ).first()

    if already_written_today:
        raise HTTPException(status_code=409, detail="해당 날짜에 이미 일기가 존재합니다")

    new_diary = Diary(
        user_id=user_id,
        written_at=body.written_at,
        mood=body.mood,
        content=body.content,
        photo_urls=json.dumps(photo_urls),
    )
    db.add(new_diary)
    db.commit()
    db.refresh(new_diary)
    return new_diary


def attach_linky_comment(db: Session, diary: Diary, oneline: str, cheer: str) -> Diary:
    diary.linky_oneline = oneline
    diary.linky_cheer = cheer
    db.commit()
    db.refresh(diary)
    return diary


def get_diary_by_id(db: Session, diary_id: int, user_id: int) -> Diary:
    diary = db.query(Diary).filter(
        Diary.id == diary_id,
        Diary.user_id == user_id,
    ).first()

    if not diary:
        raise HTTPException(status_code=404, detail="일기를 찾을 수 없습니다")
    return diary


def get_diaries_by_month(db: Session, user_id: int, year: int, month: int) -> list[Diary]:
    start = date(year, month, 1)
    end = date(year + 1, 1, 1) if month == 12 else date(year, month + 1, 1)
    return (
        db.query(Diary)
        .filter(
            Diary.user_id == user_id,
            Diary.written_at >= start,
            Diary.written_at < end,
        )
        .order_by(Diary.written_at.desc())
        .all()
    )


def get_recent_diaries(db: Session, user_id: int, days: int) -> list[Diary]:
    since = date.today() - timedelta(days=days)
    return (
        db.query(Diary)
        .filter(
            Diary.user_id == user_id,
            Diary.written_at >= since,
        )
        .order_by(Diary.written_at.asc())
        .all()
    )


def parse_photo_urls(diary: Diary) -> list[str]:
    return json.loads(diary.photo_urls) if diary.photo_urls else []
