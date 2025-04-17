from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    measurements = Column(JSON, nullable=True)
    
    tryons = relationship("TryOn", back_populates="user")

class Garment(Base):
    __tablename__ = "garments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    category = Column(String)
    sizes = Column(JSON)
    price = Column(Integer)
    image_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    tryons = relationship("TryOn", back_populates="garment")

class TryOn(Base):
    __tablename__ = "tryons"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    garment_id = Column(Integer, ForeignKey("garments.id"))
    result_image_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="tryons")
    garment = relationship("Garment", back_populates="tryons") 