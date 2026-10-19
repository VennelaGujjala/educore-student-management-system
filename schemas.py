from pydantic import BaseModel, EmailStr
from typing import Optional

class StudentBase(BaseModel):
    name: str
    dob: str
    email: EmailStr
    phone: str
    course: Optional[str] = "Computer Science"
    address: Optional[str] = ""
    enrollment_date: Optional[str] = None
    status: Optional[str] = "Active"
    gpa: Optional[float] = 3.5
    emergency_contact: Optional[str] = None
    notes: Optional[str] = None

class StudentCreate(StudentBase):
    id: Optional[str] = None

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    dob: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    course: Optional[str] = None
    address: Optional[str] = None
    enrollment_date: Optional[str] = None
    status: Optional[str] = None
    gpa: Optional[float] = None
    emergency_contact: Optional[str] = None
    notes: Optional[str] = None

class StudentResponse(StudentBase):
    id: str

    class Config:
        from_attributes = True
