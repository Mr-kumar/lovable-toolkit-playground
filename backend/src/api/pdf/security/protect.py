"""
PDF Protection API
Handles password protecting PDF documents
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
async def protect_pdf(
    file: UploadFile = File(...),
    password: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Password protect a PDF document
    
    Args:
        file: PDF file to protect
        password: Password to protect the PDF with
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with protection results and download URL
    """
    try:
        # Validate file type
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Validate password
        if not password or len(password) < 4:
            raise HTTPException(status_code=400, detail="Password must be at least 4 characters long")
        
        if len(password) > 50:
            raise HTTPException(status_code=400, detail="Password must be 50 characters or less")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded file
        file_info = await file_storage.save_uploaded_file(file, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.PROTECT,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={"protected": True}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Process the PDF
            output_path = f"storage/temp/protected_{job.id}.pdf"
            result = await pdf_processor.protect_pdf(file_info["path"], output_path, password)
            
            # Save processed file
            processed_info = await file_storage.save_processed_file(
                output_path, current_user.id, job.id, f"protected_{file.filename}"
            )
            
            # Complete job
            job.complete_job(processed_info["path"], result)
            job.output_file_name = processed_info["filename"]
            job.output_file_size = processed_info["size"]
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF protection completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "protected": result["protected"],
                "output_size": processed_info["size"],
                "message": "PDF has been password protected successfully"
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF protection failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Protection failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF protection error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/info")
async def get_protect_info():
    """Get information about PDF protection capabilities"""
    return {
        "description": "Password protect PDF documents to control access",
        "supported_formats": ["PDF"],
        "password_requirements": {
            "min_length": 4,
            "max_length": 50,
            "description": "Strong passwords are recommended for better security"
        },
        "features": [
            "Strong encryption",
            "Password protection",
            "Access control",
            "Secure file handling"
        ],
        "max_file_size_mb": 100,
        "security_note": "The password is not stored on our servers. Make sure to remember it or store it securely."
    }
