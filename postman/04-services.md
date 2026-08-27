# Guide: Service Module

**Base URL:** `http://localhost:8000/api`

**Headers:**

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
```

## 1. List Services

**GET** `/services`

Any authenticated user can list services.

## 2. Create Service (Admin only)

**POST** `/services`

```json
{
  "title": "Teeth Cleaning",
  "description": "Professional dental cleaning",
  "price": 1500.00,
  "duration_minutes": 45,
  "status": "active"
}
```

Notes:
- Only users with the `admin` role can create services.
- `status` accepts only `active` or `inactive`.
