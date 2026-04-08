from fastapi import Header
from services.auth_service import decode_jwt


def get_user_id(authorization: str = Header()) -> int:
    token = authorization.replace("Bearer ", "")
    return decode_jwt(token)
