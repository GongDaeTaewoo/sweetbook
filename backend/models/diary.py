from datetime import datetime, date
from sqlalchemy import String, Text, Integer, Date, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from db.database import Base


class Diary(Base):
    __tablename__ = "diaries"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    written_at: Mapped[date] = mapped_column(Date, index=True)
    mood: Mapped[int] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(Text, default="")
    photo_urls: Mapped[str] = mapped_column(Text, default="")  # JSON 직렬화해서 저장
    linky_oneline: Mapped[str] = mapped_column(Text, default="")
    linky_cheer: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
