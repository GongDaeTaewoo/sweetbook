from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.diary import Diary
from services.diary_service import get_diary_by_id, attach_linky_comment, get_recent_diaries
from external.claude_client import ask_linky_daily, ask_linky_weekly, ask_linky_monthly


def generate_and_save_daily_comment(db: Session, diary_id: int, user_id: int) -> Diary:
    diary = get_diary_by_id(db, diary_id, user_id)

    try:
        linky_response = ask_linky_daily(mood=diary.mood, content=diary.content)
    except Exception:
        raise HTTPException(status_code=502, detail="AI 서비스 오류")

    return attach_linky_comment(
        db=db,
        diary=diary,
        oneline=linky_response["oneline"],
        cheer=linky_response["cheer"],
    )


def generate_weekly_review(db: Session, user_id: int) -> dict:
    recent_diaries = get_recent_diaries(db, user_id, days=7)

    if len(recent_diaries) < 7:
        raise HTTPException(status_code=422, detail="주간 리뷰에 일기가 부족합니다 (최근 7일 필요)")

    try:
        linky_response = ask_linky_weekly(recent_diaries)
    except Exception:
        raise HTTPException(status_code=502, detail="AI 서비스 오류")

    return {
        "oneline": linky_response["oneline"],
        "cheer": linky_response["cheer"],
        "diary_count": len(recent_diaries),
    }


def generate_monthly_review(db: Session, user_id: int) -> dict:
    recent_diaries = get_recent_diaries(db, user_id, days=30)

    if len(recent_diaries) < 28:
        raise HTTPException(status_code=422, detail="월간 리뷰에 일기가 부족합니다 (최근 28일 필요)")

    try:
        linky_response = ask_linky_monthly(recent_diaries)
    except Exception:
        raise HTTPException(status_code=502, detail="AI 서비스 오류")

    return {
        "oneline": linky_response["oneline"],
        "cheer": linky_response["cheer"],
        "diary_count": len(recent_diaries),
    }
