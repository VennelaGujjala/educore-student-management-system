# Student Database CRUD Application & AI Query Engine

A backend application built with **FastAPI** and **SQLite** for managing student records using Create, Read, Update, and Delete (CRUD) operations, with an optional AI extension to answer natural-language questions grounded in the stored data.

---

## Features

- **Create**: Add new student records with unique ID generation and validation.
- **Read**: List all students, filter by parameters (e.g., date of birth, course), or retrieve individual profiles.
- **Update**: Modify an existing student's details via `PUT` or `PATCH`.
- **Delete**: Remove student records from persistent SQLite storage.
- **Grounded AI Queries**: Natural-language question answering (e.g., *"How many students are there?"*, *"List students born after 2005"*) strictly grounded in database records without unrestricted SQL execution.
- **Interactive Documentation**: Auto-generated Swagger UI and ReDoc endpoints.

---

## Tech Stack

- **Python 3.9+**
- **FastAPI**
- **SQLite3**
- **SQLAlchemy ORM**
- **Pydantic v2**
- **Uvicorn**

---

## Student Record Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Unique Student ID (e.g., `STU-2024-001`) |
| `name` | String | Yes | Full name of the student |
| `dob` | String | Yes | Date of birth (`YYYY-MM-DD`) |
| `email` | String | Yes | Unique institutional contact email |
| `phone` | String | Yes | Contact phone number |
| `course` | String | Optional | Degree program / course name |
| `address` | String | Optional | Residential address |
| `enrollment_date` | String | Optional | Date of enrollment (`YYYY-MM-DD`) |
| `status` | String | Optional | Status (`Active`, `On Leave`, `Graduated`, `Suspended`) |
| `gpa` | Float | Optional | Cumulative GPA (0.00 – 4.00) |

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_REPOSITORY_NAME>
```

### 2. Create and Activate Virtual Environment
```bash
# Linux / macOS:
python3 -m venv venv
source venv/bin/activate

# Windows:
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Server
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The server will start at: `http://127.0.0.1:8000`

---

## API Documentation

- **Interactive Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/students` | Create a new student |
| `GET` | `/students` | List / filter students |
| `GET` | `/students/{student_id}` | View a specific student profile |
| `PUT` / `PATCH` | `/students/{student_id}` | Update student details |
| `DELETE` | `/students/{student_id}` | Delete a student record |
| `POST` | `/ai/query` | Natural-language query grounded in student records |

---

## Testing API Endpoints (cURL)

### Create a Student
```bash
curl -X POST "http://127.0.0.1:8000/students" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "STU-2025-001",
    "name": "Sarah Connor",
    "dob": "2006-03-15",
    "email": "sarah.connor@edumail.org",
    "phone": "+1 (555) 789-1234",
    "course": "Data Science & Artificial Intelligence",
    "address": "123 Tech Drive",
    "status": "Active",
    "gpa": 3.92
  }'
```

### List Students (Filter by Birth Year)
```bash
curl -X GET "http://127.0.0.1:8000/students?born_after=2005-12-31"
```

### View a Student Profile
```bash
curl -X GET "http://127.0.0.1:8000/students/STU-2025-001"
```

### Update Student Details
```bash
curl -X PATCH "http://127.0.0.1:8000/students/STU-2025-001" \
  -H "Content-Type: application/json" \
  -d '{"gpa": 3.98, "status": "Active"}'
```

### Delete a Student
```bash
curl -X DELETE "http://127.0.0.1:8000/students/STU-2025-001"
```

### Natural-Language AI Query
```bash
curl -X POST "http://127.0.0.1:8000/ai/query" \
  -H "Content-Type: application/json" \
  -d '{"question": "List students born after 2005"}'
```

---

## Security

- **Grounded AI**: The model synthesizes responses using retrieved database context only and does not execute unrestricted SQL.
- **Data Validation**: Strict Pydantic models validate all incoming requests. Dummy data is used for testing; no real personal data is committed.
