# Overview & Environment Setup

## Base Information
* **Base URL:** `http://localhost:8000/api`
* **Content-Type:** `application/json`
* **Accept:** `application/json`

## Global Headers Required
* `Content-Type: application/json`
* `Accept: application/json`
* `Authorization: Bearer <your_token>` *(Required for protected routes)*

## Seeded Accounts (via seeder)

Login with these to test each role:

* **Admin:** `admin@example.com` / `password123`
* **Dentist:** `dentist@example.com` / `password123`
* **Patient:** register a new account via the API, or seed one yourself

## Testing Tools
* **Postman Collection:** [Link to your exported collection or JSON]
* **Database Viewer:** Adminer at `http://localhost:8080` (or CLI via Docker)
