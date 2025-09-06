from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Profile information
    avatar_url = Column(String(500))
    bio = Column(Text)
    company = Column(String(255))
    website = Column(String(500))
    
    # Subscription and usage tracking
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=True)
    files_processed_this_month = Column(Integer, default=0)
    last_reset_date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    subscription = relationship("Subscription", back_populates="user")
    jobs = relationship("Job", back_populates="user", cascade="all, delete-orphan")
    api_keys = relationship("APIKey", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', full_name='{self.full_name}')>"
    
    def can_process_file(self, file_size_mb: float) -> bool:
        """Check if user can process a file based on their subscription limits"""
        if not self.subscription or not self.subscription.is_active():
            return False
        
        plan = self.subscription.plan
        if plan.max_file_size_mb == -1:  # Unlimited
            return True
        
        return file_size_mb <= plan.max_file_size_mb
    
    def can_process_more_files(self) -> bool:
        """Check if user can process more files this month"""
        if not self.subscription or not self.subscription.is_active():
            return False
        
        plan = self.subscription.plan
        if plan.max_files_per_month == -1:  # Unlimited
            return True
        
        return self.files_processed_this_month < plan.max_files_per_month
    
    def increment_usage(self):
        """Increment the monthly file processing count"""
        self.files_processed_this_month += 1

class APIKey(Base):
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    key_hash = Column(String(255), nullable=False, unique=True)
    name = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    last_used = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="api_keys")
    
    def __repr__(self):
        return f"<APIKey(id={self.id}, name='{self.name}', user_id={self.user_id})>"
    
    def is_expired(self) -> bool:
        """Check if the API key is expired"""
        if not self.expires_at:
            return False
        return datetime.utcnow() > self.expires_at
