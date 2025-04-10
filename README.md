# User Management Project

## Description
This is a full-stack web application for managing users. The application allows creating, reading, updating, and deleting (CRUD) user information. It includes a RESTful API built with Node.js and Express.js, a frontend interface using React.js, a PostgreSQL database in production, and automated tests using Jest and Supertest. The application is containerized using Docker and integrated with GitHub Actions for CI/CD.

---

## Features
- User CRUD operations (Create, Read, Update, Delete)
- Backend: REST API with Express.js
- Frontend: React UI
- PostgreSQL database with SQLite used for tests
- CI/CD with GitHub Actions
- Dockerized environment
- Unit and integration tests

---

## Technologies Used
- Frontend: React.js
- Backend: Node.js, Express.js
- Database: PostgreSQL (production), SQLite (test)
- Testing: Jest, Supertest
- Containerization: Docker, Docker Compose
- CI/CD: GitHub Actions

---

## Getting Started

### Prerequisites
- Node.js and npm
- Docker and Docker Compose
- PostgreSQL (for manual local DB setup)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/fati199734/user-management.git
cd user-management
```

2. Install dependencies:
```bash
cd backend
npm install
cd ../frontend
npm install
```

3. Create `.env` file for backend:
```
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/users_db
```

---

## Running the App

### Locally (Without Docker)
#### Start Backend:
```bash
cd backend
npm start
```

#### Start Frontend:
```bash
cd frontend
npm start
```

### With Docker
```bash
docker-compose up --build
```
This will run:
- PostgreSQL container
- Backend API container
- Frontend React container

---

## Running Tests
```bash
cd backend
npm test
```
Uses Jest + Supertest. Tests run on a temporary SQLite database.

---

## CI/CD Pipeline
GitHub Actions runs the following on push:
- Checkout the code
- Install dependencies
- Run tests
- Build and push Docker images to Docker Hub

Secrets used:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

Defined in `.github/workflows/ci.yml`

---

## File Structure
```
user-management/
├── backend/
│   ├── server.js
│   ├── users.sql
│   ├── users.test.js
│   ├── Dockerfile
│   └── ...
├── frontend/
│   ├── App.js
│   ├── components/
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```
 ## Captures d'écran dans le Rapport
Les captures d'écran utilisées dans le rapport sont liées à chaque section pertinente et sont accompagnées de titres pour mieux comprendre leur contexte. Vous trouverez chaque capture dans le document, associée aux différentes parties comme suit :

- Tests automatisés : Capture des résultats des tests dans le terminal.

- GitHub Actions - CI/CD : Capture de l'exécution des pipelines GitHub Actions.

- Dockerisation : Capture des conteneurs Docker en cours d'exécution.

- Ces captures ont été intégrées dans le rapport pour illustrer les différentes étapes du processus de développement et d'intégration.

---

## Authors
Fatima Zahra Benharrouz

---

