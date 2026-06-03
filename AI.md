# AI Usage Disclosure

Built with AI assistance (Cursor Agent). Below follows the structure requested in the assessment.

## AI-assisted parts

- **Backend:** NestJS/MongoDB scaffold, auth module (signup/signin/logout, bcrypt, JWT httpOnly cookies, protected `GET /users/me`), DTO validation, Swagger, logging, exception filter, unit and e2e tests
- **Frontend:** React/Vite/TypeScript scaffold, sign-in/sign-up forms (Zod + React Hook Form), protected route, Easygenerator-themed UI
- **DevOps & docs:** Docker Compose, Fly.io deploy config, GitHub Actions CI/CD, SonarCloud setup, README

## Effective prompts and approaches

- **Attach the PDF and state the stack explicitly:**  
  *“Implement the attached Full Stack Test Task. Frontend: React + Vite + TypeScript. Backend: NestJS + MongoDB. Include signup/signin/app pages, field validation from the PDF, one protected endpoint, README, and AI.md.”*

- **Extend the plan one topic at a time before coding:**  
  *“Add GitHub Actions: lint, test, and build for backend and frontend on push and PR.”*  
  *“Add SonarCloud to CI with sonar-project.properties and a quality gate.”*  
  *“Add Swagger for auth endpoints with httpOnly cookie JWT documented.”*

- **Give UI requests with constraints, not adjectives:**  
  *“Restyle sign-in/sign-up to match easygenerator.com (fonts, colors, logo). Do not change validation, API calls, or routes.”*

- **Describe production bugs with evidence:**  
  *“Login works on localhost but fails on Fly.io: POST /auth/signin returns 200 but no access_token cookie is stored. Frontend: auth-flow-web.fly.dev, API: auth-flow-api.fly.dev.”*  
  *“SonarCloud new-code coverage is 43% (needs 80%). Add tests for backend config modules and adjust sonar-project.properties.”*

## Corrections, rework, and own decisions

- **JWT in httpOnly cookies** (not localStorage) — AI suggested both; chose cookies for XSS safety
- **Production cookies:** `SameSite=None; Secure` — required after deploy because frontend and API are on separate Fly.io domains; `SameSite=Lax` worked locally only
- **TypeScript fixes:** `import type` for Express `Response`; restored missing imports after refactors
- **Sign-in errors:** generic 401 message kept intentionally (no email enumeration)
- **CI/deploy:** GitHub environment names had to match secrets (`FLY`, `SONAR`); Fly deploy tokens were initially wired to the wrong environment
- **SonarCloud:** added config module tests and coverage exclusions so quality gate reflects backend tests only
- **Reviewed and ran** lint, tests, and builds locally before committing; did not ship generated code unchecked
