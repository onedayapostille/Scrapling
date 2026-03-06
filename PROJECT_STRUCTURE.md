# Project Structure Documentation

This document explains the organization and purpose of each component in the deployment-ready Scrapling project.

## Overview

```
scrapling/
├── core/                           # Original Scrapling library (reusable)
├── backend/                        # FastAPI REST API server
├── frontend/                       # React web interface
├── docs/                          # Original documentation
├── images/                        # Assets and images
├── docker-compose.yml             # Docker setup (lightweight)
├── docker-compose.browsers.yml    # Docker setup (with browsers)
├── .env.example                   # Root environment configuration
├── README.deployment.md           # Main README for deployment
├── DEPLOYMENT.md                  # Comprehensive deployment guide
├── QUICKSTART.md                  # Quick start guide
└── PROJECT_STRUCTURE.md          # This file
```

## Core Directory (`core/`)

Contains the original Scrapling library, preserved and reusable.

```
core/
├── scrapling/                     # Main library package
│   ├── __init__.py               # Package initialization
│   ├── cli.py                    # Command-line interface
│   ├── parser.py                 # HTML/XML parsing
│   ├── core/                     # Core functionality
│   │   ├── storage.py           # Storage system
│   │   ├── translator.py        # XPath/CSS translation
│   │   ├── custom_types.py      # Type definitions
│   │   └── utils/               # Utility functions
│   ├── engines/                  # Browser engines
│   │   ├── static.py            # Static HTTP engine
│   │   ├── _browsers/           # Browser automation
│   │   └── toolbelt/            # Supporting tools
│   ├── fetchers/                 # Fetching implementations
│   │   ├── requests.py          # HTTP fetcher
│   │   ├── chrome.py            # Chrome automation
│   │   └── stealth_chrome.py    # Stealth mode
│   └── spiders/                  # Spider framework
│       ├── spider.py            # Base spider class
│       ├── engine.py            # Spider engine
│       └── session.py           # Session management
└── tests/                        # Test suite
    ├── fetchers/                # Fetcher tests
    ├── parser/                  # Parser tests
    └── spiders/                 # Spider tests
```

**Key Files:**
- `scrapling/__init__.py` - Main exports and version
- `scrapling/fetchers/` - All fetching capabilities (Static, Dynamic, Stealthy)
- `scrapling/parser.py` - HTML parsing and selection
- `scrapling/spiders/` - Complete spider framework

## Backend Directory (`backend/`)

FastAPI REST API that exposes Scrapling functionality via HTTP endpoints.

```
backend/
├── main.py                        # FastAPI application entry point
├── config.py                      # Configuration management
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment configuration template
├── Dockerfile                     # Lightweight Docker image
├── Dockerfile.browsers            # Full Docker image with browsers
├── routers/                       # API route handlers
│   ├── __init__.py
│   ├── health.py                 # Health check endpoints
│   └── scraping.py               # Scraping endpoints
├── services/                      # Business logic layer
│   ├── __init__.py
│   └── scraper.py                # Scraping service implementation
└── models/                        # Request/response models
    ├── __init__.py
    └── scraping.py               # Pydantic models
```

**Key Files:**
- `main.py` - Application setup, CORS, error handling, routing
- `config.py` - Environment-based configuration using Pydantic
- `routers/health.py` - `/health` and `/health/ready` endpoints
- `routers/scraping.py` - `/api/v1/scrape` and `/api/v1/test` endpoints
- `services/scraper.py` - Core scraping logic using Scrapling library
- `models/scraping.py` - Request/response data models

**Environment Variables** (`.env`):
- `APP_NAME` - Application name
- `ENVIRONMENT` - development/production
- `HOST`, `PORT` - Server binding
- `CORS_ORIGINS` - Allowed CORS origins
- `LOG_LEVEL` - Logging verbosity
- `SUPABASE_URL`, `SUPABASE_KEY` - Optional database
- `ENABLE_BROWSER_FETCHERS` - Enable/disable browser automation
- `MAX_CONCURRENT_REQUESTS` - Concurrency limit
- `DEFAULT_TIMEOUT` - Request timeout

## Frontend Directory (`frontend/`)

React-based web interface for interacting with the scraping API.

```
frontend/
├── package.json                   # Node.js dependencies
├── vite.config.js                # Vite configuration
├── index.html                    # HTML entry point
├── .env.example                  # Environment configuration template
├── Dockerfile                    # Production Docker image
├── nginx.conf                    # Nginx configuration for production
├── src/                          # React source code
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # Application styles
│   └── index.css                # Global styles
└── public/                       # Static assets
```

**Key Files:**
- `src/App.jsx` - Main UI component with scraping form
- `src/main.jsx` - React initialization
- `vite.config.js` - Development server configuration
- `nginx.conf` - Production server configuration with API proxy
- `Dockerfile` - Multi-stage build for production deployment

**Environment Variables** (`.env`):
- `VITE_API_URL` - Backend API URL
- `VITE_APP_TITLE` - Application title

## Docker Configuration

### docker-compose.yml (Lightweight)

Production-ready setup for HTTP scraping only.

**Features:**
- Static fetcher only (no browser automation)
- Smaller image size (~500MB)
- Lower resource requirements
- Faster startup time

**Services:**
- `backend` - FastAPI server (port 8000)
- `frontend` - Nginx + React (port 3000)

### docker-compose.browsers.yml (Full)

Complete setup with browser automation capabilities.

**Features:**
- All fetcher types (Static, Dynamic, Stealthy)
- Playwright/Chromium included
- Larger image size (~2GB)
- Higher resource requirements
- Shared memory for browser processes

**Services:**
- `backend` - FastAPI with browser support
- `frontend` - Nginx + React (port 3000)

**Additional:**
- `browser-cache` volume for browser data persistence
- `shm_size: '2gb'` for stable browser operation

## Dockerfiles

### backend/Dockerfile

Lightweight Python 3.11 image with:
- Basic system dependencies
- Python packages from requirements.txt
- Core Scrapling library
- Static fetcher only

**Size:** ~500MB
**Use case:** HTTP scraping, API serving, low resource environments

### backend/Dockerfile.browsers

Full-featured Python 3.11 image with:
- All system dependencies for browser automation
- Complete browser stack (Chromium, Playwright)
- All Scrapling features
- Browser fingerprint libraries

**Size:** ~2GB
**Use case:** Full scraping capabilities, anti-bot bypass, dynamic content

### frontend/Dockerfile

Multi-stage Node.js build:
1. **Builder stage:** Compiles React app with Vite
2. **Production stage:** Nginx serving static files

**Size:** ~50MB
**Features:**
- Optimized static asset serving
- API proxying to backend
- Gzip compression
- Production-ready caching

## Configuration Files

### Root `.env.example`

Docker Compose environment variables:
- Service ports (backend, frontend)
- Environment mode
- Global settings

### Backend `.env.example`

Backend-specific configuration:
- Server settings
- CORS configuration
- Logging
- Database connection
- Scraping parameters

### Frontend `.env.example`

Frontend-specific configuration:
- API endpoint URL
- Application metadata

## Documentation Files

### README.deployment.md

Main project README covering:
- Project overview
- Quick start instructions
- Architecture explanation
- Feature list
- Links to detailed guides

### DEPLOYMENT.md

Comprehensive deployment guide:
- Local development setup
- Docker deployment (both modes)
- VPS deployment (Ubuntu/Debian)
- Cloud platform deployment
- Kubernetes deployment
- Monitoring and maintenance
- Troubleshooting
- Security best practices
- Performance optimization

### QUICKSTART.md

5-minute getting started guide:
- Fastest path to running application
- Common commands
- Quick troubleshooting
- Next steps

### PROJECT_STRUCTURE.md

This file - detailed project organization documentation.

## Scripts

### start-local.sh

Automated local development setup:
- Checks prerequisites
- Creates virtual environment
- Installs dependencies
- Starts backend and frontend

**Usage:** `./start-local.sh`

### verify-setup.sh

Project verification script:
- Checks all required files exist
- Verifies directory structure
- Tests for prerequisites
- Provides status report

**Usage:** `./verify-setup.sh`

## API Endpoints

### Health Endpoints

- `GET /health` - Basic health check
  ```json
  {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00",
    "version": "1.0.0",
    "environment": "production"
  }
  ```

- `GET /health/ready` - Readiness check with details
  ```json
  {
    "ready": true,
    "checks": {
      "api": "ok",
      "python_version": "3.11.0",
      "browser_fetchers": "enabled"
    },
    "timestamp": "2024-01-01T00:00:00"
  }
  ```

### Scraping Endpoints

- `POST /api/v1/scrape` - Main scraping endpoint

  **Request:**
  ```json
  {
    "url": "https://example.com",
    "fetcher_type": "static",
    "css_selector": ".content",
    "xpath_selector": null,
    "headless": true,
    "timeout": 30,
    "headers": {},
    "proxy": null
  }
  ```

  **Response:**
  ```json
  {
    "success": true,
    "url": "https://example.com",
    "fetcher_type": "static",
    "data": [
      {
        "text": "Content text",
        "html": "<div>...</div>",
        "attributes": {"class": "content"}
      }
    ],
    "metadata": {
      "fetcher_type": "static",
      "status_code": 200
    }
  }
  ```

- `GET /api/v1/test` - Test endpoint with example scrape

### Documentation Endpoints

- `GET /docs` - Swagger UI (interactive API docs)
- `GET /redoc` - ReDoc (alternative API docs)
- `GET /openapi.json` - OpenAPI specification

## Development Workflow

### Backend Development

1. Navigate to backend: `cd backend`
2. Activate virtual environment: `source venv/bin/activate`
3. Run with auto-reload: `uvicorn main:app --reload`
4. Test changes: `curl http://localhost:8000/health`

### Frontend Development

1. Navigate to frontend: `cd frontend`
2. Run dev server: `npm run dev`
3. Hot-reload enabled automatically
4. Access at: `http://localhost:3000`

### Docker Development

1. Make code changes
2. Rebuild: `docker-compose up -d --build`
3. View logs: `docker-compose logs -f`
4. Test: `curl http://localhost:8000/health`

## Deployment Targets

### Supported Platforms

1. **VPS/Dedicated Servers**
   - Ubuntu 20.04+
   - Debian 10+
   - CentOS 8+
   - Any Linux with Docker

2. **Cloud Platforms**
   - AWS (EC2, ECS, Fargate)
   - Google Cloud (Compute Engine, Cloud Run)
   - Azure (VMs, Container Instances)
   - DigitalOcean (Droplets, App Platform)
   - Linode
   - Vultr

3. **Container Platforms**
   - Railway
   - Render
   - Fly.io
   - Heroku (with Docker)

4. **Kubernetes**
   - Self-hosted
   - GKE (Google Kubernetes Engine)
   - EKS (Amazon Elastic Kubernetes)
   - AKS (Azure Kubernetes Service)
   - DigitalOcean Kubernetes

## Resource Requirements

### Development
- 2 CPU cores
- 2GB RAM
- 5GB storage

### Production (Static only)
- 1-2 CPU cores
- 512MB-1GB RAM
- 5GB storage

### Production (With browsers)
- 2-4 CPU cores
- 2-4GB RAM
- 10GB storage

### High Traffic
- 4+ CPU cores
- 4GB+ RAM
- 20GB+ storage
- Load balancer
- Multiple replicas

## Security Considerations

### Environment Variables
- Never commit `.env` files
- Use secrets management in production
- Rotate credentials regularly

### CORS Configuration
- Restrict origins in production
- Don't use wildcard (`*`) in production
- Set specific domains

### API Security
- Implement rate limiting
- Add authentication for sensitive endpoints
- Use HTTPS in production
- Keep dependencies updated

### Docker Security
- Use non-root users in containers
- Scan images for vulnerabilities
- Keep base images updated
- Use specific image tags

## Maintenance

### Updates
```bash
# Pull latest code
git pull

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d

# Verify
docker-compose logs -f
curl http://localhost:8000/health
```

### Backups
- Database: Use Supabase built-in backups
- Configuration: Keep `.env` files in secure storage
- Code: Regular git commits

### Monitoring
- Health endpoints for uptime monitoring
- Log aggregation (CloudWatch, Datadog, etc.)
- Resource monitoring (CPU, memory, disk)
- Error tracking (Sentry, Rollbar, etc.)

## Support and Resources

- **Scrapling Docs:** https://scrapling.readthedocs.io
- **FastAPI Docs:** https://fastapi.tiangolo.com
- **React Docs:** https://react.dev
- **Docker Docs:** https://docs.docker.com
- **Vite Docs:** https://vitejs.dev

## License

BSD-3-Clause License - See LICENSE file

---

**Project Status:** Production Ready

This structure provides a complete, deployment-ready web scraping platform that can be run locally, containerized, or deployed to any cloud platform without major modifications.
