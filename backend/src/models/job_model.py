from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, Enum, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()

class JobStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class JobType(str, enum.Enum):
    # PDF Operations
    COMPRESS = "compress"
    MERGE = "merge"
    SPLIT = "split"
    ROTATE = "rotate"
    CROP = "crop"
    WATERMARK = "watermark"
    REDACT = "redact"
    SIGN = "sign"
    PROTECT = "protect"
    UNLOCK = "unlock"
    COMPARE = "compare"
    OCR = "ocr"
    REPAIR = "repair"
    
    # Conversions TO PDF
    WORD_TO_PDF = "word_to_pdf"
    EXCEL_TO_PDF = "excel_to_pdf"
    PPT_TO_PDF = "ppt_to_pdf"
    HTML_TO_PDF = "html_to_pdf"
    JPG_TO_PDF = "jpg_to_pdf"
    
    # Conversions FROM PDF
    PDF_TO_WORD = "pdf_to_word"
    PDF_TO_EXCEL = "pdf_to_excel"
    PDF_TO_PPT = "pdf_to_ppt"
    PDF_TO_JPG = "pdf_to_jpg"
    PDF_TO_PDFA = "pdf_to_pdfa"

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_type = Column(Enum(JobType), nullable=False)
    status = Column(Enum(JobStatus), default=JobStatus.PENDING)
    
    # File information
    input_file_path = Column(String(500))
    output_file_path = Column(String(500))
    input_file_name = Column(String(255))
    output_file_name = Column(String(255))
    input_file_size = Column(Integer)  # in bytes
    output_file_size = Column(Integer)  # in bytes
    
    # Job parameters and results
    parameters = Column(JSON)  # JSON object with job-specific parameters
    result_data = Column(JSON)  # JSON object with results (e.g., pages processed, compression ratio)
    error_message = Column(Text)
    
    # Processing information
    processing_time_seconds = Column(Float)
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # API usage tracking
    api_key_id = Column(Integer, ForeignKey("api_keys.id"), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="jobs")
    api_key = relationship("APIKey")
    
    def __repr__(self):
        return f"<Job(id={self.id}, user_id={self.user_id}, job_type='{self.job_type}', status='{self.status}')>"
    
    def start_processing(self):
        """Mark job as started"""
        self.status = JobStatus.PROCESSING
        self.started_at = datetime.utcnow()
    
    def complete_job(self, output_path: str, result_data: dict = None):
        """Mark job as completed"""
        self.status = JobStatus.COMPLETED
        self.completed_at = datetime.utcnow()
        self.output_file_path = output_path
        
        if result_data:
            self.result_data = result_data
        
        # Calculate processing time
        if self.started_at:
            processing_time = self.completed_at - self.started_at
            self.processing_time_seconds = processing_time.total_seconds()
    
    def fail_job(self, error_message: str):
        """Mark job as failed"""
        self.status = JobStatus.FAILED
        self.completed_at = datetime.utcnow()
        self.error_message = error_message
        
        # Calculate processing time
        if self.started_at:
            processing_time = self.completed_at - self.started_at
            self.processing_time_seconds = processing_time.total_seconds()
    
    def get_compression_ratio(self) -> float:
        """Get compression ratio if applicable"""
        if not self.input_file_size or not self.output_file_size:
            return 0.0
        return (1 - self.output_file_size / self.input_file_size) * 100
    
    def get_processing_duration(self) -> str:
        """Get human-readable processing duration"""
        if not self.processing_time_seconds:
            return "N/A"
        
        if self.processing_time_seconds < 60:
            return f"{self.processing_time_seconds:.1f}s"
        else:
            minutes = int(self.processing_time_seconds // 60)
            seconds = self.processing_time_seconds % 60
            return f"{minutes}m {seconds:.1f}s"

class JobQueue(Base):
    __tablename__ = "job_queue"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    priority = Column(Integer, default=0)  # Higher number = higher priority
    scheduled_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True))
    worker_id = Column(String(100))  # ID of the worker processing this job
    
    # Relationships
    job = relationship("Job")
    
    def __repr__(self):
        return f"<JobQueue(id={self.id}, job_id={self.job_id}, priority={self.priority})>"
