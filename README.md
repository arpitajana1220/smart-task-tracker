# 🧠 Smart Task Tracker

A full-stack task and project management application built with **Django REST Framework (Backend)** and **ReactJS (Frontend)**. It features JWT-based authentication, role-based access control, activity logging, soft deletion, and dynamic task assignment.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Register/Login as `Admin` or `Contributor`
- JWT Token-based authentication
- Protected routes with role-based access

### 🧑‍💼 Admin Capabilities
- Create Projects
- Create Tasks and assign to contributors
- Filter tasks by status
- View Activity Logs (status, assignee, due date history)
- Soft-delete tasks and projects

### 👩‍💻 Contributor Capabilities
- View assigned tasks
- Update task status
- View filtered task list

### 📋 Task Features
- Status management (`todo`, `in_progress`, `done`)
- Due date tracking
- Activity logs for all updates

---

## 🛠️ Tech Stack

### Backend
- Python 3
- Django + Django REST Framework
- Simple JWT
- SQLite (default) / PostgreSQL (optional)

### Frontend
- ReactJS
- Axios
- React Router DOM
- Vanilla CSS (No Tailwind)

---

## 📂 Folder Structure
```bash

smart-task-tracker/
├── backend/
│ ├── core/ # All models, serializers, views
│ ├── api/ # URLs and viewsets
│ ├── settings.py # Django settings
│ └── ...
├── frontend/
│ ├── src/
│ │ ├── pages/ # Register, Login, Dashboard, etc.
│ │ ├── components/ # Navbar, ProtectedRoute, etc.
│ │ └── ...
└── README.md
```
---

## 🔧 Setup Instructions

### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # For Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
## 🔑 Admin Credentials (For Testing)
You can register as an Admin using the dropdown on the Register page.

## 📃 License
This project is licensed under the MIT License.

---









