# 01 — Test Strategy

## 1. Scope

The Booking System (dental clinic) consists of:

* **Backend** — Laravel 13 REST API (`http://localhost:8000/api`) with MySQL.
  Role-based access control (Sanctum) across three roles: `admin`, `dentist`, `patient`.
* **Frontend** — React 19 + TypeScript + Vite SPA (`http://localhost:5173`) using
  TanStack Query for server state and React Router for routing.

QA covers **backend API behaviour**, **frontend UI flows**, **security**, and
**automated unit/feature tests**.

## 2. Objectives

* Confirm all user stories/functional requirements are implemented and correct.
* Verify role-based access control prevents unauthorised actions.
* Detect regressions after changes.
* Verify common security controls (auth, input validation, IDOR, privilege escalation).
* Ensure a stable baseline via automated tests plus documented manual checks.

## 3. Test Levels

| Level | Tool / Approach | Where |
|-------|-----------------|-------|
| Unit (frontend) | Vitest + Testing Library + jsdom | `frontend/src/**/__tests__/*.test.ts` |
| Feature/Integration (backend) | PHPUnit (Laravel `php artisan test`) | `backend/tests/Feature/*Test.php` |
| API (manual) | Postman collection | `postman/Booking-System.postman_collection.json` |
| End-to-end (manual UI) | Browser against `:5173` | documented in `04-happy-path.md` |
| Security (API) | Manual adversarial checks | `06-penetration.md` |

## 4. Test Environments

| Environment | Backend DB | Notes |
|-------------|-----------|-------|
| Local (Docker) | MySQL (`booking_db`) on `:3306` | `docker compose up`, backend on `:8000` |
| Local (non-Docker) | SQLite (`database/database.sqlite`) | from `.env` default |

Automated backend tests run inside the Docker container because the local PHP
install lacks the `pdo_sqlite` driver:

```bash
docker compose exec -T backend php artisan test
```

## 5. Test Data

Seed via `pnpm php:seed`. Provides:

* `admin@example.com` / `password123` (role `admin`)
* `dentist@example.com` / `password123` (role `dentist`)
* `patient@example.com` / `password123` (role `patient`)
* 10 demo `services`, plus 5 `pending` appointments for the seeded patient.

## 6. Entry / Exit Criteria

**Entry:** stack running, DB migrated & seeded, code builds (`pnpm build`),
typechecks (`pnpm typecheck`), lints clean (`pnpm lint`).

**Exit:** all `P0`/`P1` tests pass, backend suite green (48 tests), frontend suite
green (11 tests), no open `P0` defects.

## 7. Roles & Responsibilities

* **Developer** — fixes defects, keeps automated suites green.
* **QA** — executes manual scenarios, documents traces & results (`08-test-traces.md`).
* **Security reviewer** — signs off on `06-penetration.md`.
