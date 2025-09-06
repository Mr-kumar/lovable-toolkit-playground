from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, timedelta
import enum

Base = declarative_base()

class BillingCycle(str, enum.Enum):
    MONTHLY = "monthly"
    YEARLY = "yearly"
    LIFETIME = "lifetime"

class SubscriptionStatus(str, enum.Enum):
    ACTIVE = "active"
    CANCELLED = "cancelled"
    EXPIRED = "expired"
    SUSPENDED = "suspended"
    PENDING = "pending"

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"
    CANCELLED = "cancelled"

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    billing_cycle = Column(Enum(BillingCycle), default=BillingCycle.MONTHLY)
    max_files_per_month = Column(Integer, default=5)
    max_file_size_mb = Column(Integer, default=10)
    features = Column(Text)  # JSON string of features
    is_active = Column(Boolean, default=True)
    is_popular = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    subscriptions = relationship("Subscription", back_populates="plan")
    
    def __repr__(self):
        return f"<SubscriptionPlan(id={self.id}, name='{self.name}', price={self.price})>"
    
    def get_yearly_price(self) -> float:
        """Get the yearly price with discount"""
        if self.billing_cycle == BillingCycle.YEARLY:
            return self.price
        elif self.billing_cycle == BillingCycle.MONTHLY:
            return self.price * 12 * 0.8  # 20% discount for yearly
        return self.price

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=False)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.ACTIVE)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    end_date = Column(DateTime(timezone=True))
    auto_renew = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Payment information
    payment_method_id = Column(String(100))  # Stripe payment method ID
    stripe_subscription_id = Column(String(100))  # Stripe subscription ID
    
    # Relationships
    user = relationship("User", back_populates="subscription")
    plan = relationship("SubscriptionPlan", back_populates="subscriptions")
    invoices = relationship("Invoice", back_populates="subscription", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Subscription(id={self.id}, user_id={self.user_id}, plan_id={self.plan_id}, status='{self.status}')>"
    
    def is_active(self) -> bool:
        """Check if subscription is currently active"""
        if self.status != SubscriptionStatus.ACTIVE:
            return False
        
        if not self.end_date:
            return True
        
        return datetime.utcnow() < self.end_date
    
    def days_remaining(self) -> int:
        """Get number of days remaining in subscription"""
        if not self.end_date:
            return -1  # Lifetime subscription
        
        remaining = self.end_date - datetime.utcnow()
        return max(0, remaining.days)
    
    def extend_subscription(self, days: int):
        """Extend subscription by specified days"""
        if self.end_date:
            self.end_date += timedelta(days=days)
        else:
            self.end_date = datetime.utcnow() + timedelta(days=days)

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    due_date = Column(DateTime(timezone=True))
    paid_date = Column(DateTime(timezone=True))
    stripe_invoice_id = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    subscription = relationship("Subscription", back_populates="invoices")
    
    def __repr__(self):
        return f"<Invoice(id={self.id}, subscription_id={self.subscription_id}, amount={self.amount}, status='{self.status}')>"
    
    def is_overdue(self) -> bool:
        """Check if invoice is overdue"""
        if not self.due_date or self.status == PaymentStatus.PAID:
            return False
        return datetime.utcnow() > self.due_date

class PaymentMethod(Base):
    __tablename__ = "payment_methods"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stripe_payment_method_id = Column(String(100), nullable=False)
    type = Column(String(20), nullable=False)  # card, paypal, etc.
    last_four = Column(String(4))
    expiry_month = Column(Integer)
    expiry_year = Column(Integer)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")
    
    def __repr__(self):
        return f"<PaymentMethod(id={self.id}, type='{self.type}', last_four='{self.last_four}')>"
    
    def is_expired(self) -> bool:
        """Check if payment method is expired"""
        if not self.expiry_month or not self.expiry_year:
            return False
        
        current_date = datetime.utcnow()
        expiry_date = datetime(self.expiry_year, self.expiry_month, 1)
        return current_date > expiry_date
