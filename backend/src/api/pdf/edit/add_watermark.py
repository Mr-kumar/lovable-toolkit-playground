"""
PDF Watermark API
Handles adding watermarks to PDF documents
"""

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
import logging

from database import get_db
from services.auth_service import get_current_user
from services.file_storage import file_storage
from services.pdf_utils import pdf_processor
from models.user_model import User
from models.job_model import Job, JobType, JobStatus

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/")
async def add_watermark(
    file: UploadFile = File(...),
    watermark_text: str = Form("DRAFT"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add text watermark to PDF document
    
    Args:
        file: PDF file to watermark
        watermark_text: Text to use as watermark
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with watermark results and download URL
    """
    try:
        # Validate file type
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Validate watermark text
        if not watermark_text or not watermark_text.strip():
            raise HTTPException(status_code=400, detail="Watermark text is required")
        
        if len(watermark_text) > 100:
            raise HTTPException(status_code=400, detail="Watermark text must be 100 characters or less")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded file
        file_info = await file_storage.save_uploaded_file(file, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.WATERMARK,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={"watermark_text": watermark_text}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Process the PDF
            output_path = f"storage/temp/watermarked_{job.id}.pdf"
            result = await pdf_processor.add_watermark(file_info["path"], output_path, watermark_text)
            
            # Save processed file
            processed_info = await file_storage.save_processed_file(
                output_path, current_user.id, job.id, f"watermarked_{file.filename}"
            )
            
            # Complete job
            job.complete_job(processed_info["path"], result)
            job.output_file_name = processed_info["filename"]
            job.output_file_size = processed_info["size"]
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF watermark completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "watermark_text": result["watermark_text"],
                "pages_watermarked": result["pages_watermarked"],
                "output_size": processed_info["size"]
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF watermark failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Watermark addition failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF watermark error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/info")
async def get_watermark_info():
    """Get information about PDF watermark capabilities"""
    return {
        "description": "Add text watermarks to PDF documents",
        "supported_formats": ["PDF"],
        "watermark_options": {
            "text": "Custom text watermark",
            "max_length": 100,
            "position": "Centered and rotated 45 degrees",
            "style": "Light gray, semi-transparent"
        },
        "features": [
            "Custom text watermarks",
            "Applied to all pages",
            "Professional appearance",
            "Maintains document quality"
        ],
        "max_file_size_mb": 100,
        "examples": [
            "DRAFT",
            "CONFIDENTIAL",
            "SAMPLE",
            "Your Company Name"
        ]
    }
