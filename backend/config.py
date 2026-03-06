from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "Scrapling API"
    app_version: str = "1.0.0"
    environment: str = "development"

    host: str = "0.0.0.0"
    port: int = 8000

    cors_origins: str = "*"

    log_level: str = "info"

    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None

    enable_browser_fetchers: bool = True
    max_concurrent_requests: int = 10
    default_timeout: int = 30

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
