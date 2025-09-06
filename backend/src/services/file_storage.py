import os
import shutil
import uuid
import aiofiles
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from pathlib import Path
import logging
from fastapi import UploadFile, HTTPException
import magic
import hashlib

# Configure logging
logger = logging.getLogger(__name__)

class FileStorageService:
    """Service for managing file storage operations"""
    
    def __init__(self, base_path: str = "storage"):
        self.base_path = Path(base_path)
        self.uploads_dir = self.base_path / "uploads"
        self.downloads_dir = self.base_path / "downloads"
        self.temp_dir = self.base_path / "temp"
        
        # Create directories if they don't exist
        self._ensure_directories()
        
        # File cleanup settings
        self.max_file_age_hours = int(os.getenv("MAX_FILE_AGE_HOURS", "24"))
        self.max_temp_file_age_hours = int(os.getenv("MAX_TEMP_FILE_AGE_HOURS", "1"))
    
    def _ensure_directories(self):
        """Ensure all required directories exist"""
        for directory in [self.uploads_dir, self.downloads_dir, self.temp_dir]:
            directory.mkdir(parents=True, exist_ok=True)
    
    async def save_uploaded_file(self, file: UploadFile, user_id: int, job_id: Optional[int] = None) -> Dict[str, Any]:
        """Save uploaded file and return file information"""
        try:
            # Generate unique filename
            file_extension = self._get_file_extension(file.filename)
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            
            # Create user-specific directory
            user_dir = self.uploads_dir / str(user_id)
            user_dir.mkdir(exist_ok=True)
            
            # If job_id is provided, create job-specific subdirectory
            if job_id:
                job_dir = user_dir / str(job_id)
                job_dir.mkdir(exist_ok=True)
                file_path = job_dir / unique_filename
            else:
                file_path = user_dir / unique_filename
            
            # Save file
            async with aiofiles.open(file_path, 'wb') as f:
                content = await file.read()
                await f.write(content)
            
            # Get file information
            file_info = await self._get_file_info(file_path, file.filename, content)
            
            logger.info(f"File saved: {file_path}")
            return file_info
            
        except Exception as e:
            logger.error(f"Error saving file: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    async def save_temp_file(self, file: UploadFile) -> Dict[str, Any]:
        """Save file to temporary directory"""
        try:
            file_extension = self._get_file_extension(file.filename)
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = self.temp_dir / unique_filename
            
            async with aiofiles.open(file_path, 'wb') as f:
                content = await file.read()
                await f.write(content)
            
            file_info = await self._get_file_info(file_path, file.filename, content)
            return file_info
            
        except Exception as e:
            logger.error(f"Error saving temp file: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to save temporary file: {str(e)}")
    
    async def save_processed_file(self, file_path: str, user_id: int, job_id: int, original_filename: str) -> Dict[str, Any]:
        """Save processed file to downloads directory"""
        try:
            source_path = Path(file_path)
            if not source_path.exists():
                raise HTTPException(status_code=404, detail="Source file not found")
            
            # Create user-specific directory
            user_dir = self.downloads_dir / str(user_id)
            user_dir.mkdir(exist_ok=True)
            
            # Create job-specific subdirectory
            job_dir = user_dir / str(job_id)
            job_dir.mkdir(exist_ok=True)
            
            # Generate output filename
            file_extension = self._get_file_extension(original_filename)
            output_filename = f"processed_{uuid.uuid4()}{file_extension}"
            output_path = job_dir / output_filename
            
            # Copy file
            shutil.copy2(source_path, output_path)
            
            file_info = await self._get_file_info(output_path, output_filename, None)
            return file_info
            
        except Exception as e:
            logger.error(f"Error saving processed file: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to save processed file: {str(e)}")
    
    async def get_file_info(self, file_path: str) -> Dict[str, Any]:
        """Get file information"""
        path = Path(file_path)
        if not path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        return await self._get_file_info(path, path.name, None)
    
    async def _get_file_info(self, file_path: Path, original_filename: str, content: Optional[bytes]) -> Dict[str, Any]:
        """Get comprehensive file information"""
        try:
            # Get file size
            file_size = file_path.stat().st_size if content is None else len(content)
            
            # Get file type
            if content:
                file_type = magic.from_buffer(content, mime=True)
            else:
                file_type = magic.from_file(str(file_path), mime=True)
            
            # Calculate file hash
            if content:
                file_hash = hashlib.sha256(content).hexdigest()
            else:
                async with aiofiles.open(file_path, 'rb') as f:
                    content = await f.read()
                    file_hash = hashlib.sha256(content).hexdigest()
            
            return {
                "path": str(file_path),
                "filename": original_filename,
                "size": file_size,
                "size_mb": round(file_size / (1024 * 1024), 2),
                "type": file_type,
                "hash": file_hash,
                "created_at": datetime.fromtimestamp(file_path.stat().st_ctime),
                "modified_at": datetime.fromtimestamp(file_path.stat().st_mtime)
            }
            
        except Exception as e:
            logger.error(f"Error getting file info: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to get file information: {str(e)}")
    
    def _get_file_extension(self, filename: str) -> str:
        """Get file extension from filename"""
        if not filename:
            return ""
        return Path(filename).suffix.lower()
    
    def validate_file_type(self, file: UploadFile, allowed_types: List[str]) -> bool:
        """Validate file type"""
        if not file.content_type:
            return False
        return file.content_type in allowed_types
    
    def validate_file_size(self, file: UploadFile, max_size_mb: float) -> bool:
        """Validate file size"""
        # Read file to get size
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset to beginning
        
        max_size_bytes = max_size_mb * 1024 * 1024
        return file_size <= max_size_bytes
    
    async def delete_file(self, file_path: str) -> bool:
        """Delete a file"""
        try:
            path = Path(file_path)
            if path.exists():
                path.unlink()
                logger.info(f"File deleted: {file_path}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting file: {e}")
            return False
    
    async def delete_user_files(self, user_id: int) -> int:
        """Delete all files for a user"""
        deleted_count = 0
        try:
            user_upload_dir = self.uploads_dir / str(user_id)
            user_download_dir = self.downloads_dir / str(user_id)
            
            for directory in [user_upload_dir, user_download_dir]:
                if directory.exists():
                    shutil.rmtree(directory)
                    deleted_count += 1
            
            logger.info(f"Deleted {deleted_count} directories for user {user_id}")
            return deleted_count
            
        except Exception as e:
            logger.error(f"Error deleting user files: {e}")
            return deleted_count
    
    async def cleanup_old_files(self) -> Dict[str, int]:
        """Clean up old files"""
        cleanup_stats = {
            "uploads_deleted": 0,
            "downloads_deleted": 0,
            "temp_deleted": 0
        }
        
        current_time = datetime.now()
        
        # Clean up uploads
        cleanup_stats["uploads_deleted"] = await self._cleanup_directory(
            self.uploads_dir, 
            current_time - timedelta(hours=self.max_file_age_hours)
        )
        
        # Clean up downloads
        cleanup_stats["downloads_deleted"] = await self._cleanup_directory(
            self.downloads_dir, 
            current_time - timedelta(hours=self.max_file_age_hours)
        )
        
        # Clean up temp files
        cleanup_stats["temp_deleted"] = await self._cleanup_directory(
            self.temp_dir, 
            current_time - timedelta(hours=self.max_temp_file_age_hours)
        )
        
        logger.info(f"Cleanup completed: {cleanup_stats}")
        return cleanup_stats
    
    async def _cleanup_directory(self, directory: Path, cutoff_time: datetime) -> int:
        """Clean up files in a directory older than cutoff time"""
        deleted_count = 0
        
        if not directory.exists():
            return deleted_count
        
        try:
            for item in directory.rglob("*"):
                if item.is_file():
                    file_time = datetime.fromtimestamp(item.stat().st_mtime)
                    if file_time < cutoff_time:
                        item.unlink()
                        deleted_count += 1
                elif item.is_dir() and not any(item.iterdir()):
                    # Remove empty directories
                    item.rmdir()
                    
        except Exception as e:
            logger.error(f"Error cleaning up directory {directory}: {e}")
        
        return deleted_count
    
    def get_storage_stats(self) -> Dict[str, Any]:
        """Get storage statistics"""
        stats = {
            "total_size_mb": 0,
            "file_count": 0,
            "uploads_size_mb": 0,
            "downloads_size_mb": 0,
            "temp_size_mb": 0
        }
        
        for directory_name, directory in [
            ("uploads", self.uploads_dir),
            ("downloads", self.downloads_dir),
            ("temp", self.temp_dir)
        ]:
            if directory.exists():
                size, count = self._get_directory_stats(directory)
                stats[f"{directory_name}_size_mb"] = round(size / (1024 * 1024), 2)
                stats["total_size_mb"] += round(size / (1024 * 1024), 2)
                stats["file_count"] += count
        
        return stats
    
    def _get_directory_stats(self, directory: Path) -> tuple[int, int]:
        """Get size and file count for a directory"""
        total_size = 0
        file_count = 0
        
        try:
            for item in directory.rglob("*"):
                if item.is_file():
                    total_size += item.stat().st_size
                    file_count += 1
        except Exception as e:
            logger.error(f"Error getting directory stats for {directory}: {e}")
        
        return total_size, file_count

# Global file storage service instance
file_storage = FileStorageService()
