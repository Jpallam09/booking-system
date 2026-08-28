# Guide: Authentication Module

**Base URL:** `http://localhost:8000/api`

**Headers:**

```http
Content-Type: application/json
Accept: application/json
```

## 1. Register User

**POST** `/register`

```json
{
  "name": "Juan Dela Cruz",
  "email": "juandelacruz@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "09123456789"
}
```

Notes:
- Account created is always `patient` role (role cannot be set via API).
- Use the seeded admin/dentist accounts (see `01-overview.md`) to test other roles.

## 2. Login User

**POST** `/login`

```json
{
  "email": "juandelacruz@example.com",
  "password": "password123"
}
```

## 3. Logout User

**POST** `/logout`

```http
Authorization: Bearer <token>
```

