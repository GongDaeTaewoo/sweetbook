from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from db.database import get_db
from services.linky_service import generate_and_save_daily_comment
from core.utils import get_user_id

router = APIRouter(prefix="/linky", tags=["linky"])


@router.post("/comment/{diary_id}")
def generate_linky_comment(
    diary_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
):
    updated_diary = generate_and_save_daily_comment(db=db, diary_id=diary_id, user_id=user_id)
    return {
        "data": {
            "oneline": updated_diary.linky_oneline,
            "cheer": updated_diary.linky_cheer,
        }
    }
