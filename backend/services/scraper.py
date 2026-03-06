import sys
import logging
import time
from typing import List, Dict, Any, Optional
from urllib.parse import urljoin

sys.path.insert(0, '/tmp/cc-agent/64405644/project/core')

from scrapling.fetchers import Fetcher, DynamicFetcher, StealthyFetcher
from scrapling.parser import Selector
from models.scraping import (
    FetcherType, ElementData, ExtractedData, MetadataInfo,
    HeadingData, LinkData, ImageData, TableData
)
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
        proxy: Optional[str] = None,
        extract_metadata: bool = True,
        extract_links: bool = True,
        extract_images: bool = True,
        extract_headings: bool = True,
        extract_tables: bool = False
    ) -> tuple[Optional[Selector], Optional[str], Dict[str, Any], int]:
        """
        Fetch page using specified fetcher type
        Returns: (page, error, metadata, response_time_ms)
        """
        start_time = time.time()

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
                metadata["final_url"] = getattr(page, "url", url)

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
                metadata["final_url"] = getattr(page, "url", url)

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
                metadata["final_url"] = getattr(page, "url", url)
            else:
                raise ValueError(f"Unknown fetcher type: {fetcher_type}")

            response_time_ms = int((time.time() - start_time) * 1000)
            return page, None, metadata, response_time_ms

        except Exception as e:
            logger.error(f"Error fetching {url}: {e}", exc_info=True)
            response_time_ms = int((time.time() - start_time) * 1000)
            return None, str(e), metadata, response_time_ms

    @staticmethod
    def extract_elements(
        page: Selector,
        css_selector: Optional[str] = None,
        xpath_selector: Optional[str] = None
    ) -> List[ElementData]:
        """Extract elements based on CSS or XPath selector"""
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

    @staticmethod
    def extract_comprehensive_data(
        page: Selector,
        base_url: str,
        extract_metadata: bool = True,
        extract_links: bool = True,
        extract_images: bool = True,
        extract_headings: bool = True,
        extract_tables: bool = False
    ) -> ExtractedData:
        """
        Extract comprehensive data from page using Scrapling's native methods
        """
        extracted = ExtractedData()

        try:
            if extract_metadata:
                extracted.metadata = ScraperService._extract_metadata(page)

            if extract_headings:
                extracted.headings = ScraperService._extract_headings(page)

            if extract_links:
                extracted.links = ScraperService._extract_links(page, base_url)

            if extract_images:
                extracted.images = ScraperService._extract_images(page, base_url)

            if extract_tables:
                extracted.tables = ScraperService._extract_tables(page)

            text_content = page.text
            extracted.text_content = text_content[:5000] if text_content else None
            extracted.word_count = len(text_content.split()) if text_content else 0

        except Exception as e:
            logger.error(f"Error extracting comprehensive data: {e}", exc_info=True)

        return extracted

    @staticmethod
    def _extract_metadata(page: Selector) -> MetadataInfo:
        """Extract metadata using Scrapling's CSS selector methods"""
        metadata = MetadataInfo()

        try:
            title_elem = page.css_first('title')
            metadata.title = title_elem.text if title_elem else None

            desc_elem = page.css_first('meta[name="description"]')
            metadata.description = desc_elem.attrib.get('content') if desc_elem and hasattr(desc_elem, 'attrib') else None

            keywords_elem = page.css_first('meta[name="keywords"]')
            metadata.keywords = keywords_elem.attrib.get('content') if keywords_elem and hasattr(keywords_elem, 'attrib') else None

            author_elem = page.css_first('meta[name="author"]')
            metadata.author = author_elem.attrib.get('content') if author_elem and hasattr(author_elem, 'attrib') else None

            canonical_elem = page.css_first('link[rel="canonical"]')
            metadata.canonical = canonical_elem.attrib.get('href') if canonical_elem and hasattr(canonical_elem, 'attrib') else None

            robots_elem = page.css_first('meta[name="robots"]')
            metadata.robots = robots_elem.attrib.get('content') if robots_elem and hasattr(robots_elem, 'attrib') else None

            og_title = page.css_first('meta[property="og:title"]')
            metadata.og_title = og_title.attrib.get('content') if og_title and hasattr(og_title, 'attrib') else None

            og_desc = page.css_first('meta[property="og:description"]')
            metadata.og_description = og_desc.attrib.get('content') if og_desc and hasattr(og_desc, 'attrib') else None

            og_image = page.css_first('meta[property="og:image"]')
            metadata.og_image = og_image.attrib.get('content') if og_image and hasattr(og_image, 'attrib') else None

            og_url = page.css_first('meta[property="og:url"]')
            metadata.og_url = og_url.attrib.get('content') if og_url and hasattr(og_url, 'attrib') else None

        except Exception as e:
            logger.error(f"Error extracting metadata: {e}", exc_info=True)

        return metadata

    @staticmethod
    def _extract_headings(page: Selector) -> List[HeadingData]:
        """Extract headings h1-h6 using Scrapling"""
        headings = []

        try:
            for level in range(1, 7):
                elements = page.css(f'h{level}')
                if isinstance(elements, list):
                    for elem in elements:
                        text = elem.text if hasattr(elem, 'text') else str(elem)
                        elem_id = elem.attrib.get('id') if hasattr(elem, 'attrib') else None
                        if text and text.strip():
                            headings.append(HeadingData(
                                level=f"h{level}",
                                text=text.strip(),
                                id=elem_id
                            ))

        except Exception as e:
            logger.error(f"Error extracting headings: {e}", exc_info=True)

        return headings

    @staticmethod
    def _extract_links(page: Selector, base_url: str) -> List[LinkData]:
        """Extract links using Scrapling"""
        links = []

        try:
            link_elements = page.css('a[href]')
            if isinstance(link_elements, list):
                for elem in link_elements[:100]:
                    if hasattr(elem, 'attrib'):
                        href = elem.attrib.get('href', '')
                        if href and not href.startswith(('#', 'javascript:', 'mailto:', 'tel:')):
                            absolute_url = urljoin(base_url, href)
                            text = elem.text if hasattr(elem, 'text') else None
                            links.append(LinkData(
                                href=absolute_url,
                                text=text.strip() if text else None,
                                title=elem.attrib.get('title'),
                                rel=elem.attrib.get('rel')
                            ))

        except Exception as e:
            logger.error(f"Error extracting links: {e}", exc_info=True)

        return links

    @staticmethod
    def _extract_images(page: Selector, base_url: str) -> List[ImageData]:
        """Extract images using Scrapling"""
        images = []

        try:
            img_elements = page.css('img[src]')
            if isinstance(img_elements, list):
                for elem in img_elements[:50]:
                    if hasattr(elem, 'attrib'):
                        src = elem.attrib.get('src', '')
                        if src:
                            absolute_url = urljoin(base_url, src)
                            images.append(ImageData(
                                src=absolute_url,
                                alt=elem.attrib.get('alt'),
                                title=elem.attrib.get('title'),
                                width=elem.attrib.get('width'),
                                height=elem.attrib.get('height')
                            ))

        except Exception as e:
            logger.error(f"Error extracting images: {e}", exc_info=True)

        return images

    @staticmethod
    def _extract_tables(page: Selector) -> List[TableData]:
        """Extract tables using Scrapling"""
        tables = []

        try:
            table_elements = page.css('table')
            if isinstance(table_elements, list):
                for table_elem in table_elements[:10]:
                    table_data = TableData()

                    header_elems = table_elem.css('thead th, thead td')
                    if isinstance(header_elems, list):
                        table_data.headers = [
                            elem.text.strip() if hasattr(elem, 'text') and elem.text else ''
                            for elem in header_elems
                        ]

                    row_elems = table_elem.css('tbody tr, tr')
                    if isinstance(row_elems, list):
                        for row in row_elems:
                            cell_elems = row.css('td, th')
                            if isinstance(cell_elems, list):
                                row_data = [
                                    cell.text.strip() if hasattr(cell, 'text') and cell.text else ''
                                    for cell in cell_elems
                                ]
                                if row_data:
                                    table_data.rows.append(row_data)

                    if table_data.headers or table_data.rows:
                        tables.append(table_data)

        except Exception as e:
            logger.error(f"Error extracting tables: {e}", exc_info=True)

        return tables
