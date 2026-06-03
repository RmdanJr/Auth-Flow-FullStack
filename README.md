# Auth Flow Fullstack

Full-stack authentication demo: React + TypeScript frontend, NestJS + MongoDB backend, JWT httpOnly cookies, Swagger docs, Docker Compose, CI/CD, and SonarCloud.

## Quick start (Docker Compose)

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger UI: http://localhost:3000/api/docs

## Local development

```bash
# Start MongoDB only
docker compose up mongodb -d

# Backend
cd backend
cp .env.example .env
npm install
npm run start:dev

# Frontend (separate terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `1d`) |
| `FRONTEND_URL` | CORS origin (e.g. `http://localhost:5173`) |
| `VITE_API_URL` | Backend URL for frontend |
| `PORT` | Backend port (default `3000`) |

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/signup` | Public | Register new user |
| POST | `/auth/signin` | Public | Sign in |
| POST | `/auth/logout` | Public | Clear auth cookie |
| GET | `/users/me` | Cookie JWT | Current user profile |

## Tests

```bash
cd backend
npm run test          # unit tests
npm run test:cov      # with coverage
npm run test:e2e      # e2e (requires MongoDB)

cd frontend
npm run lint
npm run build
```

## CI/CD

GitHub Actions runs on push to `main` and on pull requests:

- **backend** — lint, unit tests, e2e tests
- **frontend** — lint, build
- **sonarcloud** — static analysis + quality gate

![CI](https://github.com/YOUR_USER/auth-flow-fullstack/actions/workflows/ci.yml/badge.svg)

## SonarCloud

1. Import the repo at [sonarcloud.io](https://sonarcloud.io)
2. Update `sonar.organization` and `sonar.projectKey` in `sonar-project.properties`
3. Add `SONAR_TOKEN` as a GitHub repository secret

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=YOUR_PROJECT_KEY&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=YOUR_PROJECT_KEY)

## Branch protection

After CI runs once, configure **Settings → Branches → main**:

- Require pull request before merging
- Require status checks: `backend`, `frontend`, `sonarcloud`
- Require branches to be up to date

Optional CLI setup:

```bash
gh api repos/{owner}/{repo}/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field required_status_checks[checks][][context]=backend \
  --field required_status_checks[checks][][context]=frontend \
  --field required_status_checks[checks][][context]=sonarcloud \
  --field enforce_admins=true \
  --field required_pull_request_reviews[required_approving_review_count]=0 \
  --field restrictions=null
```

## Project structure

```
auth-flow-fullstack/
├── backend/          NestJS API
├── frontend/         React + Vite app
├── docker-compose.yml
├── .github/workflows/ci.yml
└── sonar-project.properties
```

## License

MIT
