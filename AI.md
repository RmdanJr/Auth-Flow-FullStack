# AI Usage Disclosure

This project was built with AI assistance (Cursor Agent). Below is an honest account of what was AI-assisted, what worked, and what required manual correction.

## AI-assisted areas

| Area | AI contribution |
|------|-----------------|
| Project scaffolding | NestJS and Vite project structure, module layout |
| Auth logic | JWT cookie flow, bcrypt hashing, Passport strategy |
| Validation | DTO class-validator rules and matching Zod schemas |
| Swagger | OpenAPI decorators and cookie auth documentation |
| Frontend UI | Tailwind layout, form components, protected routes |
| Docker | Compose file, multi-stage Dockerfiles, nginx config |
| Tests | AuthService unit tests, Supertest e2e flow |
| CI/CD | GitHub Actions workflow with MongoDB service container |
| SonarCloud | `sonar-project.properties` configuration |
| Documentation | README structure and setup instructions |

## Effective prompts

- Providing the full PDF task spec upfront gave accurate requirements coverage.
- Iterating on the plan (CI/CD, SonarCloud, Swagger, Docker Compose, branch protection) before implementation avoided rework.
- "Commit each step with messages under 50 chars" produced a clean git history.

## Manual corrections and decisions

- **Cookie-based JWT** instead of localStorage — AI suggested both; chose cookies for XSS safety.
- **TypeScript `import type` for Express Response** — required fix for NestJS decorator metadata with `isolatedModules`.
- **`ArgumentsHost` import** — restored after a refactor dropped it from the Mongo exception filter.
- **Signup HTTP 201** — ensured e2e tests match NestJS default POST status code.
- **SonarCloud placeholders** — `your-sonarcloud-org` / `your-sonarcloud-project-key` must be replaced after repo import.
- **Branch protection** — documented in README; must be enabled manually in GitHub settings after first CI run.
- **Generic 401 on signin** — kept intentionally to avoid email enumeration.

## What I owned

- Reviewed all generated auth and security code before committing.
- Verified builds, unit tests, and e2e tests pass locally.
- Chose monorepo layout and implementation order from the plan.
