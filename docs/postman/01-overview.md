# Overview & Environment Setup

## Base Information
* **Base URL:** `http://localhost:8000/api`
* **Content-Type:** `application/json`
* **Accept:** `application/json`

## Global Headers Required
* `Content-Type: application/json`
* `Accept: application/json`
* `Authorization: Bearer <your_token>` *(Required for protected routes)*

## Postman Setup

1. Create a Postman Environment with variables:
   - `base_url` = `http://localhost:8000/api`
   - `token` = *(blank, updated after login)*
2. Call `POST /register` or `POST /login`, copy the returned `token`.
3. Set `token` to that value, and use `Authorization: Bearer {{token}}` on protected routes.

## Seeded Accounts (via seeder)

Login with these to test each role (all passwords are `password123`):

| Role | Email | Name |
|------|-------|------|
| Admin | `admin@example.com` | System Admin |
| Dentist | `dentist1@example.com` | Dentist 1 |
| Dentist | `dentist2@example.com` | Dentist 2 |
| Dentist | `dentist3@example.com` | Dentist 3 |
| Patient | `patient@example.com` | Juan Dela Cruz |

> Note: there is no `dentist@example.com` account — dentists are `dentist1/2/3@example.com`.
> You can also register additional patients via `POST /register`.

## Testing Tools
* **Postman Collection:** [Link to your exported collection or JSON]
* **Database Viewer:** Adminer at `http://localhost:8080` (or CLI via Docker)
