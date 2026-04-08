import os
from datetime import date
from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.diary import Diary
from services.diary_service import parse_photo_urls
from external import sweetbook_client
from core.config import settings


def _local_path(photo_url: str) -> str:
    filename = photo_url.removeprefix("/uploads/")
    return os.path.join(settings.upload_dir, filename)


def _collect_local_paths(diaries: list[Diary]) -> list[str]:
    paths = []
    for diary in diaries:
        for url in parse_photo_urls(diary):
            path = _local_path(url)
            if os.path.exists(path) and path not in paths:
                paths.append(path)
    return paths


def create_healing_book(
    db: Session,
    user_id: int,
    start_date: date | None = None,
    end_date: date | None = None,
    limit: int | None = None,
) -> dict:
    query = db.query(Diary).filter(Diary.user_id == user_id)

    if limit:
        diaries = query.order_by(Diary.written_at.desc()).limit(limit).all()
    else:
        diaries = (
            query
            .filter(Diary.written_at >= start_date, Diary.written_at <= end_date)
            .order_by(Diary.written_at.desc())
            .all()
        )

    if not diaries:
        raise HTTPException(status_code=404, detail="선택한 기간에 일기가 없습니다")

    oldest, newest = diaries[-1].written_at, diaries[0].written_at
    title = f"나의 치유 이야기 ({oldest.strftime('%Y.%m.%d')} ~ {newest.strftime('%Y.%m.%d')})"
    book_uid = sweetbook_client.create_book(title)

    default_path = os.path.join(settings.upload_dir, "default-cover.png")
    local_paths = _collect_local_paths(diaries)
    all_paths = list(dict.fromkeys([default_path] + local_paths))  # default 항상 포함, 중복 제거
    path_to_filename = sweetbook_client.upload_photos(book_uid, all_paths)
    default_filename = path_to_filename[default_path]

    front_photo = None
    for diary in diaries:
        for url in parse_photo_urls(diary):
            path = _local_path(url)
            if path in path_to_filename:
                front_photo = path_to_filename[path]
                break
        if front_photo:
            break

    used_default_cover = front_photo is None
    if used_default_cover:
        front_photo = default_filename

    date_range = f"{oldest.strftime('%d.%m')} - {newest.strftime('%d.%m')}"
    sweetbook_client.create_cover(book_uid, title, front_photo, date_range)

    for diary in diaries:
        photo_filenames = [
            path_to_filename[_local_path(url)]
            for url in parse_photo_urls(diary)
            if _local_path(url) in path_to_filename
        ]
        if not photo_filenames:
            photo_filenames = [default_filename]
        sweetbook_client.insert_content_page(
            book_uid=book_uid,
            date_str=str(diary.written_at),
            content=diary.content,
            linky_oneline=diary.linky_oneline,
            linky_cheer=diary.linky_cheer,
            photo_filenames=photo_filenames,
        )

    sweetbook_client.finalize_book(book_uid)
    estimate = sweetbook_client.estimate_order(book_uid)

    return {
        "book_uid": book_uid,
        "title": title,
        "page_count": len(diaries),
        "estimate": estimate,
        "used_default_cover": used_default_cover,
    }


def order_healing_book(
    book_uid: str,
    recipient_name: str,
    recipient_phone: str,
    postal_code: str,
    address1: str,
    address2: str = "",
    memo: str = "",
) -> dict:
    result = sweetbook_client.place_order(
        book_uid=book_uid,
        recipient_name=recipient_name,
        recipient_phone=recipient_phone,
        postal_code=postal_code,
        address1=address1,
        address2=address2,
        memo=memo,
    )
    return result


def fetch_order_status(order_uid: str) -> dict:
    return sweetbook_client.get_order_status(order_uid)
