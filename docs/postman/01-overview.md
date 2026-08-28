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

Login with these to test each role:

* **Admin:** `admin@example.com` / `password123`
* **Dentist:** `dentist@example.com` / `password123`
* **Patient:** register a new account via the API, or seed one yourself

## Testing Tools
* **Postman Collection:** [Link to your exported collection or JSON]
* **Database Viewer:** Adminer at `http://localhost:8080` (or CLI via Docker)
