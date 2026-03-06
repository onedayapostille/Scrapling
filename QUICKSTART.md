# Scrapling - Quick Start Guide

This guide gets you up and running in under 5 minutes.

## Choose Your Path

### 🐳 Option 1: Docker (Easiest)

**Prerequisites:** Docker and Docker Compose installed

```bash
# 1. Set up environment
cp .env.example .env

# 2. Start the application
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

That's it! The application is running.

**With browser support (larger image):**
```bash
docker-compose -f docker-compose.browsers.yml up -d
```

### 💻 Option 2: Local Development

**Prerequisites:** Python 3.10+, Node.js 20+

```bash
# Run the automated script
./start-local.sh
```

Or manually:

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python main.py
```

**Frontend (in another terminal):**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Test the Setup

### Using the Web Interface
1. Open http://localhost:3000
2. Enter a URL (e.g., https://quotes.toscrape.com/)
3. Select "Static" fetcher
4. Click "Scrape"

### Using the API
```bash
# Health check
curl http://localhost:8000/health

# Test scraping
curl -X POST http://localhost:8000/api/v1/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://quotes.toscrape.com/",
    "fetcher_type": "static",
    "css_selector": ".quote .text"
  }'
```

### Using the API Documentation
Open http://localhost:8000/docs for interactive API testing

## What's Running?

### Backend (Port 8000)
- FastAPI REST API
- Health endpoints
- Scraping service with multiple fetcher types
- OpenAPI documentation

### Frontend (Port 3000)
- React web interface
- Real-time scraping results
- Clean, responsive design

## Configuration

### Minimal Setup (Already Works!)
The defaults are production-ready. No changes needed to get started.

### Custom Configuration
Edit `.env` files to customize:

**Backend** (`backend/.env`):
- `PORT=8000` - Change backend port
- `ENABLE_BROWSER_FETCHERS=true` - Enable browser automation
- `CORS_ORIGINS=*` - Restrict CORS in production

**Frontend** (`frontend/.env`):
- `VITE_API_URL=http://localhost:8000` - Backend URL

**Docker** (`.env` at root):
- `BACKEND_PORT=8000` - Map backend port
- `FRONTEND_PORT=3000` - Map frontend port

## Common Commands

### Docker
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Rebuild after code changes
docker-compose up -d --build
```

### Local Development
```bash
# Backend (from backend/)
source venv/bin/activate
python main.py

# Frontend (from frontend/)
npm run dev
npm run build     # Production build
```

## Troubleshooting

### Port Already in Use
Change ports in `.env`:
```bash
BACKEND_PORT=8001
FRONTEND_PORT=3001
```

### Frontend Can't Connect to Backend
1. Check backend is running: `curl http://localhost:8000/health`
2. Update `VITE_API_URL` in `frontend/.env`
3. Restart frontend: `npm run dev`

### Docker Build Fails
```bash
# Clean rebuild
docker-compose down
docker system prune -a
docker-compose up -d --build
```

### Browser Fetchers Not Working
Use the browsers compose file:
```bash
docker-compose -f docker-compose.browsers.yml up -d
```

## Next Steps

1. **Explore the API**: http://localhost:8000/docs
2. **Read the deployment guide**: `cat DEPLOYMENT.md`
3. **Customize the frontend**: Edit `frontend/src/App.jsx`
4. **Add custom endpoints**: Create new routes in `backend/routers/`
5. **Deploy to production**: Follow `DEPLOYMENT.md`

## Getting Help

- **Verify setup**: `./verify-setup.sh`
- **View logs**: `docker-compose logs -f`
- **Check health**: `curl http://localhost:8000/health`
- **API docs**: http://localhost:8000/docs
- **Scrapling docs**: https://scrapling.readthedocs.io

## What You Get

- ✅ Production-ready architecture
- ✅ FastAPI REST API with OpenAPI docs
- ✅ React web interface
- ✅ Docker support (lightweight & full)
- ✅ Environment-based configuration
- ✅ Health check endpoints
- ✅ Error handling and logging
- ✅ CORS support
- ✅ All Scrapling features preserved
- ✅ Easy deployment to any platform

## Architecture

```
┌─────────────┐
│   Frontend  │  React + Vite
│   (Port 3000) │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────┐
│   Backend   │  FastAPI
│   (Port 8000) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Scrapling  │  Core scraping library
│     Core    │  (Static/Dynamic/Stealthy)
└─────────────┘
```

## Production Ready

This setup is deployment-ready for:
- VPS (Ubuntu, Debian, etc.)
- Cloud platforms (AWS, GCP, Azure)
- Container platforms (Railway, Render, Fly.io)
- Kubernetes clusters
- Docker hosting

See `DEPLOYMENT.md` for detailed deployment instructions.

---

**Happy Scraping!** 🚀
