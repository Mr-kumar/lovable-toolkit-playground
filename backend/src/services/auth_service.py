from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import os
import secrets
import hashlib
import logging

from database import get_db
from models.user_model import User, APIKey
from models.subscription_model import SubscriptionStatus

# Configure logging
logger = logging.getLogger(__name__)

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token scheme
security = HTTPBearer()

class AuthService:
    """Authentication service for handling user authentication and authorization"""
    
    def __init__(self):
        self.pwd_context = pwd_context
        self.secret_key = SECRET_KEY
        self.algorithm = ALGORITHM
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        """Hash a password"""
        return self.pwd_context.hash(password)
    
    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """Create a JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def create_refresh_token(self, data: Dict[str, Any]) -> str:
        """Create a JWT refresh token"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str, token_type: str = "access") -> Dict[str, Any]:
        """Verify and decode a JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            
            # Check token type
            if payload.get("type") != token_type:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Invalid token type. Expected {token_type}"
                )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
    
    def create_user(self, db: Session, email: str, password: str, full_name: str) -> User:
        """Create a new user"""
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = self.get_password_hash(password)
        new_user = User(
            email=email,
            password_hash=hashed_password,
            full_name=full_name
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
    
    def authenticate_user(self, db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate a user with email and password"""
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None
        
        if not self.verify_password(password, user.password_hash):
            return None
        
        return user
    
    def generate_api_key(self, user_id: int, name: str) -> tuple[str, str]:
        """Generate a new API key for a user"""
        # Generate a random API key
        api_key = secrets.token_urlsafe(32)
        
        # Hash the API key for storage
        key_hash = hashlib.sha256(api_key.encode()).hexdigest()
        
        return api_key, key_hash
    
    def verify_api_key(self, db: Session, api_key: str) -> Optional[User]:
        """Verify an API key and return the associated user"""
        key_hash = hashlib.sha256(api_key.encode()).hexdigest()
        
        api_key_obj = db.query(APIKey).filter(
            APIKey.key_hash == key_hash,
            APIKey.is_active == True
        ).first()
        
        if not api_key_obj:
            return None
        
        # Check if API key is expired
        if api_key_obj.is_expired():
            return None
        
        # Update last used timestamp
        api_key_obj.last_used = datetime.utcnow()
        db.commit()
        
        return api_key_obj.user

# Global auth service instance
auth_service = AuthService()

# Dependency functions for different permission levels
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    try:
        token = credentials.credentials
        payload = auth_service.verify_token(token, "access")
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is deactivated"
            )
        
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )

async def get_current_user_optional(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Get current user if authenticated, otherwise return None"""
    try:
        authorization = request.headers.get("Authorization")
        if not authorization or not authorization.startswith("Bearer "):
            return None
        
        token = authorization.split(" ")[1]
        payload = auth_service.verify_token(token, "access")
        user_id = payload.get("sub")
        
        if not user_id:
            return None
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            return None
        
        return user
        
    except Exception:
        return None

async def require_verified_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Require a verified user account"""
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email verification required"
        )
    return current_user

async def require_active_subscription(
    current_user: User = Depends(get_current_user)
) -> User:
    """Require an active subscription"""
    if not current_user.subscription or not current_user.subscription.is_active():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Active subscription required"
        )
    return current_user

async def require_pro_user(
    current_user: User = Depends(require_active_subscription)
) -> User:
    """Require Pro subscription or higher"""
    if not current_user.subscription or not current_user.subscription.plan:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Pro subscription required"
        )
    
    plan_name = current_user.subscription.plan.name.lower()
    if plan_name not in ["pro", "enterprise"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Pro subscription or higher required"
        )
    
    return current_user

async def require_enterprise_user(
    current_user: User = Depends(require_active_subscription)
) -> User:
    """Require Enterprise subscription"""
    if not current_user.subscription or not current_user.subscription.plan:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Enterprise subscription required"
        )
    
    plan_name = current_user.subscription.plan.name.lower()
    if plan_name != "enterprise":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Enterprise subscription required"
        )
    
    return current_user

async def require_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Require admin privileges"""
    # This would need to be implemented based on your admin system
    # For now, we'll check if the user has a specific role or flag
    if not hasattr(current_user, 'is_admin') or not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

async def check_file_limit(
    current_user: User = Depends(require_active_subscription),
    file_size_mb: float = 0
) -> User:
    """Check if user can process more files based on their subscription limits"""
    if not current_user.can_process_more_files():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Monthly file limit reached. Please upgrade your subscription."
        )
    
    if not current_user.can_process_file(file_size_mb):
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds your plan limit. Maximum allowed: {current_user.subscription.plan.max_file_size_mb}MB"
        )
    
    return current_user

async def get_api_key_user(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Get user from API key authentication"""
    api_key = request.headers.get("X-API-Key")
    if not api_key:
        return None
    
    return auth_service.verify_api_key(db, api_key)

async def require_api_key_or_jwt(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    """Require either API key or JWT authentication"""
    # Try API key first
    api_key_user = await get_api_key_user(request, db)
    if api_key_user:
        return api_key_user
    
    # Fall back to JWT
    try:
        authorization = request.headers.get("Authorization")
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="API key or Bearer token required"
            )
        
        token = authorization.split(" ")[1]
        payload = auth_service.verify_token(token, "access")
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )