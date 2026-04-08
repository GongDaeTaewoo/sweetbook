from datetime import date
from pydantic import BaseModel
from typing import Optional


class PhotobookCreateRequest(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    limit: Optional[int] = None


class EstimateInfo(BaseModel):
    paidCreditAmount: int
    totalAmount: int
    shippingFee: int


class PhotobookCreateResponse(BaseModel):
    book_uid: str
    title: str
    page_count: int
    estimate: EstimateInfo


class OrderRequest(BaseModel):
    book_uid: str
    recipient_name: str
    recipient_phone: str
    postal_code: str
    address1: str
    address2: Optional[str] = ""
    memo: Optional[str] = ""


class OrderResponse(BaseModel):
    order_uid: str
    order_status: str
    paid_amount: int
    message: str
