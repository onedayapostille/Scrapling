import logging
from fastapi import APIRouter, HTTPException
from models.scraping import ScrapeRequest, ScrapeResponse, ElementData
from services.scraper import ScraperService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/scrape", response_model=ScrapeResponse)
async def scrape_url(request: ScrapeRequest):
    """
    Main scraping endpoint - fetches URL and extracts comprehensive data
    """
    try:
        logger.info(f"Scraping request for URL: {request.url}")

        page, error, metadata, response_time_ms = await ScraperService.fetch_page(
            url=str(request.url),
            fetcher_type=request.fetcher_type,
            css_selector=request.css_selector,
            xpath_selector=request.xpath_selector,
            headless=request.headless,
            timeout=request.timeout,
            headers=request.headers,
            proxy=request.proxy,
            extract_metadata=request.extract_metadata,
            extract_links=request.extract_links,
            extract_images=request.extract_images,
            extract_headings=request.extract_headings,
            extract_tables=request.extract_tables
        )

        if error or not page:
            return ScrapeResponse(
                success=False,
                url=str(request.url),
                fetcher_type=request.fetcher_type.value,
                error=error or "Failed to fetch page",
                metadata=metadata,
                response_time_ms=response_time_ms
            )

        elements = None
        extracted = None
        full_html = None

        if request.css_selector or request.xpath_selector:
            elements = ScraperService.extract_elements(
                page,
                css_selector=request.css_selector,
                xpath_selector=request.xpath_selector
            )
        else:
            extracted = ScraperService.extract_comprehensive_data(
                page,
                base_url=metadata.get('final_url', str(request.url)),
                extract_metadata=request.extract_metadata,
                extract_links=request.extract_links,
                extract_images=request.extract_images,
                extract_headings=request.extract_headings,
                extract_tables=request.extract_tables
            )

        if not elements and not extracted:
            full_html = str(page)

        return ScrapeResponse(
            success=True,
            url=str(request.url),
            final_url=metadata.get('final_url'),
            fetcher_type=request.fetcher_type.value,
            status_code=metadata.get('status_code'),
            data=elements,
            extracted=extracted,
            full_html=full_html[:10000] if full_html else None,
            metadata=metadata,
            response_time_ms=response_time_ms
        )

    except Exception as e:
        logger.error(f"Error processing scrape request: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract", response_model=ScrapeResponse)
async def extract_data(request: ScrapeRequest):
    """
    Extract endpoint - same as /scrape but forces comprehensive extraction
    """
    request.extract_metadata = True
    request.extract_links = True
    request.extract_images = True
    request.extract_headings = True
    request.extract_tables = True
    request.css_selector = None
    request.xpath_selector = None

    return await scrape_url(request)


@router.get("/test")
async def test_scrape():
    """
    Test endpoint with example site
    """
    try:
        request = ScrapeRequest(
            url="https://quotes.toscrape.com/",
            fetcher_type="static",
            extract_metadata=True,
            extract_headings=True,
            extract_links=True
        )
        return await scrape_url(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
