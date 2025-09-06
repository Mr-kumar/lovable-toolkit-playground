import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, Any
from database import db_manager
from file_storage import file_storage

# Configure logging
logger = logging.getLogger(__name__)

class CleanupService:
    """Service for cleaning up old files and data"""
    
    def __init__(self):
        self.db_manager = db_manager
        self.file_storage = file_storage
    
    async def cleanup_old_files(self) -> Dict[str, int]:
        """Clean up old files from storage"""
        try:
            cleanup_stats = await self.file_storage.cleanup_old_files()
            logger.info(f"File cleanup completed: {cleanup_stats}")
            return cleanup_stats
        except Exception as e:
            logger.error(f"File cleanup failed: {e}")
            return {"error": str(e)}
    
    async def cleanup_old_jobs(self, days_old: int = 30) -> int:
        """Clean up old completed/failed jobs"""
        try:
            db = self.db_manager.get_session()
            try:
                from models.job_model import Job, JobStatus
                from datetime import datetime, timedelta
                
                cutoff_date = datetime.utcnow() - timedelta(days=days_old)
                
                # Get old jobs
                old_jobs = db.query(Job).filter(
                    Job.status.in_([JobStatus.COMPLETED, JobStatus.FAILED]),
                    Job.completed_at < cutoff_date
                ).all()
                
                deleted_count = 0
                for job in old_jobs:
                    # Delete associated files
                    if job.input_file_path:
                        await self.file_storage.delete_file(job.input_file_path)
                    if job.output_file_path:
                        await self.file_storage.delete_file(job.output_file_path)
                    
                    # Delete job record
                    db.delete(job)
                    deleted_count += 1
                
                db.commit()
                logger.info(f"Cleaned up {deleted_count} old jobs")
                return deleted_count
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Job cleanup failed: {e}")
            return 0
    
    async def cleanup_expired_sessions(self) -> int:
        """Clean up expired user sessions (if using session-based auth)"""
        # This would be implemented if using session-based authentication
        # For JWT-based auth, this is not needed
        return 0
    
    async def full_cleanup(self) -> Dict[str, Any]:
        """Perform full cleanup of all old data"""
        try:
            results = {
                "files_cleanup": await self.cleanup_old_files(),
                "jobs_cleanup": await self.cleanup_old_jobs(),
                "sessions_cleanup": await self.cleanup_expired_sessions(),
                "timestamp": datetime.utcnow().isoformat()
            }
            
            logger.info(f"Full cleanup completed: {results}")
            return results
            
        except Exception as e:
            logger.error(f"Full cleanup failed: {e}")
            return {"error": str(e)}

# Global cleanup service instance
cleanup_service = CleanupService()

async def scheduled_cleanup():
    """Scheduled cleanup task"""
    try:
        await cleanup_service.full_cleanup()
    except Exception as e:
        logger.error(f"Scheduled cleanup failed: {e}")
