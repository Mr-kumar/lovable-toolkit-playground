from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
import os
from typing import Generator
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database URL configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pdf_toolkit.db")

# Create engine with appropriate configuration
if "sqlite" in DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=os.getenv("SQL_ECHO", "false").lower() == "true"
    )
else:
    engine = create_engine(
        DATABASE_URL,
        echo=os.getenv("SQL_ECHO", "false").lower() == "true",
        pool_pre_ping=True,
        pool_recycle=300
    )

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """
    Dependency to get database session.
    Yields a database session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def create_tables():
    """Create all database tables"""
    try:
        # Import all models to ensure they're registered
        from models.user_model import User, APIKey
        from models.subscription_model import SubscriptionPlan, Subscription, Invoice, PaymentMethod
        from models.job_model import Job, JobQueue
        
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

def drop_tables():
    """Drop all database tables (use with caution!)"""
    try:
        Base.metadata.drop_all(bind=engine)
        logger.info("Database tables dropped successfully")
    except Exception as e:
        logger.error(f"Error dropping database tables: {e}")
        raise

def init_db():
    """Initialize database with default data"""
    try:
        create_tables()
        
        # Create default subscription plans if they don't exist
        db = SessionLocal()
        try:
            from models.subscription_model import SubscriptionPlan, BillingCycle
            
            # Check if plans already exist
            existing_plans = db.query(SubscriptionPlan).count()
            if existing_plans == 0:
                # Create default subscription plans
                plans = [
                    SubscriptionPlan(
                        name="Free",
                        description="Perfect for occasional PDF processing",
                        price=0.0,
                        billing_cycle=BillingCycle.MONTHLY,
                        max_files_per_month=5,
                        max_file_size_mb=10,
                        features='["Basic PDF tools", "5 files per month", "10MB file limit"]',
                        is_active=True,
                        sort_order=1
                    ),
                    SubscriptionPlan(
                        name="Pro",
                        description="For professionals who need more power",
                        price=9.99,
                        billing_cycle=BillingCycle.MONTHLY,
                        max_files_per_month=-1,  # Unlimited
                        max_file_size_mb=100,
                        features='["All PDF tools", "Unlimited files", "100MB file limit", "Priority support", "API access"]',
                        is_active=True,
                        is_popular=True,
                        sort_order=2
                    ),
                    SubscriptionPlan(
                        name="Enterprise",
                        description="For teams and organizations",
                        price=29.99,
                        billing_cycle=BillingCycle.MONTHLY,
                        max_files_per_month=-1,  # Unlimited
                        max_file_size_mb=500,
                        features='["Everything in Pro", "500MB file limit", "Team management", "Custom integrations", "Dedicated support"]',
                        is_active=True,
                        sort_order=3
                    )
                ]
                
                for plan in plans:
                    db.add(plan)
                
                db.commit()
                logger.info("Default subscription plans created")
            
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise

class DatabaseManager:
    """Database manager for advanced operations"""
    
    def __init__(self):
        self.engine = engine
        self.SessionLocal = SessionLocal
    
    def get_session(self) -> Session:
        """Get a new database session"""
        return self.SessionLocal()
    
    def execute_raw_sql(self, sql: str, params: dict = None):
        """Execute raw SQL query"""
        with self.engine.connect() as connection:
            result = connection.execute(sql, params or {})
            return result.fetchall()
    
    def backup_database(self, backup_path: str):
        """Create a backup of the database"""
        if "sqlite" in DATABASE_URL:
            import shutil
            shutil.copy2(DATABASE_URL.replace("sqlite:///", ""), backup_path)
        else:
            # For PostgreSQL/MySQL, you would use pg_dump or mysqldump
            raise NotImplementedError("Database backup not implemented for this database type")
    
    def get_database_stats(self) -> dict:
        """Get database statistics"""
        db = self.get_session()
        try:
            from models.user_model import User
            from models.job_model import Job
            from models.subscription_model import Subscription
            
            stats = {
                "total_users": db.query(User).count(),
                "active_users": db.query(User).filter(User.is_active == True).count(),
                "total_jobs": db.query(Job).count(),
                "completed_jobs": db.query(Job).filter(Job.status == "completed").count(),
                "active_subscriptions": db.query(Subscription).filter(Subscription.status == "active").count(),
            }
            return stats
        finally:
            db.close()

# Global database manager instance
db_manager = DatabaseManager()
