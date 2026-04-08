from datetime import date
from pydantic import BaseModel


class DiaryCreate(BaseModel):
    mood: int
    content: str = ""
    written_at: date


class LinkyComment(BaseModel):
    oneline: str
    cheer: str


class DiaryResponse(BaseModel):
    id: int
    written_at: date
    mood: int
    content: str
    photo_urls: list[str]
    linky_oneline: str
    linky_cheer: str

    class Config:
        from_attributes = True


class WeeklyReviewResponse(BaseModel):
    oneline: str
    cheer: str
    diary_count: int


class MonthlyReviewResponse(BaseModel):
    oneline: str
    cheer: str
    diary_count: int
