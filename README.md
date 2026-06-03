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

## SonarCloud setup (required for CI)

CI always runs a **sonarcloud** job. Configure once before pushing:

1. Sign in at [sonarcloud.io](https://sonarcloud.io) with GitHub.
2. **Analyze new project** → select this repository → **With GitHub Actions**.
3. Copy **organization key** and **project key** into `sonar-project.properties`:
   ```properties
   sonar.organization=rmdanjr
   sonar.projectKey=RmdanJr_Auth-Flow-FullStack
   ```
4. In SonarCloud: **My Account → Security → Generate Token**.
5. On GitHub: repo **Settings → Environments → SONAR → Environment secrets** → add `SONAR_TOKEN` (use a secret, not a variable).

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=RmdanJr_Auth-Flow-FullStack&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=RmdanJr_Auth-Flow-FullStack)

## CI/CD

GitHub Actions runs on every push to `main` and on all pull requests:

- **backend** — lint, unit tests, e2e tests
- **frontend** — lint, build
- **sonarcloud** — SonarCloud analysis + quality gate (requires `SONAR_TOKEN`)
- **deploy-backend** — push to `main` only: GHCR image + Fly.io (`auth-flow-api`)
- **deploy-frontend** — push to `main` only: GHCR image + Fly.io (`auth-flow-web`) + backend CORS sync

![CI](https://github.com/RmdanJr/Auth-Flow-FullStack/actions/workflows/ci.yml/badge.svg)

## Deployment (Fly.io)

Uses MongoDB Atlas (free M0) for the database. Both apps run on Fly.io.

| App | URL |
|-----|-----|
| Backend (`auth-flow-api`) | https://auth-flow-api.fly.dev |
| Frontend (`auth-flow-web`) | https://auth-flow-web.fly.dev |

**Manual first-time setup**

```bash
# Backend
cd backend
fly auth login
fly apps create auth-flow-api
fly secrets set MONGODB_URI="your-atlas-uri" JWT_SECRET="your-secret" FRONTEND_URL="https://auth-flow-web.fly.dev"
fly deploy

# Frontend
cd frontend
fly apps create auth-flow-web
fly deploy --build-arg VITE_API_URL=https://auth-flow-api.fly.dev
```

**GitHub Actions CD**

Add these to **Settings → Environments → production → Environment secrets**:

| Secret | Fly app | Where to get it |
|--------|---------|-----------------|
| `FLY_API_TOKEN_API` | `auth-flow-api` | Fly.io → **auth-flow-api** → Tokens → Deploy token |
| `FLY_API_TOKEN_WEB` | `auth-flow-web` | Fly.io → **auth-flow-web** → Tokens → Deploy token |

Every push to `main` runs tests, SonarCloud, then deploys both Fly apps automatically.

**Atlas network access**

MongoDB Atlas → **Network Access** → allow `0.0.0.0/0` (or Fly.io egress IPs).

### Pull from GHCR (optional)

```bash
docker pull ghcr.io/rmdanjr/auth-flow-backend:latest
docker pull ghcr.io/rmdanjr/auth-flow-frontend:latest
```

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
├── .github/workflows/
│   └── ci.yml            # Test, SonarCloud, deploy to Fly on push to main
├── render.yaml         # Render Blueprint (auto-deploy)
└── sonar-project.properties
```

## License

MIT
