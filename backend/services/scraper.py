import sys
import logging
from typing import List, Dict, Any, Optional

sys.path.insert(0, '/tmp/cc-agent/64405644/project/core')

from scrapling.fetchers import Fetcher, DynamicFetcher, StealthyFetcher
from scrapling.parser import Selector
from models.scraping import FetcherType, ElementData
from config import settings

logger = logging.getLogger(__name__)


class ScraperService:
    @staticmethod
    async def fetch_page(
        url: str,
        fetcher_type: FetcherType,
        css_selector: Optional[str] = None,
        xpath_selector: Optional[str] = None,
        headless: bool = True,
        timeout: Optional[int] = None,
        headers: Optional[Dict[str, str]] = None,
        proxy: Optional[str] = None
    ) -> tuple[Optional[Selector], Optional[str], Dict[str, Any]]:
        try:
            timeout = timeout or settings.default_timeout
            metadata = {
                "fetcher_type": fetcher_type.value,
                "headless": headless
            }

            if fetcher_type == FetcherType.STATIC:
                logger.info(f"Fetching {url} with static fetcher")
                page = Fetcher.get(
                    url,
                    timeout=timeout,
                    headers=headers,
                    proxies={"http": proxy, "https": proxy} if proxy else None
                )
                metadata["status_code"] = getattr(page, "status", None)

            elif fetcher_type == FetcherType.DYNAMIC:
                if not settings.enable_browser_fetchers:
                    raise ValueError("Browser fetchers are disabled in configuration")

                logger.info(f"Fetching {url} with dynamic fetcher")
                page = DynamicFetcher.fetch(
                    url,
                    headless=headless,
                    timeout=timeout * 1000,
                    proxy=proxy
                )

            elif fetcher_type == FetcherType.STEALTHY:
                if not settings.enable_browser_fetchers:
                    raise ValueError("Browser fetchers are disabled in configuration")

                logger.info(f"Fetching {url} with stealthy fetcher")
                page = StealthyFetcher.fetch(
                    url,
                    headless=headless,
                    timeout=timeout * 1000,
                    proxy=proxy
                )
            else:
                raise ValueError(f"Unknown fetcher type: {fetcher_type}")

            return page, None, metadata

        except Exception as e:
            logger.error(f"Error fetching {url}: {e}", exc_info=True)
            return None, str(e), metadata

    @staticmethod
    def extract_elements(
        page: Selector,
        css_selector: Optional[str] = None,
        xpath_selector: Optional[str] = None
    ) -> List[ElementData]:
        try:
            elements = []

            if css_selector:
                selected = page.css(css_selector)
            elif xpath_selector:
                selected = page.xpath(xpath_selector)
            else:
                return [ElementData(
                    text=page.text,
                    html=str(page),
                    attributes={}
                )]

            if not isinstance(selected, list):
                selected = [selected]

            for element in selected:
                elements.append(ElementData(
                    text=element.text if hasattr(element, 'text') else str(element),
                    html=str(element),
                    attributes=element.attrib if hasattr(element, 'attrib') else {}
                ))

            return elements

        except Exception as e:
            logger.error(f"Error extracting elements: {e}", exc_info=True)
            raise
