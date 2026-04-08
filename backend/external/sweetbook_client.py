import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "sweet"))
from bookprintapi import Client, ApiError

from fastapi import HTTPException
from core.config import settings


def _get_client() -> Client:
    return Client(api_key=settings.sweetbook_api_key, environment=settings.sweetbook_env)


def _api_error_to_http(e: ApiError, detail: str) -> HTTPException:
    status = 402 if e.status_code == 402 else 502
    full_detail = f"{detail} | {e.status_code} {e.message} {e.details}"
    return HTTPException(status_code=status, detail=full_detail)


def create_book(title: str) -> str:
    try:
        result = _get_client().books.create(
            book_spec_uid=settings.sweetbook_book_spec_uid,
            title=title,
            creation_type="TEST",
        )
        return result["data"]["bookUid"]
    except ApiError as e:
        raise _api_error_to_http(e, "책 생성 오류")


def upload_photos(book_uid: str, local_paths: list[str]) -> dict[str, str]:
    client = _get_client()
    mapping: dict[str, str] = {}
    for path in local_paths:
        try:
            result = client.photos.upload(book_uid, path)
            data = result["data"]
            if "photos" in data:
                server_filename = data["photos"][0]["fileName"]
            else:
                server_filename = data["fileName"]
            mapping[path] = server_filename
        except ApiError as e:
            raise _api_error_to_http(e, "사진 업로드 오류")
    return mapping


def create_cover(book_uid: str, cover_title: str, front_photo_filename: str, date_range: str) -> None:
    try:
        _get_client().covers.create(
            book_uid,
            template_uid=settings.sweetbook_cover_template_uid,
            parameters={"title": cover_title, "coverPhoto": front_photo_filename, "dateRange": date_range},
        )
    except ApiError as e:
        raise _api_error_to_http(e, "표지 생성 오류")


def insert_content_page(
    book_uid: str,
    date_str: str,
    content: str,
    linky_oneline: str,
    linky_cheer: str,
    photo_filenames: list[str],
) -> None:
    parts = [content]
    if linky_oneline:
        parts.append(f"\n\n💚 {linky_oneline}")
    if linky_cheer:
        parts.append(f"\n{linky_cheer}")

    month, day = date_str.split("-")[1], date_str.split("-")[2]
    parameters: dict = {
        "monthNum": month,
        "dayNum": day,
        "diaryText": "".join(parts),
    }
    if photo_filenames:
        parameters["photo"] = photo_filenames[0]

    try:
        _get_client().contents.insert(
            book_uid,
            template_uid=settings.sweetbook_content_template_uid,
            parameters=parameters,
            break_before="page",
        )
    except ApiError as e:
        raise _api_error_to_http(e, "내지 구성 오류")


def finalize_book(book_uid: str) -> None:
    try:
        _get_client().books.finalize(book_uid)
    except ApiError as e:
        raise _api_error_to_http(e, "책 확정 오류")


def estimate_order(book_uid: str) -> dict:
    try:
        result = _get_client().orders.estimate([{"bookUid": book_uid, "quantity": 1}])
        data = result["data"]
        return {
            "paidCreditAmount": data["paidCreditAmount"],
            "totalAmount": data["totalAmount"],
            "shippingFee": data["shippingFee"],
        }
    except ApiError as e:
        raise _api_error_to_http(e, "견적 조회 오류")


def place_order(
    book_uid: str,
    recipient_name: str,
    recipient_phone: str,
    postal_code: str,
    address1: str,
    address2: str = "",
    memo: str = "",
) -> dict:
    shipping: dict = {
        "recipientName": recipient_name,
        "recipientPhone": recipient_phone,
        "postalCode": postal_code,
        "address1": address1,
    }
    if address2:
        shipping["address2"] = address2
    if memo:
        shipping["memo"] = memo

    try:
        result = _get_client().orders.create(
            items=[{"bookUid": book_uid, "quantity": 1}],
            shipping=shipping,
        )
        data = result["data"]
        return {
            "order_uid": data["orderUid"],
            "order_status": data["orderStatus"],
            "paid_amount": data.get("paidCreditAmount", 0),
        }
    except ApiError as e:
        raise _api_error_to_http(e, "주문 처리 오류")


def get_order_status(order_uid: str) -> dict:
    try:
        result = _get_client().orders.get(order_uid)
        return result["data"]
    except ApiError as e:
        raise _api_error_to_http(e, "주문 조회 오류")
