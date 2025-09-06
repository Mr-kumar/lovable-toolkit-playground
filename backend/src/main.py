from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import os
import logging
from datetime import datetime

# Import services
from services.database import init_db, db_manager
from services.cleanup import scheduled_cleanup
from api.router import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
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
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
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
if not os.path.exists("storage"):
    os.makedirs("storage")
if not os.path.exists("storage/uploads"):
    os.makedirs("storage/uploads")
if not os.path.exists("storage/downloads"):
    os.makedirs("storage/downloads")

app.mount("/storage", StaticFiles(directory="storage"), name="storage")

# Health check endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "PDF Toolkit API is running",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
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
            "stats": storage_stats
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
            "timestamp": datetime.utcnow().isoformat()
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
    
    # Get configuration from environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("RELOAD", "false").lower() == "true"
    
    logger.info(f"Starting server on {host}:{port}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )
