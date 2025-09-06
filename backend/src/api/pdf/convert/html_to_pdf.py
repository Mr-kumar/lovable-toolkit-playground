"""
HTML to PDF Conversion API
Handles converting HTML files to PDF format
"""

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
import logging
import subprocess
import tempfile
import os

from database import get_db
from services.auth_service import get_current_user
from services.file_storage import file_storage
from models.user_model import User
from models.job_model import Job, JobType, JobStatus

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/")
async def html_to_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Convert HTML file to PDF
    
    Args:
        file: HTML file to convert
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with conversion results and download URL
    """
    try:
        # Validate file type
        allowed_types = ["text/html", "application/xhtml+xml"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="File must be an HTML file")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded file
        file_info = await file_storage.save_uploaded_file(file, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.HTML_TO_PDF,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={"input_format": "html", "output_format": "pdf"}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Convert HTML to PDF using wkhtmltopdf
            output_path = f"storage/temp/html_to_pdf_{job.id}.pdf"
            success = await convert_html_to_pdf(file_info["path"], output_path)
            
            if not success:
                raise Exception("HTML to PDF conversion failed")
            
            # Save processed file
            processed_info = await file_storage.save_processed_file(
                output_path, current_user.id, job.id, f"converted_{os.path.splitext(file.filename)[0]}.pdf"
            )
            
            # Complete job
            job.complete_job(processed_info["path"], {"conversion_successful": True})
            job.output_file_name = processed_info["filename"]
            job.output_file_size = processed_info["size"]
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"HTML to PDF conversion completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "original_size": file_info["size"],
                "converted_size": processed_info["size"],
                "input_format": "HTML",
                "output_format": "PDF"
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"HTML to PDF conversion failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"HTML to PDF conversion error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

async def convert_html_to_pdf(input_path: str, output_path: str) -> bool:
    """
    Convert HTML file to PDF using wkhtmltopdf
    
    Args:
        input_path: Path to input HTML file
        output_path: Path for output PDF file
    
    Returns:
        bool: True if conversion successful, False otherwise
    """
    try:
        cmd = [
            "wkhtmltopdf",
            "--page-size", "A4",
            "--margin-top", "0.75in",
            "--margin-right", "0.75in",
            "--margin-bottom", "0.75in",
            "--margin-left", "0.75in",
            "--encoding", "UTF-8",
            "--no-stop-slow-scripts",
            input_path,
            output_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        
        if result.returncode != 0:
            logger.error(f"wkhtmltopdf conversion failed: {result.stderr}")
            return False
        
        return os.path.exists(output_path)
        
    except subprocess.TimeoutExpired:
        logger.error("HTML to PDF conversion timed out")
        return False
    except Exception as e:
        logger.error(f"HTML to PDF conversion error: {e}")
        return False

@router.get("/info")
async def get_html_to_pdf_info():
    """Get information about HTML to PDF conversion capabilities"""
    return {
        "description": "Convert HTML files to PDF format",
        "supported_formats": {
            "input": ["HTML", "HTM", "XHTML"],
            "output": ["PDF"]
        },
        "features": [
            "Preserve HTML formatting",
            "Support for CSS styles",
            "High-quality output",
            "Fast processing"
        ],
        "max_file_size_mb": 10,
        "requirements": "wkhtmltopdf must be installed on the server"
    }
