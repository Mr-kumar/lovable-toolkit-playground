"""
PDF Repair API
Handles repairing corrupted or damaged PDF documents
"""

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
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
async def repair_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Repair a corrupted or damaged PDF document
    
    Args:
        file: PDF file to repair
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with repair results and download URL
    """
    try:
        # Validate file type
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded file
        file_info = await file_storage.save_uploaded_file(file, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.REPAIR,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={"repair_type": "full"}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Process the PDF
            output_path = f"storage/temp/repaired_{job.id}.pdf"
            result = await pdf_processor.repair_pdf(file_info["path"], output_path)
            
            # Save processed file
            processed_info = await file_storage.save_processed_file(
                output_path, current_user.id, job.id, f"repaired_{file.filename}"
            )
            
            # Complete job
            job.complete_job(processed_info["path"], result)
            job.output_file_name = processed_info["filename"]
            job.output_file_size = processed_info["size"]
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF repair completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "repair_successful": result["repair_successful"],
                "issues_found": result["issues_found"],
                "issues_fixed": result["issues_fixed"],
                "pages_recovered": result["pages_recovered"],
                "output_size": processed_info["size"]
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF repair failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Repair failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF repair error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/info")
async def get_repair_info():
    """Get information about PDF repair capabilities"""
    return {
        "description": "Repair corrupted or damaged PDF documents",
        "supported_formats": ["PDF"],
        "repair_capabilities": [
            "Fix corrupted file structure",
            "Recover damaged pages",
            "Repair broken links and bookmarks",
            "Restore missing metadata"
        ],
        "common_issues_fixed": [
            "File header corruption",
            "Cross-reference table errors",
            "Missing page objects",
            "Invalid object references",
            "Stream corruption"
        ],
        "features": [
            "Automatic error detection",
            "Safe repair process",
            "Data recovery",
            "Quality preservation"
        ],
        "max_file_size_mb": 100,
        "note": "Repair success depends on the extent of corruption. Severely damaged files may not be fully recoverable."
    }
