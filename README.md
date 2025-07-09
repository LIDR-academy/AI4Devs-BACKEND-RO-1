# LTI - Talent Tracking System | EN

This project is a full-stack application with a React frontend and an Express backend using Prisma as an ORM. The frontend is started with Create React App, and the backend is written in TypeScript.

## Explanation of Directories and Files

- `backend/`: Contains the server-side code written in Node.js.
  - `src/`: Contains the source code for the backend.
    - `index.ts`: The entry point for the backend server.
    - `application/`: Contains the application logic.
    - `domain/`: Contains the business logic.
    - `infrastructure/`: Contains code that communicates with the database.
    - `presentation/`: Contains code related to the presentation layer (such as controllers).
      - `controllers/`: Contains controller files, e.g., `candidateController.ts`, `positionController.ts`.
    - `routes/`: Contains the route definitions for the API, e.g., `candidateRoutes.ts`, `positionRoutes.ts`.
    - `tests/`: Contains test files.
  - `prisma/`: Contains the Prisma schema file for ORM.
  - `tsconfig.json`: TypeScript configuration file.
- `frontend/`: Contains the client-side code written in React.
  - `src/`: Contains the source code for the frontend.
  - `public/`: Contains static files such as the HTML file and images.
  - `build/`: Contains the production-ready build of the frontend.
- `.env`: Contains the environment variables.
- `docker-compose.yml`: Contains the Docker Compose configuration to manage your application's services.
- `README.md`: This file contains information about the project and instructions on how to run it.

## Project Structure

The project is divided into two main directories: `frontend` and `backend`.

### Frontend

The frontend is a React application, and its main files are located in the src directory. The public directory contains static assets, and the build directory contains the production build of the application.

### Backend

The backend is an Express application written in TypeScript. The src directory contains the source code, divided into several subdirectories:

- `application`: Contains the application logic.
- `domain`: Contains the domain models.
- `infrastructure`: Contains code related to the infrastructure.
- `presentation`: Contains code related to the presentation layer (controllers).
  - `controllers/`: Main business logic for API endpoints.
- `routes`: Contains the application routes.
  - `candidateRoutes.ts`, `positionRoutes.ts`: Route files for each resource.
- `tests`: Contains the application tests.

The `prisma` directory contains the Prisma schema.

## API Endpoints

### Candidates

- **POST /candidates**: Create a new candidate.
- **GET /candidates/:id**: Get candidate by ID.
- **PUT /candidates/:id/stage**: Update the current interview step for a candidate's application to a specific position.

  **Request body:**
  ```json
  {
    "positionId": 1,
    "currentInterviewStep": 2
  }
  ```
  **Example (curl):**
  ```bash
  curl -X PUT http://localhost:3010/candidates/1/stage \
    -H "Content-Type: application/json" \
    -d '{"positionId": 1, "currentInterviewStep": 2}'
  ```

### Positions

- **GET /positions/:id/candidates**: Get all candidates associated with a specific position. For each candidate, returns:
  - Full name
  - currentInterviewStep
  - Average interview score (across all interviews for their application)

  **Example (curl):**
  ```bash
  curl http://localhost:3010/positions/1/candidates
  ```
  **Example response:**
  ```json
  {
    "candidates": [
      {"fullName": "John Doe", "currentInterviewStep": 2, "averageScore": 5},
      {"fullName": "Jane Smith", "currentInterviewStep": 2, "averageScore": 4},
      {"fullName": "Carlos García", "currentInterviewStep": 1, "averageScore": null}
    ]
  }
  ```

## Database Reset and Seeding

To reset and repopulate the database with test data:

```bash
cd backend
npx prisma migrate reset --force
npx tsc prisma/seed.ts --outDir prisma/
node prisma/seed.js
```

## Troubleshooting

- If you see `Connection refused` when testing endpoints, ensure the backend is running:
  ```bash
  cd backend
  npx ts-node src/index.ts
  ```
  Wait for the message: `Server is running at http://localhost:3010`
- If you get unique constraint errors when seeding, reset the database as shown above.
- If Docker is not running, start it with:
  ```bash
  sudo systemctl start docker
  ```
- If you have port conflicts, ensure only one PostgreSQL instance is running on the required port (default 5432, or 5433 if changed).

## Example Usage

- **Get candidates for a position:**
  ```bash
  curl http://localhost:3010/positions/1/candidates
  ```
- **Update candidate's interview step:**
  ```bash
  curl -X PUT http://localhost:3010/candidates/1/stage \
    -H "Content-Type: application/json" \
    -d '{"positionId": 1, "currentInterviewStep": 2}'
  ```

---

# LTI - Sistema de Seguimiento de Talento | ES

(La sección en español no ha sido modificada)
