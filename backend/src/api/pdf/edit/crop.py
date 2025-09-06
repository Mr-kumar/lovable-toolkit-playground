"""
PDF Crop API
Handles cropping PDF pages
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
async def crop_pdf(
    file: UploadFile = File(...),
    x: float = Form(0),
    y: float = Form(0),
    width: float = Form(100),
    height: float = Form(100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Crop PDF pages by specified dimensions
    
    Args:
        file: PDF file to crop
        x: X coordinate for crop start (percentage)
        y: Y coordinate for crop start (percentage)
        width: Width of crop area (percentage)
        height: Height of crop area (percentage)
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with crop results and download URL
    """
    try:
        # Validate file type
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Validate crop parameters
        if not (0 <= x <= 100 and 0 <= y <= 100 and 0 < width <= 100 and 0 < height <= 100):
            raise HTTPException(status_code=400, detail="Crop parameters must be between 0-100")
        
        if x + width > 100 or y + height > 100:
            raise HTTPException(status_code=400, detail="Crop area exceeds page boundaries")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded file
        file_info = await file_storage.save_uploaded_file(file, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.CROP,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={"x": x, "y": y, "width": width, "height": height}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Process the PDF
            output_path = f"storage/temp/cropped_{job.id}.pdf"
            result = await pdf_processor.crop_pdf(file_info["path"], output_path, x, y, width, height)
            
            # Save processed file
            processed_info = await file_storage.save_processed_file(
                output_path, current_user.id, job.id, f"cropped_{file.filename}"
            )
            
            # Complete job
            job.complete_job(processed_info["path"], result)
            job.output_file_name = processed_info["filename"]
            job.output_file_size = processed_info["size"]
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF crop completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "crop_area": result["crop_area"],
                "pages_cropped": result["pages_cropped"],
                "output_size": processed_info["size"]
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF crop failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Crop failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF crop error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/info")
async def get_crop_info():
    """Get information about PDF crop capabilities"""
    return {
        "description": "Crop PDF pages by specifying dimensions",
        "supported_formats": ["PDF"],
        "crop_parameters": {
            "x": "X coordinate for crop start (0-100%)",
            "y": "Y coordinate for crop start (0-100%)",
            "width": "Width of crop area (1-100%)",
            "height": "Height of crop area (1-100%)"
        },
        "features": [
            "Precise cropping",
            "Percentage-based coordinates",
            "Maintains quality",
            "All pages cropped"
        ],
        "max_file_size_mb": 100,
        "examples": [
            "x=10, y=10, width=80, height=80 - Crop 10% from all edges",
            "x=0, y=0, width=50, height=100 - Crop left half",
            "x=25, y=25, width=50, height=50 - Crop center square"
        ]
    }
