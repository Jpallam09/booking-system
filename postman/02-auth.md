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
  "role": "patient",
  "phone": "09123456789"
}
```

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

