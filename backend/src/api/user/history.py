"""
User History API
Handles user's PDF processing history and job tracking
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import logging

from database import get_db
from services.auth_service import get_current_user
from models.user_model import User
from models.job_model import Job, JobStatus, JobType

logger = logging.getLogger(__name__)

router = APIRouter()

class JobHistoryResponse(BaseModel):
    job_id: int
    job_type: str
    status: str
    input_file_name: Optional[str]
    output_file_name: Optional[str]
    input_file_size: Optional[int]
    output_file_size: Optional[int]
    created_at: datetime
    completed_at: Optional[datetime]
    processing_time: Optional[str]
    error_message: Optional[str]
    result_data: Optional[dict]

class HistoryStatsResponse(BaseModel):
    total_jobs: int
    completed_jobs: int
    failed_jobs: int
    pending_jobs: int
    files_processed_this_month: int
    total_processing_time: str
    average_processing_time: str

@router.get("/", response_model=List[JobHistoryResponse])
async def get_job_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status_filter: Optional[JobStatus] = None,
    job_type_filter: Optional[JobType] = None
):
    """Get user's PDF processing job history"""
    try:
        query = db.query(Job).filter(Job.user_id == current_user.id)
        
        # Apply filters
        if status_filter:
            query = query.filter(Job.status == status_filter)
        if job_type_filter:
            query = query.filter(Job.job_type == job_type_filter)
        
        # Order by creation date (newest first)
        jobs = query.order_by(Job.created_at.desc())\
            .offset(offset)\
            .limit(limit)\
            .all()
        
        return [
            JobHistoryResponse(
                job_id=job.id,
                job_type=job.job_type.value,
                status=job.status.value,
                input_file_name=job.input_file_name,
                output_file_name=job.output_file_name,
                input_file_size=job.input_file_size,
                output_file_size=job.output_file_size,
                created_at=job.created_at,
                completed_at=job.completed_at,
                processing_time=job.get_processing_duration(),
                error_message=job.error_message,
                result_data=job.result_data
            )
            for job in jobs
        ]
        
    except Exception as e:
        logger.error(f"Failed to get job history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get job history"
        )

@router.get("/stats", response_model=HistoryStatsResponse)
async def get_history_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's processing statistics"""
    try:
        # Get all jobs for the user
        jobs = db.query(Job).filter(Job.user_id == current_user.id).all()
        
        total_jobs = len(jobs)
        completed_jobs = len([j for j in jobs if j.status == JobStatus.COMPLETED])
        failed_jobs = len([j for j in jobs if j.status == JobStatus.FAILED])
        pending_jobs = len([j for j in jobs if j.status in [JobStatus.PENDING, JobStatus.PROCESSING]])
        
        # Calculate processing times
        completed_jobs_with_time = [j for j in jobs if j.status == JobStatus.COMPLETED and j.processing_time_seconds]
        total_processing_time = sum(j.processing_time_seconds for j in completed_jobs_with_time)
        average_processing_time = total_processing_time / len(completed_jobs_with_time) if completed_jobs_with_time else 0
        
        def format_time(seconds):
            if seconds < 60:
                return f"{seconds:.1f}s"
            else:
                minutes = int(seconds // 60)
                secs = seconds % 60
                return f"{minutes}m {secs:.1f}s"
        
        return HistoryStatsResponse(
            total_jobs=total_jobs,
            completed_jobs=completed_jobs,
            failed_jobs=failed_jobs,
            pending_jobs=pending_jobs,
            files_processed_this_month=current_user.files_processed_this_month,
            total_processing_time=format_time(total_processing_time),
            average_processing_time=format_time(average_processing_time)
        )
        
    except Exception as e:
        logger.error(f"Failed to get history stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get history stats"
        )

@router.get("/job/{job_id}", response_model=JobHistoryResponse)
async def get_job_details(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed information about a specific job"""
    try:
        job = db.query(Job).filter(
            Job.id == job_id,
            Job.user_id == current_user.id
        ).first()
        
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        return JobHistoryResponse(
            job_id=job.id,
            job_type=job.job_type.value,
            status=job.status.value,
            input_file_name=job.input_file_name,
            output_file_name=job.output_file_name,
            input_file_size=job.input_file_size,
            output_file_size=job.output_file_size,
            created_at=job.created_at,
            completed_at=job.completed_at,
            processing_time=job.get_processing_duration(),
            error_message=job.error_message,
            result_data=job.result_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get job details: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get job details"
        )

@router.delete("/job/{job_id}")
async def delete_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a specific job and its associated files"""
    try:
        job = db.query(Job).filter(
            Job.id == job_id,
            Job.user_id == current_user.id
        ).first()
        
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job not found"
            )
        
        # Delete associated files
        from services.file_storage import file_storage
        if job.input_file_path:
            await file_storage.delete_file(job.input_file_path)
        if job.output_file_path:
            await file_storage.delete_file(job.output_file_path)
        
        # Delete job record
        db.delete(job)
        db.commit()
        
        logger.info(f"Job {job_id} deleted for user: {current_user.email}")
        
        return {"message": "Job deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete job: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete job"
        )

@router.delete("/clear-history")
async def clear_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear all job history for the user"""
    try:
        # Get all jobs for the user
        jobs = db.query(Job).filter(Job.user_id == current_user.id).all()
        
        # Delete associated files
        from services.file_storage import file_storage
        for job in jobs:
            if job.input_file_path:
                await file_storage.delete_file(job.input_file_path)
            if job.output_file_path:
                await file_storage.delete_file(job.output_file_path)
        
        # Delete all job records
        db.query(Job).filter(Job.user_id == current_user.id).delete()
        db.commit()
        
        logger.info(f"History cleared for user: {current_user.email}")
        
        return {"message": "History cleared successfully"}
        
    except Exception as e:
        logger.error(f"Failed to clear history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to clear history"
        )

@router.get("/recent")
async def get_recent_jobs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=50)
):
    """Get recent jobs for quick access"""
    try:
        jobs = db.query(Job).filter(Job.user_id == current_user.id)\
            .order_by(Job.created_at.desc())\
            .limit(limit)\
            .all()
        
        return {
            "recent_jobs": [
                {
                    "job_id": job.id,
                    "job_type": job.job_type.value,
                    "status": job.status.value,
                    "created_at": job.created_at,
                    "processing_time": job.get_processing_duration()
                }
                for job in jobs
            ]
        }
        
    except Exception as e:
        logger.error(f"Failed to get recent jobs: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get recent jobs"
        )

@router.get("/by-type")
async def get_jobs_by_type(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get job statistics grouped by job type"""
    try:
        jobs = db.query(Job).filter(Job.user_id == current_user.id).all()
        
        # Group jobs by type
        jobs_by_type = {}
        for job in jobs:
            job_type = job.job_type.value
            if job_type not in jobs_by_type:
                jobs_by_type[job_type] = {
                    "total": 0,
                    "completed": 0,
                    "failed": 0,
                    "pending": 0
                }
            
            jobs_by_type[job_type]["total"] += 1
            if job.status == JobStatus.COMPLETED:
                jobs_by_type[job_type]["completed"] += 1
            elif job.status == JobStatus.FAILED:
                jobs_by_type[job_type]["failed"] += 1
            else:
                jobs_by_type[job_type]["pending"] += 1
        
        return {"jobs_by_type": jobs_by_type}
        
    except Exception as e:
        logger.error(f"Failed to get jobs by type: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get jobs by type"
        )
