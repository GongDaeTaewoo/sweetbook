from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.database import get_db
from services.photobook_service import create_healing_book, order_healing_book, fetch_order_status
from schemas.photobook import PhotobookCreateRequest, OrderRequest
from core.utils import get_user_id

router = APIRouter(prefix="/photobook", tags=["photobook"])


@router.post("/create")
def create_photobook(
    body: PhotobookCreateRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_user_id),
):
    created_book = create_healing_book(
        db=db,
        user_id=user_id,
        start_date=body.start_date,
        end_date=body.end_date,
        limit=body.limit,
    )
    return {"data": created_book}


@router.post("/order")
def order_photobook(
    body: OrderRequest,
    user_id: int = Depends(get_user_id),
):
    placed_order = order_healing_book(
        book_uid=body.book_uid,
        recipient_name=body.recipient_name,
        recipient_phone=body.recipient_phone,
        postal_code=body.postal_code,
        address1=body.address1,
        address2=body.address2,
        memo=body.memo,
    )
    return {"data": placed_order}


@router.get("/order/{order_uid}")
def get_order(
    order_uid: str,
    user_id: int = Depends(get_user_id),
):
    order_status = fetch_order_status(order_uid)
    return {"data": order_status}
