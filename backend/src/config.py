"""
Configuration management using Pydantic BaseSettings
Centralizes all application settings with validation
"""

from pydantic import BaseSettings, validator
from typing import Optional, List
import os
from pathlib import Path

class Settings(BaseSettings):
    """Application settings with validation"""
    
    # Database Configuration
    database_url: str = "sqlite:///./pdf_toolkit.db"
    
    # Security Configuration
    secret_key: str
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    algorithm: str = "HS256"
    
    # File Storage Configuration
    max_file_size_mb: int = 100
    max_files_per_user_per_month: int = 100
    max_file_age_hours: int = 24
    max_temp_file_age_hours: int = 1
    storage_base_path: str = "storage"
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    reload: bool = False
    
    # CORS Configuration
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    # PDF Processing Configuration
    pdf_processing_timeout_seconds: int = 300
    max_concurrent_jobs: int = 10
    
    # Email Configuration (for notifications)
    smtp_host: Optional[str] = None
    smtp_port: int = 587
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_use_tls: bool = True
    from_email: Optional[str] = None
    
    # Redis Configuration (for caching and job queues)
    redis_url: Optional[str] = None
    
    # Logging Configuration
    log_level: str = "INFO"
    log_file: Optional[str] = None
    
    # Subscription Configuration
    free_plan_files_per_month: int = 10
    pro_plan_files_per_month: int = 1000
    enterprise_plan_files_per_month: int = 10000
    
    # Rate Limiting
    rate_limit_requests_per_minute: int = 60
    rate_limit_burst: int = 100
    
    @validator("secret_key")
    def validate_secret_key(cls, v):
        if not v or len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        return v
    
    @validator("access_token_expire_minutes")
    def validate_token_expiry(cls, v):
        if v < 1 or v > 1440:  # 1 minute to 24 hours
            raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES must be between 1 and 1440")
        return v
    
    @validator("max_file_size_mb")
    def validate_max_file_size(cls, v):
        if v < 1 or v > 1000:  # 1MB to 1GB
            raise ValueError("MAX_FILE_SIZE_MB must be between 1 and 1000")
        return v
    
    @validator("max_files_per_user_per_month")
    def validate_max_files_per_user(cls, v):
        if v < 1 or v > 100000:
            raise ValueError("MAX_FILES_PER_USER_PER_MONTH must be between 1 and 100000")
        return v
    
    @validator("cors_origins")
    def validate_cors_origins(cls, v):
        if not v:
            raise ValueError("CORS_ORIGINS cannot be empty")
        return v
    
    @validator("pdf_processing_timeout_seconds")
    def validate_processing_timeout(cls, v):
        if v < 30 or v > 3600:  # 30 seconds to 1 hour
            raise ValueError("PDF_PROCESSING_TIMEOUT_SECONDS must be between 30 and 3600")
        return v
    
    @validator("log_level")
    def validate_log_level(cls, v):
        valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in valid_levels:
            raise ValueError(f"LOG_LEVEL must be one of: {valid_levels}")
        return v.upper()
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

# Global settings instance
settings = Settings()

# Environment-specific configurations
class DevelopmentSettings(Settings):
    """Development-specific settings"""
    reload: bool = True
    log_level: str = "DEBUG"
    cors_origins: List[str] = ["*"]  # Allow all origins in development

class ProductionSettings(Settings):
    """Production-specific settings"""
    reload: bool = False
    log_level: str = "INFO"
    cors_origins: List[str] = [
        "https://yourdomain.com",
        "https://www.yourdomain.com"
    ]

class TestingSettings(Settings):
    """Testing-specific settings"""
    database_url: str = "sqlite:///./test_pdf_toolkit.db"
    secret_key: str = "test-secret-key-that-is-long-enough-for-testing"
    max_file_size_mb: int = 10
    max_files_per_user_per_month: int = 5

def get_settings() -> Settings:
    """Get settings based on environment"""
    env = os.getenv("ENVIRONMENT", "development").lower()
    
    if env == "production":
        return ProductionSettings()
    elif env == "testing":
        return TestingSettings()
    else:
        return DevelopmentSettings()

# Export the appropriate settings instance
app_settings = get_settings()
