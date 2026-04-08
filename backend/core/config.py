from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    claude_api_key: str
    sweetbook_api_key: str
    sweetbook_base_url: str
    sweetbook_book_spec_uid: str
    sweetbook_content_template_uid: str
    sweetbook_cover_template_uid: str
    sweetbook_env: str = "sandbox"
    mock_mode: bool = False
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 10080
    upload_dir: str = "uploads"

    class Config:
        env_file = ".env"


settings = Settings()
