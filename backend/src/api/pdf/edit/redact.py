"""
PDF Redaction API
Handles redacting (blacking out) content in PDF documents
"""

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
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
async def redact_pdf(
    file: UploadFile = File(...),
    redaction_areas: str = Form(...),  # JSON string of areas to redact
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Redact (black out) specified areas in PDF document
    
    Args:
        file: PDF file to redact
        redaction_areas: JSON string containing areas to redact
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with redaction results and download URL
    """
    try:
        # Validate file type
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Validate redaction areas
        if not redaction_areas or not redaction_areas.strip():
            raise HTTPException(status_code=400, detail="Redaction areas are required")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded file
        file_info = await file_storage.save_uploaded_file(file, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.REDACT,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={"redaction_areas": redaction_areas}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Process the PDF
            output_path = f"storage/temp/redacted_{job.id}.pdf"
            result = await pdf_processor.redact_pdf(file_info["path"], output_path, redaction_areas)
            
            # Save processed file
            processed_info = await file_storage.save_processed_file(
                output_path, current_user.id, job.id, f"redacted_{file.filename}"
            )
            
            # Complete job
            job.complete_job(processed_info["path"], result)
            job.output_file_name = processed_info["filename"]
            job.output_file_size = processed_info["size"]
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF redaction completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "areas_redacted": result["areas_redacted"],
                "pages_processed": result["pages_processed"],
                "output_size": processed_info["size"]
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF redaction failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Redaction failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF redaction error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/info")
async def get_redact_info():
    """Get information about PDF redaction capabilities"""
    return {
        "description": "Redact (black out) sensitive content in PDF documents",
        "supported_formats": ["PDF"],
        "redaction_format": {
            "type": "JSON array of redaction areas",
            "structure": [
                {
                    "page": 1,
                    "x": 100,
                    "y": 200,
                    "width": 150,
                    "height": 30,
                    "reason": "Personal information"
                }
            ]
        },
        "features": [
            "Precise area redaction",
            "Multiple areas per page",
            "Permanent content removal",
            "Secure processing"
        ],
        "max_file_size_mb": 100,
        "security_note": "Redaction permanently removes content. Make sure to keep a backup of the original file."
    }
