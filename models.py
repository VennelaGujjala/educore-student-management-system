from sqlalchemy import Column, String, Float
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    dob = Column(String, nullable=False)  # Format: YYYY-MM-DD
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, nullable=False)
    course = Column(String, default="Computer Science")
    address = Column(String, default="")
    enrollment_date = Column(String, nullable=True)
    status = Column(String, default="Active")
    gpa = Column(Float, default=3.5)
    emergency_contact = Column(String, nullable=True)
    notes = Column(String, nullable=True)
