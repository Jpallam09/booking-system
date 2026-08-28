# 06 — Penetration / Security Testing

Security cases to run manually against the API (via Postman/curl) and the UI.
**Do not run destructive exploits against production data.**

## 1. Authentication & Token Handling

### SEC-01 Token required (P0)
* Send `GET /api/appointments` with no token → expect `401`.
* Send with `Authorization: Bearer invalid-token` → expect `401`.

### SEC-02 Logout revocation (P0)
* Login, then `POST /api/logout`. Reuse the same token → expect `401` (token revoked by Sanctum).

### SEC-03 Weak password policy (P2)
* Register with a very short password → expect `422` (validation).

## 2. Authorisation / Privilege Escalation

### SEC-04 Role escalation (P0)
* As a `patient`, POST `/api/services` (create) → expect `403`.
* As a `dentist`, POST `/api/appointments` (book) → expect `403`.
* As `patient`/`dentist`, DELETE `/api/appointments/{id}` → expect `403`.

### SEC-05 IDOR — cross-resource access (P0)
* As patient A, GET `PUT / DELETE /confirm /complete /cancel` on patient B's appointment → expect `403` (patient) or role allowance.
* As a dentist not assigned to the appointment, `confirm`/`complete` it → expect `403`.

### SEC-06 Assign-dentist abuse (P1)
* As non-admin, `POST /appointments/{id}/assign-dentist` → `403`.
* As admin, assign a non-dentist `dentist_id` → expect `422`/`400`.

## 3. Input Validation & Injection

### SEC-07 SQL injection (P1)
* Send `?search=' OR '1'='1` and `?search=1' UNION SELECT ...` to list endpoints.
* Expect no error leakage and results limited to legitimate matches (Laravel/Query Builder uses parameter binding).

### SEC-08 XSS via stored fields (P2)
* Frontend: create a service/appointment with `<script>alert(1)</script>` in title/concern.
* Verify React escapes output; no script executes.

### SEC-09 Mass assignment / unexpected fields (P2)
* POST `/api/appointments` including `role` or `id` fields → expect these to be ignored (guarded/`fillable`-restricted).

### SEC-10 Past-date & invalid datetime (P1)
* Send malformed/`z`-date `appointment_date` → expect `422`, not `500`.

### SEC-11 Oversized input (P3)
* Send very long strings → validation truncates/rejects gracefully.

## 4. Information Disclosure

### SEC-12 Error messages (P1)
* Trigger validation vs. unexpected errors → ensure `422` messages are controlled; no stack traces/`debug` exposure in production.

### SEC-13 Response leakage (P1)
* Inspect login/register/user responses → only expected user fields + token; no password/hash or other users' data.

### SEC-14 Header exposure (P3)
* Confirm sensible headers; CORS `config/cors.php` restricted to the frontend origin, not `*` in production.

## 5. Session / Transport (P2)

### SEC-15 Token in logs (P2)
* Confirm tokens are not logged.

### SEC-16 SQLite fallback note (P2)
* Non-Docker local uses SQLite; ensure production uses MySQL.

## Sign-off

| Case | Status (PASS/FAIL) | Tester | Date |
|------|--------------------|--------|------|
| SEC-01 — 07 | | | |
| SEC-08 — 11 | | | |
| SEC-12 — 16 | | | |
