# QA Documentation — Booking System

This folder contains the Quality Assurance documentation for the Booking System
(dental-clinic appointment booking: React + TypeScript frontend, Laravel REST API
backend, MySQL database).

## Document Index

| # | File | Purpose |
|---|------|---------|
| 00 | [`00-README.md`](00-README.md) | Landing page / index for the QA docs (this file) |
| 01 | [`01-test-strategy.md`](01-test-strategy.md) | Overall QA approach, scope, tools, environments |
| 02 | [`02-test-scenarios.md`](02-test-scenarios.md) | High-level (feature) test scenarios by module & role |
| 03 | [`03-test-cases.md`](03-test-cases.md) | Detailed, actionable test cases (happy, negative, edge) |
| 04 | [`04-happy-path.md`](04-happy-path.md) | End-to-end happy-path walkthroughs per role |
| 05 | [`05-regression.md`](05-regression.md) | Regression test suite & checklist |
| 06 | [`06-penetration.md`](06-penetration.md) | Security / penetration test cases |
| 07 | [`07-unit-testing.md`](07-unit-testing.md) | Unit/feature test inventory (backend + frontend) |
| 08 | [`08-test-traces.md`](08-test-traces.md) | Traceable requirement ↔ test mapping, traces & results |

## Quick References

* **API base URL:** `http://localhost:8000/api`
* **Frontend URL:** `http://localhost:5173`
* **Seeded admin:** `admin@example.com` / `password123`
* **Seeded dentist:** `dentist@example.com` / `password123`
* **Seeded patient:** `patient@example.com` / `password123`
* **Backend tests** (run inside Docker):
  `docker compose exec -T backend php artisan test`
* **Frontend tests:** `pnpm test` (from `frontend/`)
* **Postman collection:** `docs/postman/Booking-System.postman_collection.json`

## Conventions Used

* Test IDs follow the pattern `<Module>-<Number>`, e.g. `AUTH-01`, `APT-04`, `SRV-02`.
* Test **priority**: `P0` (critical), `P1` (high), `P2` (medium), `P3` (low).
* Roles: **Admin**, **Dentist**, **Patient**, **Guest** (unauthenticated).
* Status values used by the API: `pending`, `confirmed`, `completed`, `cancelled`.

## How to Run

1. Start the stack: `pnpm docker:up` (MySQL + backend) then `pnpm dev` (frontend).
2. Seed the database: `pnpm php:seed`.
3. Backend automated tests: `pnpm test` (alias of `php:test` → `docker compose exec -T backend php artisan test`).
4. Frontend automated tests: `cd frontend && pnpm test`.
5. Manual API testing: import `docs/postman/Booking-System.postman_collection.json` into Postman.
