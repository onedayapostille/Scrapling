from fastapi import APIRouter
from datetime import datetime
import sys
from config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.app_version,
        "environment": settings.environment
    }


@router.get("/health/ready")
async def readiness_check():
    checks = {
        "api": "ok",
        "python_version": sys.version,
        "browser_fetchers": "enabled" if settings.enable_browser_fetchers else "disabled"
    }

    all_ok = all(v == "ok" or "enabled" in str(v) or v for v in checks.values())

    return {
        "ready": all_ok,
        "checks": checks,
        "timestamp": datetime.utcnow().isoformat()
    }
