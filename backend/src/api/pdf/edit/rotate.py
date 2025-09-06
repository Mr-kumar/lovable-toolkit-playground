"""
PDF Rotate API
Handles rotating PDF pages
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
async def rotate_pdf(
    file: UploadFile = File(...),
    angle: int = Form(90),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Rotate PDF pages by specified angle
    
    Args:
        file: PDF file to rotate
        angle: Rotation angle (90, 180, or 270 degrees)
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with rotation results and download URL
    """
    try:
        # Validate file type
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Validate angle parameter
        if angle not in [90, 180, 270]:
            raise HTTPException(status_code=400, detail="Angle must be 90, 180, or 270 degrees")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded file
        file_info = await file_storage.save_uploaded_file(file, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.ROTATE,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={"angle": angle}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Process the PDF
            output_path = f"storage/temp/rotated_{job.id}.pdf"
            result = await pdf_processor.rotate_pdf(file_info["path"], output_path, angle)
            
            # Save processed file
            processed_info = await file_storage.save_processed_file(
                output_path, current_user.id, job.id, f"rotated_{angle}deg_{file.filename}"
            )
            
            # Complete job
            job.complete_job(processed_info["path"], result)
            job.output_file_name = processed_info["filename"]
            job.output_file_size = processed_info["size"]
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF rotation completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "rotation_angle": result["rotation_angle"],
                "pages_rotated": result["pages_rotated"],
                "output_size": processed_info["size"]
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF rotation failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Rotation failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF rotation error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/info")
async def get_rotate_info():
    """Get information about PDF rotation capabilities"""
    return {
        "description": "Rotate PDF pages by 90, 180, or 270 degrees",
        "supported_formats": ["PDF"],
        "rotation_angles": {
            "90": "Rotate 90 degrees clockwise",
            "180": "Rotate 180 degrees (upside down)",
            "270": "Rotate 270 degrees clockwise (90 degrees counter-clockwise)"
        },
        "features": [
            "Rotate all pages",
            "Maintain quality",
            "Fast processing",
            "Lossless rotation"
        ],
        "max_file_size_mb": 100
    }
