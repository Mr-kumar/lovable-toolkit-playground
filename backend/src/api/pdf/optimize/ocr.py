"""
PDF OCR API
Handles Optical Character Recognition on PDF documents
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
async def ocr_pdf(
    file: UploadFile = File(...),
    language: str = Form("eng"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Perform OCR (Optical Character Recognition) on PDF document
    
    Args:
        file: PDF file to perform OCR on
        language: Language code for OCR (e.g., 'eng', 'spa', 'fra')
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with OCR results and download URL
    """
    try:
        # Validate file type
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Validate language parameter
        supported_languages = ["eng", "spa", "fra", "deu", "ita", "por", "rus", "chi_sim", "chi_tra", "jpn", "kor"]
        if language not in supported_languages:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported language. Supported: {', '.join(supported_languages)}"
            )
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded file
        file_info = await file_storage.save_uploaded_file(file, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.OCR,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={"language": language}
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Process the PDF
            output_path = f"storage/temp/ocr_{job.id}.pdf"
            result = await pdf_processor.ocr_pdf(file_info["path"], output_path, language)
            
            # Save processed file
            processed_info = await file_storage.save_processed_file(
                output_path, current_user.id, job.id, f"ocr_{file.filename}"
            )
            
            # Complete job
            job.complete_job(processed_info["path"], result)
            job.output_file_name = processed_info["filename"]
            job.output_file_size = processed_info["size"]
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF OCR completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "language_used": result["language_used"],
                "pages_processed": result["pages_processed"],
                "text_extracted": result["text_extracted"],
                "confidence_score": result["confidence_score"],
                "output_size": processed_info["size"]
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF OCR failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"OCR failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF OCR error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/info")
async def get_ocr_info():
    """Get information about PDF OCR capabilities"""
    return {
        "description": "Perform Optical Character Recognition on PDF documents to make them searchable",
        "supported_formats": ["PDF"],
        "supported_languages": {
            "eng": "English",
            "spa": "Spanish",
            "fra": "French",
            "deu": "German",
            "ita": "Italian",
            "por": "Portuguese",
            "rus": "Russian",
            "chi_sim": "Chinese (Simplified)",
            "chi_tra": "Chinese (Traditional)",
            "jpn": "Japanese",
            "kor": "Korean"
        },
        "features": [
            "Text recognition and extraction",
            "Searchable PDF creation",
            "Multi-language support",
            "High accuracy OCR"
        ],
        "max_file_size_mb": 50,
        "requirements": "Tesseract OCR must be installed on the server",
        "note": "OCR processing may take longer for large files or complex layouts"
    }
