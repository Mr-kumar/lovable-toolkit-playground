"""
PDF Unlock API
Handles removing password protection from PDF documents
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
async def unlock_pdf(
    file: UploadFile = File(...),
    password: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove password protection from a PDF document
    
    Args:
        file: Password-protected PDF file to unlock
        password: Password to unlock the PDF
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with unlock results and download URL
    """
    try:
        # Validate file type
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Validate password
        if not password:
            raise HTTPException(status_code=400, detail="Password is required")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded file
        file_info = await file_storage.save_uploaded_file(file, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.UNLOCK,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={"unlocked": True}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Process the PDF
            output_path = f"storage/temp/unlocked_{job.id}.pdf"
            result = await pdf_processor.unlock_pdf(file_info["path"], output_path, password)
            
            # Save processed file
            processed_info = await file_storage.save_processed_file(
                output_path, current_user.id, job.id, f"unlocked_{file.filename}"
            )
            
            # Complete job
            job.complete_job(processed_info["path"], result)
            job.output_file_name = processed_info["filename"]
            job.output_file_size = processed_info["size"]
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF unlock completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "unlocked": result["unlocked"],
                "output_size": processed_info["size"],
                "message": "PDF has been unlocked successfully"
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF unlock failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Unlock failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF unlock error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/info")
async def get_unlock_info():
    """Get information about PDF unlock capabilities"""
    return {
        "description": "Remove password protection from PDF documents",
        "supported_formats": ["PDF"],
        "requirements": {
            "password": "Required - the password that protects the PDF",
            "ownership": "You must own the PDF or have permission to unlock it"
        },
        "features": [
            "Remove password protection",
            "Maintain document quality",
            "Fast processing",
            "Secure handling"
        ],
        "max_file_size_mb": 100,
        "security_note": "Only use this tool on PDFs you own or have permission to unlock. Unauthorized access to protected documents may violate terms of service or laws."
    }
