from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    measurements: Optional[Dict] = None

    class Config:
        from_attributes = True

class GarmentBase(BaseModel):
    name: str
    description: str
    category: str
    sizes: Dict
    price: int
    image_url: str

class GarmentCreate(GarmentBase):
    pass

class Garment(GarmentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class TryOnBase(BaseModel):
    garment_id: int

class TryOnCreate(TryOnBase):
    pass

class TryOn(TryOnBase):
    id: int
    user_id: int
    result_image_url: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 