# 08 — Traceability & Test Traces

Maps functional requirements to the test artefacts. Fill in Status/Results as
tests are executed.

## Requirements ↔ Scenarios ↔ Cases

| # | Requirement | Scenario | Case(s) | Automated |
|---|-------------|----------|---------|-----------|
| REQ-01 | Register account | AUTH-01 | AUTH-01 | Backend AuthTest ✓ |
| REQ-02 | Login / logout | AUTH-02,05 | AUTH-02..05 | Backend AuthTest ✓ |
| REQ-03 | Auth-protected API | AUTH-06 | AUTH-06 | Backend ✓ |
| REQ-04 | Book appointment | APT-01 | APT-01,13 | Backend AppointmentTest ✓ |
| REQ-05 | List own appointments | APT-02,03 | APT-02,03 | Backend AppointmentTest ✓ |
| REQ-06 | Filter/search appointments | APT-04 | APT-04 | Backend AppointmentTest ✓ (search) |
| REQ-07 | View/update own appointment | APT-05,06 | APT-05,06 | Backend ✓ |
| REQ-08 | Assign dentist (admin) | APT-07 | APT-07 | Backend ✓ |
| REQ-09 | Confirm/complete (dentist/admin) | APT-08,09 | APT-08,09 | Backend ✓ |
| REQ-10 | Cancel with reason | APT-10 | APT-10 | Backend ✓ |
| REQ-11 | Delete appointment (admin) | APT-11 | APT-11 | Backend ✓ |
| REQ-12 | Service list/filter | SRV-01,02 | SRV-01,02 | Backend ServiceTest ✓ |
| REQ-13 | Service CRUD (admin) | SRV-03..05 | SRV-03..05 | Backend ServiceTest ✓ |
| REQ-14 | RBAC guards | all SEC | SEC-04..06, APT-05,12 | Backend ✓ |
| REQ-15 | Landing + booking CTA | UI-01..03 | UI-01..03 | Manual |
| REQ-16 | Dashboard/nav/route guards | UI-04,05 | UI-04,05 | Manual |

## Execution Trace Log

Record each run. Example:

| Date | Suite | Result | Notes |
|------|-------|--------|-------|
| 2026-08-28 | Backend `php artisan test` | PASS | xx tests |
| 2026-08-28 | Frontend `pnpm test` | PASS | 11 tests |
| 2026-08-28 | Frontend lint/typecheck/build | PASS | |
| | Manual happy paths (04) | | |
| | Regression (05) | | |
| | Penetration (06) | | |

## Defect Tracker

| ID | Severity | Summary | Linked Case | Status |
|----|----------|---------|-------------|--------|
| DEF-001 | | | | Open/Closed |
