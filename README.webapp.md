# Scrapling Web Application

A professional web application built on top of the powerful Scrapling library, providing a modern UI for web scraping with advanced data extraction capabilities.

## Architecture Overview

This project maintains the original Scrapling core library while adding a complete web application layer:

```
Project Structure:
├── core/                    # Original Scrapling library (preserved)
│   ├── scrapling/          # Core scraping engine
│   └── tests/              # Original test suite
├── backend/                 # FastAPI REST API (NEW)
│   ├── routers/            # API endpoints
│   ├── services/           # Business logic
│   ├── models/             # Pydantic schemas
│   ├── config.py           # Configuration
│   └── main.py             # FastAPI app
└── frontend/               # React UI (NEW)
    └── src/                # React components
```

## What's Reused vs What's New

### Reused from Original Scrapling Core

All core scraping functionality is **100% preserved and reused**:

- **Fetchers** (`core/scrapling/fetchers/`)
  - `Fetcher` - Fast HTTP requests with TLS fingerprinting
  - `DynamicFetcher` - Full browser automation (Playwright)
  - `StealthyFetcher` - Anti-bot bypass capabilities

- **Parser** (`core/scrapling/parser.py`)
  - CSS selector support via `page.css()`
  - XPath selector support via `page.xpath()`
  - Element navigation and traversal
  - Adaptive element relocation

- **Core Utilities** (`core/scrapling/core/`)
  - Storage system for adaptive parsing
  - Translation between CSS and XPath
  - Custom types and handlers

### New Application Layer

**Backend API (FastAPI)**:
- `backend/main.py` - FastAPI application with CORS, error handling, lifespan events
- `backend/routers/scraping.py` - Scraping endpoints (`/scrape`, `/extract`)
- `backend/routers/health.py` - Health check endpoints
- `backend/services/scraper.py` - Service layer wrapping Scrapling core
- `backend/models/scraping.py` - Pydantic request/response models
- `backend/config.py` - Environment-based configuration

**Frontend UI (React + Vite)**:
- Professional dashboard with modern design
- Multi-tab results view (Overview, Metadata, Headings, Links, Images, Tables, Text, HTML, JSON)
- Real-time scraping progress
- History tracking in localStorage
- Export to JSON/CSV
- Responsive mobile-friendly design

## Features

### Scraping Capabilities

All features from the original Scrapling library are available:

1. **Multiple Fetcher Modes**:
   - **Static (Fast)**: Lightweight HTTP requests for simple pages
   - **Dynamic**: Full browser automation for JavaScript-heavy sites
   - **Stealthy**: Anti-bot bypass for protected sites

2. **Comprehensive Data Extraction**:
   - Page metadata (title, description, keywords, OG tags, canonical)
   - Headings (h1-h6) with hierarchy
   - Links with text and attributes
   - Images with alt text and dimensions
   - Tables with headers and rows
   - Full text content with word count
   - Raw HTML when needed

3. **Advanced Selection**:
   - CSS selectors
   - XPath expressions
   - Custom element filtering

### Web Application Features

New functionality added by the web layer:

1. **Modern Dashboard UI**:
   - Clean, professional interface
   - Real-time feedback
   - Loading states and error handling
   - Empty state management

2. **Results Visualization**:
   - **Overview**: Key metrics and statistics
   - **Metadata**: All page metadata in structured format
   - **Headings**: Hierarchical heading structure
   - **Links**: Clickable links with context
   - **Images**: Grid view with preview
   - **Tables**: Formatted table data
   - **Text**: Extracted text content
   - **HTML**: Raw HTML output
   - **JSON**: Complete JSON response

3. **Export Options**:
   - Export to JSON (full response)
   - Export to CSV (links, images)
   - Download with timestamp

4. **History Tracking**:
   - Recent 10 scrapes saved locally
   - Quick reload from history
   - Success/failure indicators

## API Endpoints

### Health Checks

```http
GET /health
Response: { "status": "healthy", "version": "1.0.0", ... }

GET /health/ready
Response: { "ready": true, "checks": { ... }, ... }
```

### Scraping

```http
POST /api/v1/scrape
Content-Type: application/json

{
  "url": "https://example.com",
  "fetcher_type": "static",          // static | dynamic | stealthy
  "css_selector": ".content",         // Optional
  "xpath_selector": "//div[@id]",    // Optional
  "headless": true,                   // For browser modes
  "extract_metadata": true,
  "extract_links": true,
  "extract_images": true,
  "extract_headings": true,
  "extract_tables": false
}
```

Response:
```json
{
  "success": true,
  "url": "https://example.com",
  "final_url": "https://example.com/",
  "fetcher_type": "static",
  "status_code": 200,
  "response_time_ms": 542,
  "extracted": {
    "metadata": {
      "title": "Example Domain",
      "description": "...",
      ...
    },
    "headings": [
      { "level": "h1", "text": "Example Domain", "id": null }
    ],
    "links": [
      { "href": "https://...", "text": "More information..." }
    ],
    "images": [
      { "src": "https://...", "alt": "..." }
    ],
    "text_content": "Example Domain...",
    "word_count": 123
  }
}
```

```http
POST /api/v1/extract
```
Same as `/scrape` but forces all extraction options to true.

```http
GET /api/v1/test
```
Test endpoint that scrapes quotes.toscrape.com.

## Running the Application

### Prerequisites

- Python 3.10+
- Node.js 20+
- pip and npm

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Optional: Install browser dependencies for dynamic/stealthy fetchers
# This downloads Chromium and system dependencies
python -c "from scrapling.cli import install; install(['--force'], standalone_mode=False)"

# Configure environment
cp .env.example .env
# Edit .env - set ENABLE_BROWSER_FETCHERS=true if browsers installed

# Run backend
python main.py
# Backend available at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env - set VITE_API_URL if backend not on localhost:8000

# Run development server
npm run dev
# Frontend available at http://localhost:3000
```

### Docker Deployment

**Lightweight (Static fetcher only)**:
```bash
cp .env.example .env
docker-compose up -d
```

**Full (With browsers)**:
```bash
cp .env.example .env
# Edit .env: ENABLE_BROWSER_FETCHERS=true
docker-compose -f docker-compose.browsers.yml up -d
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Example Usage

### Via Web UI

1. Open http://localhost:3000
2. Enter URL (e.g., https://quotes.toscrape.com)
3. Select fetcher mode (Static recommended for most sites)
4. Choose extraction options (metadata, links, images, etc.)
5. Click "Analyze"
6. View results in tabbed interface
7. Export as JSON or CSV

### Via API (curl)

```bash
# Simple scrape
curl -X POST http://localhost:8000/api/v1/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://quotes.toscrape.com",
    "fetcher_type": "static"
  }'

# With CSS selector
curl -X POST http://localhost:8000/api/v1/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://quotes.toscrape.com",
    "fetcher_type": "static",
    "css_selector": ".quote .text"
  }'

# Full extraction
curl -X POST http://localhost:8000/api/v1/extract \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "fetcher_type": "static"
  }'
```

### Via Python (Using Core Library Directly)

The core library can still be used independently:

```python
# Add core to path
import sys
sys.path.insert(0, '/path/to/project/core')

from scrapling.fetchers import Fetcher, StealthyFetcher
from scrapling.parser import Selector

# HTTP request
page = Fetcher.get('https://quotes.toscrape.com/')
quotes = page.css('.quote .text::text').getall()

# With browser
page = StealthyFetcher.fetch('https://example.com', headless=True)
title = page.css_first('title').text
```

## Configuration

### Backend Configuration (`.env`)

```bash
# Application
APP_NAME="Scrapling API"
ENVIRONMENT=development          # development | production
HOST=0.0.0.0
PORT=8000

# CORS
CORS_ORIGINS=*                  # Comma-separated origins in production

# Logging
LOG_LEVEL=info                  # debug | info | warning | error

# Supabase (Optional)
SUPABASE_URL=
SUPABASE_KEY=

# Scraping
ENABLE_BROWSER_FETCHERS=true    # Enable dynamic/stealthy modes
MAX_CONCURRENT_REQUESTS=10
DEFAULT_TIMEOUT=30
```

### Frontend Configuration (`.env`)

```bash
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=Scrapling Web Interface
```

## Code Organization

### Backend Service Layer

The `ScraperService` class wraps Scrapling core functionality:

**services/scraper.py**:
```python
class ScraperService:
    @staticmethod
    async def fetch_page(...) -> tuple:
        """
        Wraps Fetcher/DynamicFetcher/StealthyFetcher
        Returns: (page, error, metadata, response_time_ms)
        """
        # Uses Scrapling core: Fetcher.get(), DynamicFetcher.fetch(), etc.

    @staticmethod
    def extract_elements(...) -> List[ElementData]:
        """
        Uses Scrapling's page.css() and page.xpath()
        """

    @staticmethod
    def extract_comprehensive_data(...) -> ExtractedData:
        """
        Extracts all data types using Scrapling's selector methods
        """
        # Uses: page.css_first(), page.css(), page.text, etc.
```

All extraction methods use Scrapling's native selectors:
- `page.css()` for CSS selection
- `page.css_first()` for single elements
- `page.xpath()` for XPath queries
- `page.text` for text extraction
- `element.attrib` for attributes

### API Models

Pydantic models provide validation and serialization:

**models/scraping.py**:
- `FetcherType` - Enum for fetcher modes
- `ScrapeRequest` - Request validation
- `ScrapeResponse` - Structured response
- `ExtractedData` - Comprehensive extraction result
- `MetadataInfo`, `HeadingData`, `LinkData`, `ImageData`, `TableData` - Type-safe data models

## What Was NOT Changed

The following remain completely unchanged from the original Scrapling:

1. **Core Library** (`core/scrapling/`)
   - All parsing logic
   - All fetching logic
   - All selector methods
   - All utility functions
   - Spider framework
   - Storage system
   - CLI tools

2. **Test Suite** (`core/tests/`)
   - All existing tests
   - Test infrastructure
   - Test data

3. **Documentation** (`docs/`)
   - All original documentation
   - API references
   - Tutorials

The web application is a **pure addition** - a UI and API layer built on top of the existing, battle-tested core.

## Extending the Application

### Adding New Extraction Features

To add new extraction capabilities:

1. Add method to `ScraperService`:
```python
@staticmethod
def _extract_custom(page: Selector) -> List[CustomData]:
    # Use Scrapling's selector methods
    elements = page.css('.custom')
    return [CustomData(...) for elem in elements]
```

2. Add to `extract_comprehensive_data()`:
```python
if extract_custom:
    extracted.custom = ScraperService._extract_custom(page)
```

3. Add Pydantic model to `models/scraping.py`:
```python
class CustomData(BaseModel):
    field: str
```

4. Add to `ExtractedData` model:
```python
class ExtractedData(BaseModel):
    custom: List[CustomData] = []
```

5. Add UI tab in `App.jsx` to display the data

### Adding New Endpoints

1. Create router in `backend/routers/`:
```python
from fastapi import APIRouter

router = APIRouter()

@router.post("/custom")
async def custom_endpoint():
    # Use ScraperService methods
    pass
```

2. Register in `main.py`:
```python
from routers import custom
app.include_router(custom.router, prefix="/api/v1", tags=["Custom"])
```

## Troubleshooting

### Backend Issues

**Import errors from core**:
```python
# Ensure core path is in sys.path
import sys
sys.path.insert(0, '/path/to/project/core')
```

**Browser fetchers not working**:
- Ensure browsers installed: `scrapling install` or via Python
- Set `ENABLE_BROWSER_FETCHERS=true` in `.env`
- Check `docker-compose.browsers.yml` if using Docker

**CORS errors**:
- Set `CORS_ORIGINS` in backend `.env`
- Ensure frontend `VITE_API_URL` matches backend URL

### Frontend Issues

**API connection fails**:
- Check `VITE_API_URL` in `.env`
- Ensure backend is running
- Check browser console for CORS errors

**Build errors**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Performance Considerations

1. **Static fetcher** is fastest (~100-500ms)
2. **Dynamic fetcher** adds browser overhead (~2-5s)
3. **Stealthy fetcher** adds fingerprint spoofing (~3-8s)

Tips:
- Use static fetcher for most sites
- Only use browser modes when necessary
- Set appropriate timeouts
- Consider caching for frequently accessed pages

## Security

- Never expose API without authentication in production
- Use environment variables for all secrets
- Restrict CORS origins in production
- Implement rate limiting for public APIs
- Validate all user input (handled by Pydantic)
- Be cautious with dynamic content execution

## License

Follows the original Scrapling license (BSD-3-Clause).

## Credits

- **Core Library**: [Scrapling](https://github.com/D4Vinci/Scrapling) by Karim Shoair
- **Web Application Layer**: Built as a deployment-friendly wrapper preserving all core functionality

---

This web application demonstrates how to build a production-ready UI on top of Scrapling without modifying the core library, maintaining full compatibility with the original project while adding modern web application capabilities.
