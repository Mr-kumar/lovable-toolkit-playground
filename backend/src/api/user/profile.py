"""
User Profile API
Handles user profile management and settings
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import logging

from database import get_db
from services.auth_service import get_current_user, require_verified_user
from models.user_model import User, APIKey

logger = logging.getLogger(__name__)

router = APIRouter()

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    company: Optional[str] = None
    website: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class UserProfileResponse(BaseModel):
    id: int
    email: str
    full_name: str
    bio: Optional[str]
    company: Optional[str]
    website: Optional[str]
    avatar_url: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime]
    files_processed_this_month: int

class APIKeyCreate(BaseModel):
    name: str
    expires_days: Optional[int] = None

class APIKeyResponse(BaseModel):
    id: int
    name: str
    key: str
    created_at: datetime
    expires_at: Optional[datetime]
    is_active: bool

@router.get("/", response_model=UserProfileResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile information"""
    try:
        return UserProfileResponse(
            id=current_user.id,
            email=current_user.email,
            full_name=current_user.full_name,
            bio=current_user.bio,
            company=current_user.company,
            website=current_user.website,
            avatar_url=current_user.avatar_url,
            is_active=current_user.is_active,
            is_verified=current_user.is_verified,
            created_at=current_user.created_at,
            last_login=current_user.last_login,
            files_processed_this_month=current_user.files_processed_this_month
        )
    except Exception as e:
        logger.error(f"Failed to get user profile: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get profile"
        )

@router.put("/", response_model=UserProfileResponse)
async def update_profile(
    profile_update: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile information"""
    try:
        # Update fields if provided
        if profile_update.full_name is not None:
            current_user.full_name = profile_update.full_name
        if profile_update.bio is not None:
            current_user.bio = profile_update.bio
        if profile_update.company is not None:
            current_user.company = profile_update.company
        if profile_update.website is not None:
            current_user.website = profile_update.website
        
        current_user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(current_user)
        
        logger.info(f"Profile updated for user: {current_user.email}")
        
        return UserProfileResponse(
            id=current_user.id,
            email=current_user.email,
            full_name=current_user.full_name,
            bio=current_user.bio,
            company=current_user.company,
            website=current_user.website,
            avatar_url=current_user.avatar_url,
            is_active=current_user.is_active,
            is_verified=current_user.is_verified,
            created_at=current_user.created_at,
            last_login=current_user.last_login,
            files_processed_this_month=current_user.files_processed_this_month
        )
        
    except Exception as e:
        logger.error(f"Profile update failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Profile update failed"
        )

@router.post("/change-password")
async def change_password(
    password_change: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    try:
        from services.auth_service import auth_service
        
        # Verify current password
        if not auth_service.verify_password(password_change.current_password, current_user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Validate new password
        if len(password_change.new_password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be at least 8 characters long"
            )
        
        # Update password
        current_user.password_hash = auth_service.get_password_hash(password_change.new_password)
        current_user.updated_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"Password changed for user: {current_user.email}")
        
        return {"message": "Password changed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Password change failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password change failed"
        )

@router.post("/upload-avatar")
async def upload_avatar(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload user avatar (placeholder implementation)"""
    try:
        # In a real implementation, you would:
        # 1. Accept file upload
        # 2. Validate image file
        # 3. Resize/optimize image
        # 4. Store in cloud storage
        # 5. Update user.avatar_url
        
        return {"message": "Avatar upload not implemented yet"}
        
    except Exception as e:
        logger.error(f"Avatar upload failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Avatar upload failed"
        )

@router.delete("/avatar")
async def delete_avatar(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user avatar"""
    try:
        current_user.avatar_url = None
        current_user.updated_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"Avatar deleted for user: {current_user.email}")
        
        return {"message": "Avatar deleted successfully"}
        
    except Exception as e:
        logger.error(f"Avatar deletion failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Avatar deletion failed"
        )

# API Key Management
@router.post("/api-keys", response_model=APIKeyResponse)
async def create_api_key(
    api_key_data: APIKeyCreate,
    current_user: User = Depends(require_verified_user),
    db: Session = Depends(get_db)
):
    """Create a new API key for the user"""
    try:
        from services.auth_service import auth_service
        
        # Generate API key
        api_key, key_hash = auth_service.generate_api_key(current_user.id, api_key_data.name)
        
        # Calculate expiry date
        expires_at = None
        if api_key_data.expires_days:
            from datetime import timedelta
            expires_at = datetime.utcnow() + timedelta(days=api_key_data.expires_days)
        
        # Save API key
        api_key_obj = APIKey(
            user_id=current_user.id,
            key_hash=key_hash,
            name=api_key_data.name,
            expires_at=expires_at
        )
        
        db.add(api_key_obj)
        db.commit()
        db.refresh(api_key_obj)
        
        logger.info(f"API key created for user: {current_user.email}")
        
        return APIKeyResponse(
            id=api_key_obj.id,
            name=api_key_obj.name,
            key=api_key,  # Return the actual key only once
            created_at=api_key_obj.created_at,
            expires_at=api_key_obj.expires_at,
            is_active=api_key_obj.is_active
        )
        
    except Exception as e:
        logger.error(f"API key creation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API key creation failed"
        )

@router.get("/api-keys")
async def get_api_keys(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's API keys"""
    try:
        api_keys = db.query(APIKey).filter(APIKey.user_id == current_user.id).all()
        
        return {
            "api_keys": [
                {
                    "id": key.id,
                    "name": key.name,
                    "is_active": key.is_active,
                    "created_at": key.created_at,
                    "last_used": key.last_used,
                    "expires_at": key.expires_at,
                    "is_expired": key.is_expired()
                }
                for key in api_keys
            ]
        }
        
    except Exception as e:
        logger.error(f"Failed to get API keys: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get API keys"
        )

@router.delete("/api-keys/{key_id}")
async def delete_api_key(
    key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an API key"""
    try:
        api_key = db.query(APIKey).filter(
            APIKey.id == key_id,
            APIKey.user_id == current_user.id
        ).first()
        
        if not api_key:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="API key not found"
            )
        
        db.delete(api_key)
        db.commit()
        
        logger.info(f"API key deleted for user: {current_user.email}")
        
        return {"message": "API key deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"API key deletion failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API key deletion failed"
        )

@router.delete("/account")
async def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete user account and all associated data"""
    try:
        # Delete user files
        from services.file_storage import file_storage
        await file_storage.delete_user_files(current_user.id)
        
        # Delete user (cascade will handle related records)
        db.delete(current_user)
        db.commit()
        
        logger.info(f"Account deleted for user: {current_user.email}")
        
        return {"message": "Account deleted successfully"}
        
    except Exception as e:
        logger.error(f"Account deletion failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Account deletion failed"
        )



