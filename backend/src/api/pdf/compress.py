"""
PDF Compression API
Handles PDF file compression operations
"""

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session
from typing import Dict, Any
import logging
import os

from database import get_db
from services.auth_service import get_current_user
from services.file_storage import file_storage
from services.pdf_utils import pdf_processor
from models.user_model import User
from models.job_model import Job, JobType, JobStatus

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/")
async def compress_pdf(
    file: UploadFile = File(...),
    quality: int = Form(50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Compress a PDF file to reduce its size
    
    Args:
        file: PDF file to compress
        quality: Compression quality (1-100, higher = better quality, larger file)
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with compression results and download URL
    """
    try:
        # Validate file type
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Validate quality parameter
        if not 1 <= quality <= 100:
            raise HTTPException(status_code=400, detail="Quality must be between 1 and 100")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded file
        file_info = await file_storage.save_uploaded_file(file, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.COMPRESS,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={"quality": quality}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Process the PDF in a thread pool to avoid blocking the event loop
            output_path = f"storage/temp/compressed_{job.id}.pdf"
            result = await run_in_threadpool(
                pdf_processor.compress_pdf, 
                file_info["path"], 
                output_path, 
                quality
            )
            
            # Save processed file
            processed_info = await file_storage.save_processed_file(
                output_path, current_user.id, job.id, f"compressed_{file.filename}"
            )
            
            # Complete job with detailed results
            job.complete_job(processed_info["path"], {
                "compression_ratio": result["compression_ratio"],
                "original_size": result["original_size"],
                "compressed_size": result["compressed_size"],
                "quality_used": quality
            })
            job.output_file_name = processed_info["filename"]
            job.output_file_size = processed_info["size"]
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF compression completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "compression_ratio": result["compression_ratio"],
                "original_size": result["original_size"],
                "compressed_size": result["compressed_size"],
                "size_reduction_mb": round((result["original_size"] - result["compressed_size"]) / (1024 * 1024), 2)
            }
            
        except HTTPException as e:
            # Mark job as failed
            job.fail_job(str(e.detail))
            db.commit()
            logger.error(f"PDF compression failed for job {job.id}: {e.detail}")
            raise e
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF compression failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF compression error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/info")
async def get_compression_info():
    """Get information about PDF compression capabilities"""
    return {
        "description": "Compress PDF files to reduce file size while maintaining quality",
        "supported_formats": ["PDF"],
        "quality_range": {
            "min": 1,
            "max": 100,
            "default": 50,
            "description": "Higher values = better quality but larger file size"
        },
        "max_file_size_mb": 100,
        "features": [
            "Reduce file size up to 90%",
            "Maintain visual quality",
            "Fast processing",
            "Secure file handling"
        ]
    }