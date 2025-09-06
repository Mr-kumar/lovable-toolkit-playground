"""
PDF Compare API
Handles comparing two PDF documents for differences
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
async def compare_pdfs(
    file1: UploadFile = File(...),
    file2: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Compare two PDF documents for differences
    
    Args:
        file1: First PDF file to compare
        file2: Second PDF file to compare
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with comparison results
    """
    try:
        # Validate file types
        if not (file1.content_type == "application/pdf" and file2.content_type == "application/pdf"):
            raise HTTPException(status_code=400, detail="Both files must be PDFs")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded files
        file1_info = await file_storage.save_uploaded_file(file1, current_user.id)
        file2_info = await file_storage.save_uploaded_file(file2, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.COMPARE,
            status=JobStatus.PENDING,
            input_file_path=file1_info["path"],
            input_file_name=f"{file1.filename} vs {file2.filename}",
            input_file_size=file1_info["size"] + file2_info["size"],
            parameters={"file1_name": file1.filename, "file2_name": file2.filename}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Process the PDFs
            result = await pdf_processor.compare_pdfs(file1_info["path"], file2_info["path"])
            
            # Complete job
            job.complete_job(None, result)  # No output file for comparison
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF comparison completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "comparison_result": result["comparison_result"],
                "differences_found": result["differences_found"],
                "similarity_score": result["similarity_score"],
                "file1_pages": result["file1_pages"],
                "file2_pages": result["file2_pages"],
                "differences": result["differences"]
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF comparison failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF comparison error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/info")
async def get_compare_info():
    """Get information about PDF comparison capabilities"""
    return {
        "description": "Compare two PDF documents to find differences",
        "supported_formats": ["PDF"],
        "comparison_features": [
            "Text differences",
            "Layout changes",
            "Page count differences",
            "Similarity scoring"
        ],
        "output": {
            "similarity_score": "Percentage of similarity (0-100)",
            "differences_found": "Boolean indicating if differences exist",
            "differences": "Detailed list of differences found"
        },
        "max_file_size_mb": 100,
        "use_cases": [
            "Document version control",
            "Quality assurance",
            "Change tracking",
            "Document verification"
        ]
    }
