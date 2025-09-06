"""
PDF Digital Signature API
Handles adding digital signatures to PDF documents
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
async def sign_pdf(
    file: UploadFile = File(...),
    signature_text: str = Form("Digitally Signed"),
    x: float = Form(100),
    y: float = Form(100),
    width: float = Form(200),
    height: float = Form(50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Add digital signature to PDF document
    
    Args:
        file: PDF file to sign
        signature_text: Text to display in signature
        x: X coordinate for signature position
        y: Y coordinate for signature position
        width: Width of signature area
        height: Height of signature area
        current_user: Authenticated user
        db: Database session
    
    Returns:
        Dict with signature results and download URL
    """
    try:
        # Validate file type
        if not file.content_type == "application/pdf":
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Validate signature parameters
        if not signature_text or not signature_text.strip():
            raise HTTPException(status_code=400, detail="Signature text is required")
        
        if len(signature_text) > 100:
            raise HTTPException(status_code=400, detail="Signature text must be 100 characters or less")
        
        # Check user limits
        if not current_user.can_process_more_files():
            raise HTTPException(status_code=403, detail="Monthly file limit reached")
        
        # Save uploaded file
        file_info = await file_storage.save_uploaded_file(file, current_user.id)
        
        # Create job record
        job = Job(
            user_id=current_user.id,
            job_type=JobType.SIGN,
            status=JobStatus.PENDING,
            input_file_path=file_info["path"],
            input_file_name=file.filename,
            input_file_size=file_info["size"],
            parameters={
                "signature_text": signature_text,
                "x": x, "y": y, "width": width, "height": height
            }
        )
        
        db.add(job)
        db.commit()
        db.refresh(job)
        
        try:
            # Start processing
            job.start_processing()
            db.commit()
            
            # Process the PDF
            output_path = f"storage/temp/signed_{job.id}.pdf"
            result = await pdf_processor.sign_pdf(
                file_info["path"], output_path, signature_text, x, y, width, height
            )
            
            # Save processed file
            processed_info = await file_storage.save_processed_file(
                output_path, current_user.id, job.id, f"signed_{file.filename}"
            )
            
            # Complete job
            job.complete_job(processed_info["path"], result)
            job.output_file_name = processed_info["filename"]
            job.output_file_size = processed_info["size"]
            current_user.increment_usage()
            db.commit()
            
            logger.info(f"PDF signing completed for user {current_user.id}, job {job.id}")
            
            return {
                "success": True,
                "job_id": job.id,
                "download_url": f"/storage/downloads/{current_user.id}/{job.id}/{processed_info['filename']}",
                "signature_added": result["signature_added"],
                "signature_position": result["signature_position"],
                "output_size": processed_info["size"]
            }
            
        except Exception as e:
            # Mark job as failed
            job.fail_job(str(e))
            db.commit()
            logger.error(f"PDF signing failed for job {job.id}: {e}")
            raise HTTPException(status_code=500, detail=f"Signing failed: {str(e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF signing error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/info")
async def get_sign_info():
    """Get information about PDF signing capabilities"""
    return {
        "description": "Add digital signatures to PDF documents",
        "supported_formats": ["PDF"],
        "signature_options": {
            "text": "Custom signature text",
            "position": "X, Y coordinates for signature placement",
            "size": "Width and height of signature area",
            "style": "Professional signature appearance"
        },
        "features": [
            "Custom signature text",
            "Flexible positioning",
            "Professional appearance",
            "Document integrity"
        ],
        "max_file_size_mb": 100,
        "examples": [
            "Digitally Signed",
            "Approved by John Doe",
            "Confidential Document",
            "Your Company Name"
        ]
    }
