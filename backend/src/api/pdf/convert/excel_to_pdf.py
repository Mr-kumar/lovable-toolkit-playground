"""
Excel to PDF Conversion API
Handles converting Excel spreadsheets to PDF format
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
async def excel_to_pdf(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Convert Excel spreadsheet to PDF
    
    Args:
        file: Excel file (.xls or .xlsx) to convert
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with conversion results and download URL
    """
    try:
        # Validate file type
        allowed_types = [
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="File must be an Excel file (.xls or .xlsx)")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded file
        file_info = await file_storage.save_uploaded_file(file, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.EXCEL_TO_PDF,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={"input_format": "excel", "output_format": "pdf"}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Convert Excel to PDF using LibreOffice
            output_path = f"storage/temp/excel_to_pdf_{job.id}.pdf"
            success = await convert_excel_to_pdf(file_info["path"], output_path)
            
            if not success:
                raise Exception("Excel to PDF conversion failed")
            
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
            
            logger.info(f"Excel to PDF conversion completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "original_size": file_info["size"],
                "converted_size": processed_info["size"],
                "input_format": "Excel",
                "output_format": "PDF"
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"Excel to PDF conversion failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Excel to PDF conversion error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

async def convert_excel_to_pdf(input_path: str, output_path: str) -> bool:
    """
    Convert Excel spreadsheet to PDF using LibreOffice
    
    Args:
        input_path: Path to input Excel file
        output_path: Path for output PDF file
    
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
                "--convert-to", "pdf",
                "--outdir", temp_dir,
                input_path
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            
            if result.returncode != 0:
                logger.error(f"LibreOffice conversion failed: {result.stderr}")
                return False
            
            # Find the generated PDF file
            input_filename = os.path.basename(input_path)
            pdf_filename = os.path.splitext(input_filename)[0] + ".pdf"
            temp_pdf_path = os.path.join(temp_dir, pdf_filename)
            
            if not os.path.exists(temp_pdf_path):
                logger.error("Generated PDF file not found")
                return False
            
            # Copy to output path
            import shutil
            shutil.copy2(temp_pdf_path, output_path)
            
            return True
            
    except subprocess.TimeoutExpired:
        logger.error("LibreOffice conversion timed out")
        return False
    except Exception as e:
        logger.error(f"Excel to PDF conversion error: {e}")
        return False

@router.get("/info")
async def get_excel_to_pdf_info():
    """Get information about Excel to PDF conversion capabilities"""
    return {
        "description": "Convert Excel spreadsheets to PDF format",
        "supported_formats": {
            "input": ["XLS", "XLSX"],
            "output": ["PDF"]
        },
        "features": [
            "Preserve table structure",
            "Maintain formatting",
            "Auto-fit to pages",
            "High-quality output"
        ],
        "max_file_size_mb": 100,
        "requirements": "LibreOffice must be installed on the server"
    }
