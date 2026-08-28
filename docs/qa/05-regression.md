# 05 — Regression Suite

Use after any change to core auth, appointments, services, or routing. Mark
**PASS/FAIL** for each. Automated backend + frontend suites cover the green rows;
the rest are manual.

## Automated Regression (run these first)

```bash
# Backend (in Docker)
pnpm test

# Frontend
cd frontend && pnpm build && pnpm typecheck && pnpm lint && pnpm test
```

| Check | Result |
|-------|--------|
| Backend suite passes (48 tests) | ☐ |
| Frontend build + typecheck pass | ☐ |
| Frontend lint clean | ☐ |
| Frontend unit tests pass (11 tests) | ☐ |

## Manual Regression

| ID | Check | Expected | Result |
|----|-------|----------|--------|
| R-01 | Register new account | Success + usable token | ☐ |
| R-02 | Login valid / invalid | 200 / 401 | ☐ |
| R-03 | Logout revokes token | Subsequent call → 401 | ☐ |
| R-04 | Patient books appointment | `pending` created | ☐ |
| R-05 | Patient books past date | Rejected (422) | ☐ |
| R-06 | Role-scoped appointment lists | Correct per role | ☐ |
| R-07 | Search/filter appointments | Correct subset | ☐ |
| R-08 | Assign dentist (admin) | Dentist set | ☐ |
| R-09 | Confirm/complete (dentist/admin) | Status updates | ☐ |
| R-10 | Cancel with reason | Status `cancelled` | ☐ |
| R-11 | Admin CRUD services | Create/update/delete | ☐ |
| R-12 | Non-admin service write | 403 | ☐ |
| R-13 | IDOR: patient reads another's appt | 403 | ☐ |
| R-14 | Missing token on protected route | 401 | ☐ |
| R-15 | Landing page loads for guests | Hero + CTA visible | ☐ |
| R-16 | Hero CTA opens booking dialog | Dialog shown | ☐ |
| R-17 | Role-guarded routes redirect | Correct behaviour | ☐ |

## Checklist Before Release

- [ ] No `P0`/`P1` open defects.
- [ ] All automated tests green.
- [ ] All manual `R-*` checks pass.
- [ ] Security review accepted (`06-penetration.md`).
