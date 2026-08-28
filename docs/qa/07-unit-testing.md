# 07 — Automated Unit / Feature Testing

## Backend (Laravel + PHPUnit)

Run inside Docker (local PHP lacks the `pdo_sqlite` driver):

```bash
docker compose exec -T backend php artisan test
# or: pnpm test  (alias)
```

Current backend coverage (all under `backend/tests/Feature/`):

* **AppointmentTest** — booking lifecycle, role scoping, filters, **search**
  (by `dental_concern`, service `title`, patient `name`), assign/confirm/complete/cancel,
  validation, authorisation.
* **AuthTest** — register, login, logout, current user, token requirements.
* **ServiceTest** — CRUD, access control, validation.
* (Plus any other feature/unit tests present in the suite.)

> Total is reported by the test runner. Verify the exact count on your branch
> (the baseline was 48 tests and grows as suites are added).

### Recommended coverage targets
- Auth flows & token revocation: 100%.
- Appointment authorisation matrix (role × action): 100%.
- Service CRUD + guards: 100%.
- Validation rules for each payload: 100%.

## Frontend (Vitest + Testing Library + jsdom)

Run from `frontend/`:

```bash
pnpm test        # vitest run
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint .
pnpm build       # tsc -b && vite build
```

Configuration:
* `frontend/vitest.config.ts` — jsdom environment, `globals: true`, `@` alias,
  setup file `src/test/setup.ts`.
* `src/test/setup.ts` — loads `@testing-library/jest-dom/vitest` and provides an
  in-memory `Storage` implementation (jsdom does not expose `localStorage` for the
  default `about:blank` context, and Node ≥26 has an uninitialized experimental one).

Current frontend unit tests (11 passed):

| File | Covers |
|------|--------|
| `src/lib/__tests__/auth.test.ts` | Token/user storage, clear, malformed JSON, booking draft persistence |
| `src/api/__tests__/client.test.ts` | Axios base URL, Authorization header injection, header preservation |

### Suggested future additions
- `AuthContext` provider behaviour (login/logout side effects) using
  `@testing-library/react` + `user-event`.
- `AppointmentBookingForm` — render, validation, draft restore.
- Filter components (status/service/date) on the appointments list.

## CI notes
Ensure CI runs: backend suite, frontend `lint` + `typecheck` + `build` + `test`.
