from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from db.database import engine, Base
from routers import auth, diaries, linky, photobook
from core.config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(title="나의 치유 이야기 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

app.include_router(auth.router, prefix="/api")
app.include_router(diaries.router, prefix="/api")
app.include_router(linky.router, prefix="/api")
app.include_router(photobook.router, prefix="/api")


@app.get("/")
def health_check():
    return {"status": "ok"}
