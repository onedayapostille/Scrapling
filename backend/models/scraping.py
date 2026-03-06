from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Dict, Any, List
from enum import Enum
from datetime import datetime


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
    extract_metadata: bool = True
    extract_links: bool = True
    extract_images: bool = True
    extract_headings: bool = True
    extract_tables: bool = False

    class Config:
        json_schema_extra = {
            "example": {
                "url": "https://example.com",
                "fetcher_type": "static",
                "css_selector": ".content",
                "headless": True,
                "timeout": 30,
                "extract_metadata": True,
                "extract_links": True,
                "extract_images": True
            }
        }


class ElementData(BaseModel):
    text: Optional[str] = None
    html: Optional[str] = None
    attributes: Optional[Dict[str, Any]] = None


class HeadingData(BaseModel):
    level: str
    text: str
    id: Optional[str] = None


class LinkData(BaseModel):
    href: str
    text: Optional[str] = None
    title: Optional[str] = None
    rel: Optional[str] = None


class ImageData(BaseModel):
    src: str
    alt: Optional[str] = None
    title: Optional[str] = None
    width: Optional[str] = None
    height: Optional[str] = None


class TableData(BaseModel):
    headers: List[str] = []
    rows: List[List[str]] = []


class MetadataInfo(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    keywords: Optional[str] = None
    author: Optional[str] = None
    canonical: Optional[str] = None
    robots: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    og_url: Optional[str] = None


class ExtractedData(BaseModel):
    metadata: Optional[MetadataInfo] = None
    headings: List[HeadingData] = []
    links: List[LinkData] = []
    images: List[ImageData] = []
    tables: List[TableData] = []
    text_content: Optional[str] = None
    word_count: int = 0


class ScrapeResponse(BaseModel):
    success: bool
    url: str
    final_url: Optional[str] = None
    fetcher_type: str
    status_code: Optional[int] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    data: Optional[List[ElementData]] = None
    extracted: Optional[ExtractedData] = None
    full_html: Optional[str] = None

    error: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    response_time_ms: Optional[int] = None
