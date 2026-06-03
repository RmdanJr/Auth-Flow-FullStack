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

GitHub Actions runs on push to `main` and on all pull requests:

- **backend** — lint, unit tests, e2e tests
- **frontend** — lint, build
- **sonarcloud** — SonarCloud analysis + quality gate (requires `SONAR_TOKEN`)

![CI](https://github.com/RmdanJr/Auth-Flow-FullStack/actions/workflows/ci.yml/badge.svg)

## Deployment (automatic CD)

After CI passes on `main`, the **Deploy** workflow runs automatically:

1. Builds Docker images for backend + frontend
2. Pushes them to **GitHub Container Registry** (`ghcr.io`)
3. Triggers redeploy on **Render** or **Railway** (if configured)

### Option A — Render (recommended, free tier)

1. Create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster and copy the connection string.
2. Go to [Render Blueprints](https://dashboard.render.com/blueprints) → **New Blueprint Instance**.
3. Connect this GitHub repo — Render reads [`render.yaml`](render.yaml) and creates:
   - `auth-flow-api` — NestJS backend (Docker)
   - `auth-flow-web` — React frontend (static site)
4. When prompted, set `MONGODB_URI` to your Atlas connection string.
5. Render auto-deploys on every push to `main`.

Optional: add **Deploy Hook** URLs as GitHub secrets (`RENDER_BACKEND_DEPLOY_HOOK`, `RENDER_FRONTEND_DEPLOY_HOOK`) in the **production** environment for instant redeploy from the Deploy workflow.

### Option B — Railway

1. Create a [Railway](https://railway.app) project from this repo.
2. Add a **MongoDB** plugin and wire `MONGODB_URI` to the backend service.
3. Add GitHub secrets to the **production** environment:
   - `RAILWAY_TOKEN` — from Railway account settings
4. Add repository variable `RAILWAY_SERVICE_ID` (backend service ID).
5. Push to `main` — Deploy workflow redeploys via Railway CLI.

### Option C — Any Docker host

Pull and run images from GHCR after each deploy:

```bash
docker pull ghcr.io/rmdanjr/auth-flow-backend:latest
docker pull ghcr.io/rmdanjr/auth-flow-frontend:latest
```

Set `VITE_API_URL` repository variable (Settings → Variables) so the frontend image bakes in the correct API URL at build time.

### Production environment (GitHub)

Create **Settings → Environments → production** with optional secrets:

| Secret | Used for |
|--------|----------|
| `RENDER_BACKEND_DEPLOY_HOOK` | Render backend redeploy |
| `RENDER_FRONTEND_DEPLOY_HOOK` | Render frontend redeploy |
| `RAILWAY_TOKEN` | Railway redeploy |

| Variable | Used for |
|----------|----------|
| `VITE_API_URL` | Frontend Docker build (e.g. `https://auth-flow-api.onrender.com`) |
| `RAILWAY_SERVICE_ID` | Railway service to deploy |

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
│   ├── ci.yml          # Test + SonarCloud
│   └── deploy.yml      # CD after CI on main
├── render.yaml         # Render Blueprint (auto-deploy)
└── sonar-project.properties
```

## License

MIT
