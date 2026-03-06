#!/bin/bash

echo "Scrapling Deployment Setup Verification"
echo "========================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ (missing)"
        return 1
    fi
}

echo "Project Structure:"
echo "==================="
check_dir "core"
check_dir "core/scrapling"
check_dir "backend"
check_dir "backend/routers"
check_dir "backend/services"
check_dir "backend/models"
check_dir "frontend"
check_dir "frontend/src"
echo ""

echo "Configuration Files:"
echo "===================="
check_file ".env.example"
check_file "backend/.env.example"
check_file "frontend/.env.example"
echo ""

echo "Docker Files:"
echo "============="
check_file "docker-compose.yml"
check_file "docker-compose.browsers.yml"
check_file "backend/Dockerfile"
check_file "backend/Dockerfile.browsers"
check_file "frontend/Dockerfile"
check_file "frontend/nginx.conf"
echo ""

echo "Backend Files:"
echo "=============="
check_file "backend/main.py"
check_file "backend/config.py"
check_file "backend/requirements.txt"
check_file "backend/routers/health.py"
check_file "backend/routers/scraping.py"
check_file "backend/services/scraper.py"
check_file "backend/models/scraping.py"
echo ""

echo "Frontend Files:"
echo "==============="
check_file "frontend/package.json"
check_file "frontend/vite.config.js"
check_file "frontend/index.html"
check_file "frontend/src/main.jsx"
check_file "frontend/src/App.jsx"
echo ""

echo "Documentation:"
echo "=============="
check_file "README.deployment.md"
check_file "DEPLOYMENT.md"
echo ""

echo "Prerequisites Check:"
echo "===================="

if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker $(docker --version | cut -d' ' -f3 | tr -d ',')"
else
    echo -e "${YELLOW}○${NC} Docker (not installed - needed for Docker deployment)"
fi

if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker Compose $(docker-compose --version | cut -d' ' -f3 | tr -d ',')"
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker Compose (plugin) $(docker compose version | cut -d' ' -f3 | tr -d ',')"
else
    echo -e "${YELLOW}○${NC} Docker Compose (not installed - needed for Docker deployment)"
fi

if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✓${NC} Python $(python3 --version | cut -d' ' -f2)"
else
    echo -e "${YELLOW}○${NC} Python3 (not installed - needed for local development)"
fi

if command -v node &> /dev/null; then
    echo -e "${GREEN}✓${NC} Node.js $(node --version | tr -d 'v')"
else
    echo -e "${YELLOW}○${NC} Node.js (not installed - needed for frontend development)"
fi

if command -v npm &> /dev/null; then
    echo -e "${GREEN}✓${NC} npm $(npm --version)"
else
    echo -e "${YELLOW}○${NC} npm (not installed - needed for frontend development)"
fi

echo ""
echo "========================================"
echo "Verification Complete!"
echo ""
echo "Next Steps:"
echo "----------"
echo "1. For Docker deployment:"
echo "   cp .env.example .env && docker-compose up -d"
echo ""
echo "2. For local development:"
echo "   ./start-local.sh"
echo ""
echo "3. Read the deployment guide:"
echo "   cat DEPLOYMENT.md"
echo ""
