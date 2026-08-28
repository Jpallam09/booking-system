# 03 — Test Cases

Detailed, actionable test cases. Each references the scenario from `02-test-scenarios.md`.
**Priorities:** P0 critical · P1 high · P2 medium · P3 low.
**Test steps** assume the API at `http://localhost:8000/api` (frontend at `:5173`).

## Authentication (`AUTH`)

### AUTH-01 — Register new account (P1)
1. POST `/api/register` `{"name":"Maria","email":"maria@x.com","password":"secret123","phone":"09170000000"}`.
2. Expect `200`, body `{ message, data: { user }, token }`.
3. Expect the returned `token` works on a protected route.
**Negative:** duplicate email → `422` with validation error.

### AUTH-02 — Login valid (P0)
1. POST `/api/login` `{"email":"patient@example.com","password":"password123"}`.
2. Expect `200` and a non-empty `token`.
3. Frontend: fill login form on `/login`, expect redirect (dashboard or return-to).

### AUTH-03 — Login invalid (P1)
1. POST `/api/login` with wrong password.
2. Expect `401`/`422` and *no* token.

### AUTH-04 — Get current user (P1)
1. GET `/api/user` with `Authorization: Bearer <token>`.
2. Expect the current user object (role, name, email).

### AUTH-05 — Logout (P1)
1. POST `/api/logout` with a valid token.
2. Expect success; subsequent calls with the same token are rejected (P0).

### AUTH-06 — Missing/invalid token (P0)
1. GET `/api/appointments` with no `Authorization` header → `401`.
2. GET with a garbage token → `401`.
3. Frontend: on a `401` the client clears auth and redirects to `/login`.

## Appointments (`APT`)

### APT-01 — Book appointment (P0)
As `patient@example.com`:
1. POST `/api/appointments`
   `{"service_id":1,"appointment_date":"2026-09-01 10:00:00","dental_concern":"Toothache"}`.
2. Expect `201`, appointment with `status = pending`, `patient_id` = current user.

### APT-02 — List own appointments (P0)
1. GET `/api/appointments` as patient.
2. Expect only that patient's appointments, paginated (10/page).

### APT-03 — Role scoping (P0)
1. As `dentist`: GET `/api/appointments` returns only assigned.
2. As `admin`: GET returns all.
3. Cross-check counts differ per role.

### APT-04 — Filters & search (P1)
GET `/api/appointments?status=pending&service_id=1&from=...&to=...&search=tooth`
1. `status` filters by status.
2. `service_id` filters by service.
3. `from`/`to` filter by date range.
4. `search` matches `dental_concern`, patient `name`, and service `title`.

### APT-05 — View detail (P1)
1. GET `/api/appointments/{id}` for an appointment the patient owns → `200`.
2. GET for another patient's appointment → `403`.

### APT-06 — Update own appointment (P1)
1. PUT `/api/appointments/{id}` `{"appointment_date":"2026-09-02 11:00:00","dental_concern":"Updated"}`.
2. Non-owner patient → `403`. Past date → `422`.

### APT-07 — Assign dentist (Admin, P1)
1. POST `/api/appointments/{id}/assign-dentist` `{"dentist_id":2}`.
2. Expect `dentist_id` updated. Non-admin → `403`. Non-dentist target → `422`.

### APT-08 — Confirm (P1)
POST `/api/appointments/{id}/confirm` as assigned dentist or admin → success; else `403`.

### APT-09 — Complete (P1)
POST `/api/appointments/{id}/complete` as assigned dentist or admin → status `completed`.

### APT-10 — Cancel with reason (P0)
POST `/api/appointments/{id}/cancel` `{"cancellation_reason":"Change of plans"}` as
owner patient or admin → status `cancelled`. Missing reason → `422`.

### APT-11 — Delete (Admin, P1)
DELETE `/api/appointments/{id}` as admin → `204`. As non-admin → `403`.

### APT-12 — Non-patient booking rejected (P1)
POST `/api/appointments` as `dentist` → `403`.

### APT-13 — Past-date booking rejected (P1)
POST `/api/appointments` with `appointment_date` in the past → `422`.

## Services (`SRV`)

### SRV-01 — List/filter services (P1)
GET `/api/services?search=cleaning&status=active&min_price=0&max_price=200` → filtered list.

### SRV-02 — View service (P1)
GET `/api/services/{id}` → `200` with service.

### SRV-03 — Create service (Admin, P1)
POST `/api/services` `{"title":"Whitening","description":"...","price":150}` → `201`.

### SRV-04 — Update service (Admin, P1)
PUT `/api/services/{id}` → `200`.

### SRV-05 — Delete service (Admin, P1)
DELETE `/api/services/{id}` → `204`.

### SRV-06 — Non-admin forbidden (P1)
Non-admin POST/PUT/DELETE `/api/services/*` → `403`.

## UI (`UI`)

### UI-01 — Landing hero (P2)
Guest visits `/` → hero with CTA button and services preview.

### UI-02 — Booking dialog from CTA (P2)
Guest clicks CTA → booking dialog opens (reuses `AppointmentBookingForm`).

### UI-03 — Redirect to login when booking (P2)
Anonymous books → redirected to `/login?redirect=/appointments/new`.

### UI-04 — Patient navigation (P2)
Logged-in patient sees dashboard, appointments, services in the layout.

### UI-05 — Role guards (P1)
`/services` requires `patient` or `admin`; `/appointments/new` requires `patient`;
unauthorised roles are redirected.

## Security (`SEC`) — details in `06-penetration.md`
