import logging
from fastapi import APIRouter, HTTPException
from models.scraping import ScrapeRequest, ScrapeResponse, ElementData
from services.scraper import ScraperService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/scrape", response_model=ScrapeResponse)
async def scrape_url(request: ScrapeRequest):
    try:
        logger.info(f"Scraping request for URL: {request.url}")

        page, error, metadata = await ScraperService.fetch_page(
            url=str(request.url),
            fetcher_type=request.fetcher_type,
            css_selector=request.css_selector,
            xpath_selector=request.xpath_selector,
            headless=request.headless,
            timeout=request.timeout,
            headers=request.headers,
            proxy=request.proxy
        )

        if error or not page:
            return ScrapeResponse(
                success=False,
                url=str(request.url),
                fetcher_type=request.fetcher_type.value,
                error=error or "Failed to fetch page",
                metadata=metadata
            )

        elements = None
        if request.css_selector or request.xpath_selector:
            elements = ScraperService.extract_elements(
                page,
                css_selector=request.css_selector,
                xpath_selector=request.xpath_selector
            )

        return ScrapeResponse(
            success=True,
            url=str(request.url),
            fetcher_type=request.fetcher_type.value,
            data=elements,
            full_html=str(page) if not elements else None,
            metadata=metadata
        )

    except Exception as e:
        logger.error(f"Error processing scrape request: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/test")
async def test_scrape():
    try:
        request = ScrapeRequest(
            url="https://quotes.toscrape.com/",
            fetcher_type="static",
            css_selector=".quote .text"
        )
        return await scrape_url(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
