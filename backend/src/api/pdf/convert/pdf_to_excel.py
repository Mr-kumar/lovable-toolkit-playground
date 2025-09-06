"""
PDF to Excel Conversion API
Handles converting PDF files to Excel spreadsheets
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
async def pdf_to_excel(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Convert PDF file to Excel spreadsheet
    
    Args:
        file: PDF file to convert
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with conversion results and download URL
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
            job_type=JobType.PDF_TO_EXCEL,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={"input_format": "pdf", "output_format": "excel"}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Convert PDF to Excel using LibreOffice
            output_path = f"storage/temp/pdf_to_excel_{job.id}.xlsx"
            success = await convert_pdf_to_excel(file_info["path"], output_path)
            
            if not success:
                raise Exception("PDF to Excel conversion failed")
            
            # Save processed file
            processed_info = await file_storage.save_processed_file(
                output_path, current_user.id, job.id, f"converted_{os.path.splitext(file.filename)[0]}.xlsx"
            )
            
            # Complete job
            job.complete_job(processed_info["path"], {"conversion_successful": True})
            job.output_file_name = processed_info["filename"]
            job.output_file_size = processed_info["size"]
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF to Excel conversion completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "original_size": file_info["size"],
                "converted_size": processed_info["size"],
                "input_format": "PDF",
                "output_format": "Excel"
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF to Excel conversion failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF to Excel conversion error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

async def convert_pdf_to_excel(input_path: str, output_path: str) -> bool:
    """
    Convert PDF file to Excel spreadsheet using LibreOffice
    
    Args:
        input_path: Path to input PDF file
        output_path: Path for output Excel file
    
    Returns:
        bool: True if conversion successful, False otherwise
    """
    try:
        # Create temporary directory for LibreOffice
        with tempfile.TemporaryDirectory() as temp_dir:
            # Use LibreOffice to convert
            cmd = [
                "libreoffice",
                "--headless",
                "--convert-to", "xlsx",
                "--outdir", temp_dir,
                input_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            
            if result.returncode != 0:
                logger.error(f"LibreOffice conversion failed: {result.stderr}")
                return False
            
            # Find the generated Excel file
            input_filename = os.path.basename(input_path)
            excel_filename = os.path.splitext(input_filename)[0] + ".xlsx"
            temp_excel_path = os.path.join(temp_dir, excel_filename)
            
            if not os.path.exists(temp_excel_path):
                logger.error("Generated Excel file not found")
                return False
            
            # Copy to output path
            import shutil
            shutil.copy2(temp_excel_path, output_path)
            
            return True
            
    except subprocess.TimeoutExpired:
        logger.error("LibreOffice conversion timed out")
        return False
    except Exception as e:
        logger.error(f"PDF to Excel conversion error: {e}")
        return False

@router.get("/info")
async def get_pdf_to_excel_info():
    """Get information about PDF to Excel conversion capabilities"""
    return {
        "description": "Convert PDF files to Excel spreadsheets",
        "supported_formats": {
            "input": ["PDF"],
            "output": ["XLSX"]
        },
        "features": [
            "Extract tabular data",
            "Preserve table structure",
            "Editable spreadsheet",
            "Data analysis ready"
        ],
        "max_file_size_mb": 100,
        "requirements": "LibreOffice must be installed on the server",
        "note": "Works best with PDFs containing tables and structured data"
    }
