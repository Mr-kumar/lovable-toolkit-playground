from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import logging
from datetime import datetime
from pathlib import Path

# Import services and configuration
from services.database import init_db, db_manager
from services.cleanup import scheduled_cleanup
from api.router import api_router
from config import app_settings

# Configure logging
logging.basicConfig(
    level=getattr(logging, app_settings.log_level),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting PDF Toolkit API...")
    
    # Initialize database
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise
    
    # Start background tasks
    # Note: In production, use a proper task queue like Celery
    # asyncio.create_task(periodic_cleanup())
    
    yield
    
    # Shutdown
    logger.info("Shutting down PDF Toolkit API...")

# Create FastAPI app
app = FastAPI(
    title="PDF Toolkit API",
    description="A comprehensive PDF processing API with various tools",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=app_settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "timestamp": datetime.utcnow().isoformat()
        }
    )

# Include main API router
app.include_router(api_router, prefix="/api")

# Static files for uploaded/downloaded files
storage_path = Path(app_settings.storage_base_path)
if not storage_path.exists():
    storage_path.mkdir(parents=True)

uploads_path = storage_path / "uploads"
downloads_path = storage_path / "downloads"

if not uploads_path.exists():
    uploads_path.mkdir(parents=True)
if not downloads_path.exists():
    downloads_path.mkdir(parents=True)

app.mount("/storage", StaticFiles(directory=str(storage_path)), name="storage")

# Health check endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "PDF Toolkit API is running",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": os.getenv("ENVIRONMENT", "development")
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check database connection
        db = db_manager.get_session()
        try:
            db.execute("SELECT 1")
            db_status = "healthy"
        except Exception as e:
            db_status = f"unhealthy: {str(e)}"
        finally:
            db.close()
        
        # Check storage
        storage_stats = db_manager.get_database_stats()
        
        return {
            "status": "healthy" if db_status == "healthy" else "unhealthy",
            "database": db_status,
            "storage": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "stats": storage_stats,
            "config": {
                "max_file_size_mb": app_settings.max_file_size_mb,
                "max_files_per_user_per_month": app_settings.max_files_per_user_per_month,
                "pdf_processing_timeout_seconds": app_settings.pdf_processing_timeout_seconds
            }
        }
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )

@app.get("/api/stats")
async def get_stats():
    """Get API statistics"""
    try:
        stats = db_manager.get_database_stats()
        return {
            "database_stats": stats,
            "timestamp": datetime.utcnow().isoformat(),
            "config": {
                "max_file_size_mb": app_settings.max_file_size_mb,
                "max_files_per_user_per_month": app_settings.max_files_per_user_per_month,
                "cors_origins": app_settings.cors_origins,
                "log_level": app_settings.log_level
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

# Cleanup endpoint (for manual cleanup)
@app.post("/api/admin/cleanup")
async def manual_cleanup():
    """Manual cleanup endpoint"""
    try:
        from services.cleanup import cleanup_service
        results = await cleanup_service.full_cleanup()
        return {
            "message": "Cleanup completed",
            "results": results,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    
    logger.info(f"Starting server on {app_settings.host}:{app_settings.port}")
    
    uvicorn.run(
        "main:app",
        host=app_settings.host,
        port=app_settings.port,
        reload=app_settings.reload,
        log_level=app_settings.log_level.lower()
    )