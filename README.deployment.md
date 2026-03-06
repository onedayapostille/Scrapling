# Scrapling - Deployment-Ready Edition

> A production-ready web scraping platform with FastAPI backend, React frontend, and Docker support.

This is a restructured version of [Scrapling](https://github.com/D4Vinci/Scrapling) designed for easy deployment on VPS, cloud platforms, and container orchestration systems.

## Quick Start

### With Docker (Recommended)

```bash
# Clone repository
git clone <your-repo>
cd scrapling

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run (Static fetcher only - lightweight)
docker-compose up -d

# Or run with full browser support
docker-compose -f docker-compose.browsers.yml up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Local Development

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python main.py
```

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Project Structure

```
.
├── core/                    # Original Scrapling library
│   ├── scrapling/          # Core scraping functionality
│   └── tests/              # Test suite
├── backend/                 # FastAPI REST API
│   ├── routers/            # API endpoints
│   ├── services/           # Business logic
│   ├── models/             # Pydantic models
│   ├── config.py           # Configuration management
│   ├── main.py             # Application entry point
│   ├── Dockerfile          # Lightweight backend image
│   └── Dockerfile.browsers # Full backend with browser support
├── frontend/               # React web interface
│   ├── src/               # React components
│   ├── Dockerfile         # Production frontend build
│   └── nginx.conf         # Nginx configuration
├── docker-compose.yml              # Basic Docker setup
├── docker-compose.browsers.yml    # Docker with browsers
└── DEPLOYMENT.md          # Comprehensive deployment guide
```

## Features

### Backend (FastAPI)
- RESTful API for web scraping
- Health check endpoints (`/health`, `/health/ready`)
- Support for multiple fetcher types:
  - **Static**: Fast HTTP requests (always available)
  - **Dynamic**: Full browser automation (optional)
  - **Stealthy**: Anti-bot bypass (optional)
- Configurable via environment variables
- Comprehensive error handling and logging
- CORS support
- OpenAPI documentation

### Frontend (React + Vite)
- Clean, responsive web interface
- Real-time scraping results
- Support for CSS selectors
- Multiple fetcher selection
- Error handling and loading states
- Production-ready with Nginx

### Core (Scrapling)
- Original Scrapling library preserved
- All features available for direct use
- Reusable across projects
- Can be used standalone

## Configuration

### Environment Variables

#### Backend (`.env`)
```bash
APP_NAME="Scrapling API"
ENVIRONMENT=development          # development | production
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=*                  # Comma-separated origins
LOG_LEVEL=info                  # debug | info | warning | error

# Optional: Supabase integration
SUPABASE_URL=
SUPABASE_KEY=

# Scraping settings
ENABLE_BROWSER_FETCHERS=true    # Enable dynamic/stealthy fetchers
MAX_CONCURRENT_REQUESTS=10
DEFAULT_TIMEOUT=30
```

#### Frontend (`.env`)
```bash
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=Scrapling Web Interface
```

#### Docker (`.env` at root)
```bash
BACKEND_PORT=8000
FRONTEND_PORT=3000
ENVIRONMENT=production
ENABLE_BROWSER_FETCHERS=false   # Set to true if using browsers
```

## API Endpoints

### Health Checks
- `GET /health` - Basic health status
- `GET /health/ready` - Readiness probe with detailed checks

### Scraping
- `POST /api/v1/scrape` - Scrape a URL
  ```json
  {
    "url": "https://example.com",
    "fetcher_type": "static",
    "css_selector": ".content",
    "headless": true,
    "timeout": 30
  }
  ```
- `GET /api/v1/test` - Test scraping with example site

### Documentation
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation (ReDoc)

## Deployment Options

### 1. Docker (Production Ready)

**Lightweight (Static fetcher only):**
```bash
docker-compose up -d
```
- Smaller image size (~500MB)
- Lower resource usage
- HTTP scraping only

**Full (With browsers):**
```bash
docker-compose -f docker-compose.browsers.yml up -d
```
- Complete functionality
- Larger image size (~2GB)
- Supports all fetcher types

### 2. VPS Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on:
- Ubuntu/Debian server setup
- Nginx reverse proxy configuration
- SSL with Let's Encrypt
- Process management
- Security hardening

### 3. Cloud Platforms

Compatible with:
- AWS EC2
- DigitalOcean Droplets
- Google Cloud Compute Engine
- Linode
- Railway
- Render
- Fly.io

See [DEPLOYMENT.md](DEPLOYMENT.md) for platform-specific guides.

### 4. Kubernetes

Example configurations provided in [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Deployments
- Services
- Ingress
- ConfigMaps
- Health checks

## Resource Requirements

### Minimum (Static fetcher)
- 1 CPU core
- 512MB RAM
- 5GB storage

### Recommended (With browsers)
- 2 CPU cores
- 2GB RAM
- 10GB storage

### Production (High traffic)
- 4+ CPU cores
- 4GB+ RAM
- 20GB+ storage

## Development

### Backend Development
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Testing
```bash
# Backend tests
cd core
pytest

# API tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Restrict origins in production
3. **HTTPS**: Always use SSL certificates
4. **Rate Limiting**: Implement for public APIs
5. **Updates**: Keep dependencies current
6. **Monitoring**: Set up logging and alerting

## Troubleshooting

### Backend Issues
```bash
# Check logs
docker-compose logs backend

# Verify health
curl http://localhost:8000/health

# Test scraping
curl -X POST http://localhost:8000/api/v1/test
```

### Frontend Issues
```bash
# Check logs
docker-compose logs frontend

# Verify connection
curl http://localhost:3000
```

### Browser Fetchers Not Working
1. Ensure using `docker-compose.browsers.yml`
2. Check `ENABLE_BROWSER_FETCHERS=true`
3. Increase shared memory: `shm_size: '2gb'`
4. Verify browser installation in container

## Performance Optimization

1. **Use Static Fetcher**: When browser automation isn't needed
2. **Enable Caching**: Cache frequently accessed data
3. **Limit Concurrency**: Balance throughput and resources
4. **Horizontal Scaling**: Deploy multiple backend instances
5. **CDN**: Use for frontend static assets
6. **Database**: Integrate Supabase for persistent storage

## Original Scrapling Features

All original Scrapling capabilities are preserved in `core/scrapling/`:
- HTTP requests with TLS fingerprinting
- Full browser automation
- Stealth mode and anti-bot bypass
- Session management
- Proxy rotation
- Adaptive scraping
- Spider framework
- CLI tools
- MCP server

See the [original README](docs/README_ORIGINAL.md) for library-specific documentation.

## Links

- **Scrapling Documentation**: https://scrapling.readthedocs.io
- **Original Repository**: https://github.com/D4Vinci/Scrapling
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **API Documentation**: http://localhost:8000/docs (when running)

## License

BSD-3-Clause License - See [LICENSE](LICENSE)

## Credits

Built on top of [Scrapling](https://github.com/D4Vinci/Scrapling) by Karim Shoair.

This deployment-ready version maintains all core functionality while adding:
- Production-ready architecture
- FastAPI REST API
- React web interface
- Docker support
- Comprehensive deployment options
- Configuration management
- Health monitoring
