"""
PDF Split API
Handles splitting PDF files by pages or ranges
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
async def split_pdf(
    file: UploadFile = File(...),
    pages: str = Form("1"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Split a PDF file by pages or ranges
    
    Args:
        file: PDF file to split
        pages: Page specification (e.g., "1,3,5" or "1-5" or "1,3-7,10")
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with split results and download URLs
    """
    try:
        # Validate file type
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Validate pages parameter
        if not pages or not pages.strip():
            raise HTTPException(status_code=400, detail="Pages parameter is required")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded file
        file_info = await file_storage.save_uploaded_file(file, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.SPLIT,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={"pages": pages}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Process the PDF
            output_dir = f"storage/temp/split_{job.id}"
            import os
            os.makedirs(output_dir, exist_ok=True)
            
            result = await pdf_processor.split_pdf(file_info["path"], output_dir, pages)
            
            # Save processed files
            download_urls = []
            for i, output_file in enumerate(result["output_files"]):
                processed_info = await file_storage.save_processed_file(
                    output_file, current_user.id, job.id, f"page_{i+1}.pdf"
                )
                download_urls.append({
                    "page_number": i + 1,
                    "filename": processed_info["filename"],
                    "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                    "size": processed_info["size"]
                })
            
            # Complete job
            job.complete_job(result["output_files"][0], result)  # Use first file as main output
            job.output_file_name = f"split_{len(result['output_files'])}_pages"
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF split completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "pages_extracted": result["pages_extracted"],
                "download_urls": download_urls,
                "total_files": len(download_urls)
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF split failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Split failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF split error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/info")
async def get_split_info():
    """Get information about PDF split capabilities"""
    return {
        "description": "Split PDF files by pages or extract specific pages",
        "supported_formats": ["PDF"],
        "page_specification": {
            "examples": [
                "1 - Extract page 1",
                "1,3,5 - Extract pages 1, 3, and 5",
                "1-5 - Extract pages 1 through 5",
                "1,3-7,10 - Extract page 1, pages 3-7, and page 10"
            ],
            "format": "Comma-separated page numbers or ranges"
        },
        "features": [
            "Extract specific pages",
            "Split by page ranges",
            "Maintain original quality",
            "Multiple output files"
        ],
        "max_file_size_mb": 100
    }
