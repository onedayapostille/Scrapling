from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Dict, Any, List
from enum import Enum


class FetcherType(str, Enum):
    STATIC = "static"
    DYNAMIC = "dynamic"
    STEALTHY = "stealthy"


class ScrapeRequest(BaseModel):
    url: HttpUrl
    fetcher_type: FetcherType = Field(default=FetcherType.STATIC)
    css_selector: Optional[str] = None
    xpath_selector: Optional[str] = None
    headless: bool = True
    timeout: Optional[int] = None
    headers: Optional[Dict[str, str]] = None
    proxy: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "url": "https://example.com",
                "fetcher_type": "static",
                "css_selector": ".content",
                "headless": True,
                "timeout": 30
            }
        }


class ElementData(BaseModel):
    text: Optional[str] = None
    html: Optional[str] = None
    attributes: Optional[Dict[str, Any]] = None


class ScrapeResponse(BaseModel):
    success: bool
    url: str
    fetcher_type: str
    data: Optional[List[ElementData]] = None
    full_html: Optional[str] = None
    error: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
