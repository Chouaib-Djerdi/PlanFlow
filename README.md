# PlanFlow Assignement

## Project Overview
This project is a comprehensive [**Project Planning Tool**] designed to assist users in organizing and managing their tasks effectively. Key features include:

- **Authentication**: Secure user login and registration.
- **Project CRUD Operations**: Create, Read, Update, and Delete projects seamlessly.
- **AI-Generated Descriptions**: Leverage artificial intelligence to auto-generate project descriptions.
- **PDF Export**: Export project details as professionally formatted PDFs.

The backend is built using **Django REST Framework (DRF)**, while the frontend utilizes **React Vite** for a responsive and dynamic user interface. Docker is used for containerization to ensure a consistent development and deployment environment.

---

## Features and Technologies

### Key Features
- **User Authentication**: Secure authentication with token-based methods.
- **Dynamic PDF Export**: Generate PDFs with project details.
- **AI Integration**: Use AI to improve user experience by auto-generating content.
- **Media Management**: Handle project media (images and files) efficiently.

### Technology Stack
- **Backend**: Django, Django REST Framework
- **Frontend**: React/Next.js
- **Containerization**: Docker, Docker Compose
- **PDF Generation**: `xhtml2pdf`
- **Environment Variables**: Configured via `.env` files

---

## Project Setup (Dockerized Environment)

### Prerequisites
1. **Docker**: Install Docker from [Docker’s official website](https://www.docker.com/).
2. **Docker Compose**: Ensure Docker Compose is installed (usually included with Docker Desktop).

### Steps to Run the Project

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Chouaib-Djerdi/PlanFlow.git
   cd PlanFlow
   ```

2. **Create `.env` Files**:
   - Backend `.env`:
     ```env
     DEBUG=1
     SECRET_KEY=foo
     HF_API_KEY=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 # Hugging Face Inference Model API KEY
     ```
   - Frontend `.env`:
     ```env
     VITE_API_BASE_URL=https://planflowapi.onrender.com
     ```

3. **Build and Run Containers**:
   ```bash
   docker-compose up --build
   ```
   This command will:
   - Build the backend and frontend images.
   - Create and start containers for the backend, frontend, and database.

4. **Access the Application**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8000/api/](http://localhost:8000/api/)

5. **Run Migrations**:
   Execute the following commands inside the backend container:
   ```bash
   docker exec backend python manage.py migrate
   ```

6. **Create a Superuser**:
   ```bash
   python manage.py createsuperuser
   ```

---


## Deployment

### Render Deployment

Both the frontend and backend are deployed on Render using a `build.sh` script for the backend.

#### Backend Deployment

1. Add the following `build.sh` script to the backend repository:
   ```bash
   #!/usr/bin/env bash

   set -o errexit # Exit on error

   pip install -r requirements.txt

   python manage.py collectstatic --noinput
   python manage.py migrate
   ```

2. Configure the Render service:
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn backend.wsgi`

3. Ensure that environment variables (e.g., `SECRET_KEY`) are configured in the Render dashboard.

#### Frontend Deployment

1. Configure the Render service:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

2. Ensure the `VITE_API_URL` in the `.env` file points to the deployed backend API URL.