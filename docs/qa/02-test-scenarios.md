# 02 — Test Scenarios

High-level feature scenarios grouped by module and role. Each scenario is expanded
into concrete cases in `03-test-cases.md`.

## A. Authentication & Accounts (`AUTH`)

| ID | Scenario | Roles |
|----|----------|-------|
| AUTH-01 | User registers a new account successfully | Guest |
| AUTH-02 | User logs in with valid credentials and receives a token | Guest |
| AUTH-03 | User logs in with invalid credentials is rejected | Guest |
| AUTH-04 | User can access their own profile via `GET /user` | Patient |
| AUTH-05 | User logs out and the token is revoked | Patient |
| AUTH-06 | Protected endpoints reject missing/invalid tokens | Guest |

## B. Booking / Appointments (`APT`)

| ID | Scenario | Roles |
|----|----------|-------|
| APT-01 | Patient books a new appointment | Patient |
| APT-02 | Patient views their own appointment list | Patient |
| APT-03 | Patients/roles see only appointments they are allowed to see | All |
| APT-04 | Patient filters & searches appointments | Patient, Admin |
| APT-05 | Patient views an appointment detail | Patient, Admin |
| APT-06 | Patient updates their own appointment | Patient, Admin |
| APT-07 | Admin assigns a dentist to an appointment | Admin |
| APT-08 | Dentist/Admin confirms an appointment | Dentist, Admin |
| APT-09 | Dentist/Admin completes an appointment | Dentist, Admin |
| APT-10 | Patient/Admin cancels an appointment (with reason) | Patient, Admin |
| APT-11 | Admin deletes an appointment | Admin |
| APT-12 | Non-patient attempts to book is rejected | Dentist, Admin |
| APT-13 | Booking with a past date is rejected | Patient |

## C. Services (`SRV`)

| ID | Scenario | Roles |
|----|----------|-------|
| SRV-01 | List services (with search/status/price filters) | Patient, Admin |
| SRV-02 | View a single service | Patient, Admin |
| SRV-03 | Admin creates a new service | Admin |
| SRV-04 | Admin updates a service | Admin |
| SRV-05 | Admin deletes a service | Admin |
| SRV-06 | Non-admin attempts to create/update/delete a service is rejected | Patient, Dentist |

## D. Navigation & Landing (`UI`)

| ID | Scenario | Roles |
|----|----------|-------|
| UI-01 | Guest visits landing page and sees hero + CTA | Guest |
| UI-02 | Guest opens the booking dialog from the hero CTA | Guest |
| UI-03 | Guest is redirected to login when booking requires auth | Guest |
| UI-04 | Authenticated patient can navigate dashboard/appointments/services | Patient |
| UI-05 | Role guards prevent navigating to forbidden routes | All |

## E. Security (`SEC`)

| ID | Scenario | Roles |
|----|----------|-------|
| SEC-01 | Tokens are required on all protected routes | All |
| SEC-02 | Users cannot access another user's appointment (IDOR) | Patient |
| SEC-03 | Non-admin cannot perform admin actions | Patient, Dentist |
| SEC-04 | Input validation rejects malformed payloads | All |
| SEC-05 | No secrets/tokens exposed in API responses | All |
