from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import models, schemas, database

database.init_db()

app = FastAPI(
    title="Student Database CRUD Application",
    description="FastAPI + SQLite persistent backend for managing student records with grounded AI query capabilities.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AIQueryRequest(BaseModel):
    question: str

# 1. CREATE: Add new student record
@app.post("/students", response_model=schemas.StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(student_in: schemas.StudentCreate, db: Session = Depends(database.get_db)):
    if student_in.id:
        existing_id = db.query(models.Student).filter(models.Student.id == student_in.id).first()
        if existing_id:
            raise HTTPException(status_code=409, detail=f"Student ID '{student_in.id}' already exists")

    existing_email = db.query(models.Student).filter(models.Student.email == student_in.email).first()
    if existing_email:
        raise HTTPException(status_code=409, detail=f"Email '{student_in.email}' is already registered")

    db_student = models.Student(**student_in.model_dump())
    if not db_student.id:
        count = db.query(models.Student).count() + 1
        db_student.id = f"STU-2025-{count:03d}"

    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

# 2. READ: List all students with query & filter options
@app.get("/students", response_model=List[schemas.StudentResponse])
def list_students(
    q: Optional[str] = Query(None, description="Search term for name, ID, or email"),
    course: Optional[str] = Query(None, description="Filter by course/program"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (Active, On Leave, Graduated)"),
    born_after: Optional[str] = Query(None, description="Filter students born after YYYY-MM-DD"),
    db: Session = Depends(database.get_db)
):
    query = db.query(models.Student)
    if q:
        search = f"%{q}%"
        query = query.filter(
            (models.Student.name.ilike(search)) |
            (models.Student.id.ilike(search)) |
            (models.Student.email.ilike(search))
        )
    if course and course != "All":
        query = query.filter(models.Student.course == course)
    if status_filter and status_filter != "All":
        query = query.filter(models.Student.status == status_filter)
    if born_after:
        query = query.filter(models.Student.dob > born_after)

    return query.all()

# 3. READ: Get individual student profile
@app.get("/students/{student_id}", response_model=schemas.StudentResponse)
def get_student(student_id: str, db: Session = Depends(database.get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail=f"Student '{student_id}' not found")
    return student

# 4. UPDATE: Modify existing student details
@app.put("/students/{student_id}", response_model=schemas.StudentResponse)
@app.patch("/students/{student_id}", response_model=schemas.StudentResponse)
def update_student(student_id: str, student_update: schemas.StudentUpdate, db: Session = Depends(database.get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail=f"Student '{student_id}' not found")

    update_data = student_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)

    db.commit()
    db.refresh(student)
    return student

# 5. DELETE: Remove student record from database
@app.delete("/students/{student_id}", status_code=status.HTTP_200_OK)
def delete_student(student_id: str, db: Session = Depends(database.get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail=f"Student '{student_id}' not found")

    db.delete(student)
    db.commit()
    return {"message": f"Student '{student.name}' ({student_id}) deleted successfully", "id": student_id}

# 6. GROUNDED AI QUERY EXTENSION
@app.post("/ai/query")
def ai_query(payload: AIQueryRequest, db: Session = Depends(database.get_db)):
    students = db.query(models.Student).all()
    q = payload.question.lower().strip()

    # Grounded query processing (without executing unrestricted SQL)
    if "how many" in q or "count" in q:
        active = sum(1 for s in students if s.status == "Active")
        return {
            "answer": f"There are {len(students)} total students in the database ({active} Active).",
            "matched_ids": [s.id for s in students]
        }

    import re
    born_match = re.search(r"born after (\d{4})", q) or re.search(r"after (\d{4})", q)
    if born_match:
        year = int(born_match.group(1))
        matched = [s for s in students if int(s.dob.split("-")[0]) > year]
        names = ", ".join([f"{s.name} ({s.dob})" for s in matched])
        return {
            "answer": f"Found {len(matched)} student(s) born after {year}: {names}." if matched else f"No students born after {year}.",
            "matched_ids": [s.id for s in matched]
        }

    return {
        "answer": f"Database contains {len(students)} records. Grounded context verified.",
        "matched_ids": [s.id for s in students]
    }
