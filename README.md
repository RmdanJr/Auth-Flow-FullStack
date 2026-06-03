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

1. Builds Docker images and pushes to **GitHub Container Registry**
2. Redeploys to **Fly.io** / **Vercel** / Render / Railway (whichever secrets you configure)

### Option A — Fly.io + Vercel (free, no credit card for Fly hobby)

Uses MongoDB Atlas (free M0) for the database.

**1. Backend on Fly.io**

```bash
# Install: https://fly.io/docs/flyctl/install/
cd backend
fly auth login
fly apps create auth-flow-api   # or accept name from fly launch
fly secrets set MONGODB_URI="your-atlas-uri" JWT_SECRET="your-secret" FRONTEND_URL="https://YOUR.vercel.app"
fly deploy
```

Copy your API URL (e.g. `https://auth-flow-api.fly.dev`).

**2. Frontend on Vercel**

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import this repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variable: `VITE_API_URL` = `https://auth-flow-api.fly.dev` (your Fly URL).
4. Deploy.

**3. Wire GitHub Actions CD**

Create GitHub **production** environment secrets:

| Secret | Where to get it |
|--------|-----------------|
| `FLY_API_TOKEN` | Fly.io → Account → Access Tokens |
| `VERCEL_TOKEN` | Vercel → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel project → Settings → General |
| `VERCEL_PROJECT_ID` | Vercel project → Settings → General |

Set repository variable `VITE_API_URL` = your Fly backend URL (for Docker/GHCR frontend builds).

Update Fly secret `FRONTEND_URL` to your Vercel URL after frontend is live.

**4. Atlas network access**

MongoDB Atlas → **Network Access** → allow `0.0.0.0/0` (or Fly.io egress IPs).

---

### Option B — Render free services (manual, no Blueprint)

Render **does** have a free tier for individual services (750 hrs/mo, sleeps after 15 min), but Blueprint setup may ask for billing on some accounts. Skip Blueprint and create services manually:

1. **New → Static Site** → repo, root `frontend`, build `npm ci && npm run build`, publish `dist` — **free, no sleep**
2. **New → Web Service** → repo, root `backend`, Docker — plan **Free**
3. Set env vars: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`

[`render.yaml`](render.yaml) is optional reference only.

---

### Option C — Railway

1. [railway.app](https://railway.app) → new project from GitHub repo.
2. Use Atlas for MongoDB (or Railway MongoDB plugin).
3. Add `RAILWAY_TOKEN` + `RAILWAY_SERVICE_ID` to GitHub **production** secrets/variables.

---

### Option D — Pull from GHCR (any VPS)

```bash
docker pull ghcr.io/rmdanjr/auth-flow-backend:latest
docker pull ghcr.io/rmdanjr/auth-flow-frontend:latest
```

### Production environment (GitHub)

| Secret | Platform |
|--------|----------|
| `FLY_API_TOKEN` | Fly.io backend CD |
| `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | Vercel frontend CD |
| `RENDER_BACKEND_DEPLOY_HOOK`, `RENDER_FRONTEND_DEPLOY_HOOK` | Render hooks |
| `RAILWAY_TOKEN` | Railway |

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Backend URL for frontend Docker builds |
| `RAILWAY_SERVICE_ID` | Railway service to redeploy |

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
