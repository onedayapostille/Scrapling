# Scrapling Deployment Guide

This guide covers local development, Docker deployment, and production hosting options.

## Architecture Overview

The project is structured for deployment flexibility:

```
.
├── core/              # Original Scrapling library (reusable)
│   ├── scrapling/    # Core scraping logic
│   └── tests/        # Test suite
├── backend/          # FastAPI REST API
│   ├── routers/      # API endpoints
│   ├── services/     # Business logic
│   ├── models/       # Pydantic models
│   └── config.py     # Configuration
└── frontend/         # React web interface
    └── src/          # React components
```

## Prerequisites

### For Local Development
- Python 3.10+
- Node.js 20+
- pip and npm

### For Docker Deployment
- Docker 20.10+
- Docker Compose 2.0+

## Local Development

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Optional: Install browser dependencies for dynamic/stealthy fetchers
python -c "from scrapling.cli import install; install(['--force'], standalone_mode=False)"

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run the backend
python main.py
# Or with uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your backend URL

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## Docker Deployment

### Option 1: Static Fetcher Only (Lightweight)

For HTTP-only scraping without browser automation:

```bash
# Create environment file
cp .env.example .env
# Edit .env as needed

# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

This uses the basic `docker-compose.yml` with:
- Smaller image size
- Faster startup
- Lower resource usage
- Static fetcher only (ENABLE_BROWSER_FETCHERS=false)

### Option 2: Full Browser Support

For complete functionality including dynamic and stealthy fetchers:

```bash
# Create environment file
cp .env.example .env
# Edit .env as needed

# Build and run with browser support
docker-compose -f docker-compose.browsers.yml up -d

# View logs
docker-compose -f docker-compose.browsers.yml logs -f

# Stop services
docker-compose -f docker-compose.browsers.yml down
```

This uses `docker-compose.browsers.yml` with:
- Full Playwright/Chromium installation
- Stealth capabilities
- Dynamic rendering
- Larger image size (~2GB)
- Higher resource requirements

### Docker Environment Variables

Edit `.env` file:

```bash
# Application
APP_NAME="Scrapling API"
ENVIRONMENT=production

# Ports
BACKEND_PORT=8000
FRONTEND_PORT=3000

# CORS
CORS_ORIGINS=*

# Logging
LOG_LEVEL=info

# Database (Optional)
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key

# Scraping Configuration
ENABLE_BROWSER_FETCHERS=false  # Set to true for browsers
MAX_CONCURRENT_REQUESTS=10
DEFAULT_TIMEOUT=30
```

### Health Checks

Check service health:

```bash
# Backend health
curl http://localhost:8000/health

# Backend readiness
curl http://localhost:8000/health/ready

# Frontend health (if using nginx frontend)
curl http://localhost:3000
```

## Production Deployment

### VPS Deployment (Ubuntu/Debian)

#### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Optional: Add user to docker group
sudo usermod -aG docker $USER
```

#### 2. Deploy Application

```bash
# Clone or upload your project
cd /opt/scrapling

# Configure environment
cp .env.example .env
nano .env  # Edit configuration

# Deploy
docker-compose up -d

# Enable auto-restart
docker update --restart unless-stopped scrapling-backend scrapling-frontend
```

#### 3. Set Up Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt install nginx -y

# Create configuration
sudo nano /etc/nginx/sites-available/scrapling
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        proxy_pass http://localhost:8000;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/scrapling /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Cloud Platform Deployment

#### AWS EC2 / DigitalOcean / Linode

Follow the VPS deployment steps above. Ensure security groups allow:
- Port 80 (HTTP)
- Port 443 (HTTPS)
- Port 22 (SSH - restrict to your IP)

#### Docker Hosting (Railway, Fly.io, Render)

1. Create separate services for backend and frontend
2. Use provided Dockerfiles
3. Set environment variables in platform dashboard
4. Configure health check endpoints

#### Kubernetes

Example deployment files:

**backend-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: scrapling-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: scrapling-backend
  template:
    metadata:
      labels:
        app: scrapling-backend
    spec:
      containers:
      - name: backend
        image: your-registry/scrapling-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: production
        - name: ENABLE_BROWSER_FETCHERS
          value: "false"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
```

### Environment-Specific Configuration

#### Development
```bash
ENVIRONMENT=development
LOG_LEVEL=debug
ENABLE_BROWSER_FETCHERS=true
CORS_ORIGINS=http://localhost:3000
```

#### Production
```bash
ENVIRONMENT=production
LOG_LEVEL=info
ENABLE_BROWSER_FETCHERS=false  # or true if needed
CORS_ORIGINS=https://your-domain.com
```

## Monitoring and Maintenance

### View Logs

```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Container stats
docker stats
```

### Backup and Updates

```bash
# Pull latest changes
git pull

# Rebuild containers
docker-compose build --no-cache

# Deploy updates
docker-compose up -d

# Clean old images
docker image prune -a
```

### Resource Requirements

**Minimum (Static fetcher only):**
- 1 CPU core
- 512MB RAM
- 5GB storage

**Recommended (With browser support):**
- 2 CPU cores
- 2GB RAM
- 10GB storage

**Production (High traffic):**
- 4+ CPU cores
- 4GB+ RAM
- 20GB+ storage

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker-compose logs backend

# Verify Python version
docker-compose exec backend python --version

# Test dependencies
docker-compose exec backend pip list
```

### Browser fetchers not working

```bash
# Ensure using browsers compose file
docker-compose -f docker-compose.browsers.yml up -d

# Check browser installation
docker-compose exec backend python -c "from scrapling.fetchers import StealthyFetcher; print('OK')"

# Increase shared memory
# Edit docker-compose.browsers.yml and increase shm_size
```

### Frontend can't connect to backend

1. Check CORS_ORIGINS in backend `.env`
2. Verify VITE_API_URL in frontend `.env`
3. Ensure backend is accessible from frontend

### High memory usage

1. Reduce MAX_CONCURRENT_REQUESTS
2. Disable browser fetchers if not needed
3. Add resource limits in docker-compose:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
```

## Security Best Practices

1. **Use Environment Variables**: Never hardcode secrets
2. **Restrict CORS**: Set specific origins in production
3. **Enable HTTPS**: Always use SSL in production
4. **Update Regularly**: Keep dependencies updated
5. **Limit Exposure**: Don't expose ports unnecessarily
6. **Monitor Logs**: Set up log aggregation
7. **Rate Limiting**: Implement rate limiting for public APIs

## Performance Optimization

1. **Enable Caching**: Cache frequently scraped pages
2. **Use Static Fetcher**: When browser automation isn't needed
3. **Limit Concurrency**: Balance throughput and resource usage
4. **Resource Limits**: Set appropriate container limits
5. **CDN**: Use CDN for frontend assets
6. **Load Balancing**: Scale horizontally for high traffic

## Support

For issues and questions:
- Backend API: Check `/health` and `/health/ready` endpoints
- Documentation: FastAPI auto-docs at `/docs`
- Scrapling Library: https://scrapling.readthedocs.io
- Issues: https://github.com/D4Vinci/Scrapling/issues
