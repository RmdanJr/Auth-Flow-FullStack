# Auth Flow Fullstack

[![CI](https://github.com/RmdanJr/Auth-Flow-FullStack/actions/workflows/ci.yml/badge.svg)](https://github.com/RmdanJr/Auth-Flow-FullStack/actions/workflows/ci.yml)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=RmdanJr_Auth-Flow-FullStack&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=RmdanJr_Auth-Flow-FullStack)

Full-stack authentication system with signup, sign-in, and a protected workspace.

**Tech stack**

- **Frontend:** TypeScript, React, Vite, Tailwind CSS, React Router, React Hook Form, Zod, Axios
- **Backend:** NestJS, MongoDB, Mongoose, Passport JWT, bcrypt, class-validator, Swagger
- **Auth:** JWT in httpOnly cookies
- **Testing:** Jest, Supertest
- **Tooling:** Docker, Docker Compose, GitHub Actions, SonarCloud, Fly.io, nginx

## Live

Live deployment of the project on Fly.io:

| | URL |
|---|-----|
| **Web app** | https://auth-flow-web.fly.dev |
| **API** | https://auth-flow-api.fly.dev |
| **Swagger** | https://auth-flow-api.fly.dev/api/docs |

## Quick start

Run the following commands to start the project locally:

```bash
cp .env.example .env
docker compose up --build
```

- Web: http://localhost:5173  
- API: http://localhost:3000  
- Swagger: http://localhost:3000/api/docs  

## Project Structure

```
.
├── backend/     NestJS API
├── frontend/    React + Vite
├── docker-compose.yml  Docker Compose file for local development
├── AI.md        AI usage disclosure (required by assessment)
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/signup` | — | Register |
| POST | `/auth/signin` | — | Sign in (sets httpOnly cookie) |
| POST | `/auth/logout` | — | Clear cookie |
| GET | `/users/me` | Cookie | Current user |

## Lint & Test

```bash
cd backend && npm run test && npm run test:e2e
cd frontend && npm run lint && npm run build
```

## License

MIT
