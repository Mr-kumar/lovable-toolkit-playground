"""
PDF Merge API
Handles merging multiple PDF files into one document
"""

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
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
async def merge_pdfs(
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Merge multiple PDF files into a single document
    
    Args:
        files: List of PDF files to merge (2-20 files)
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with merge results and download URL
    """
    try:
        # Validate number of files
        if len(files) < 2:
            raise HTTPException(status_code=400, detail="At least 2 files required for merging")
        
        if len(files) > 20:
            raise HTTPException(status_code=400, detail="Maximum 20 files allowed")
        
        # Validate all files are PDFs
        for file in files:
            if not file.content_type == "application/pdf":
                raise HTTPException(status_code=400, detail="All files must be PDFs")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded files
        file_paths = []
        total_size = 0
        for file in files:
            file_info = await file_storage.save_uploaded_file(file, current_user.id)
            file_paths.append(file_info["path"])
            total_size += file_info["size"]
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.MERGE,
            status=JobStatus.PENDING,
            input_file_path=file_paths[0],  # Use first file as primary
            input_file_name=f"{len(files)}_files_to_merge",
            input_file_size=total_size,
            parameters={"file_count": len(files), "file_names": [f.filename for f in files]}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Process the PDFs
            output_path = f"storage/temp/merged_{job.id}.pdf"
            result = await pdf_processor.merge_pdfs(file_paths, output_path)
            
            # Save processed file
            processed_info = await file_storage.save_processed_file(
                output_path, current_user.id, job.id, f"merged_{len(files)}_files.pdf"
            )
            
            # Complete job
            job.complete_job(processed_info["path"], result)
            job.output_file_name = processed_info["filename"]
            job.output_file_size = processed_info["size"]
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF merge completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "total_pages": result["total_pages"],
                "files_merged": result["files_merged"],
                "output_size": processed_info["size"]
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF merge failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Merge failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF merge error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/info")
async def get_merge_info():
    """Get information about PDF merge capabilities"""
    return {
        "description": "Merge multiple PDF files into a single document",
        "supported_formats": ["PDF"],
        "file_limits": {
            "min_files": 2,
            "max_files": 20,
            "max_file_size_mb": 100
        },
        "features": [
            "Combine multiple PDFs into one",
            "Maintain original quality",
            "Preserve page order",
            "Fast processing"
        ],
        "processing_order": "Files are merged in the order they are uploaded"
    }
