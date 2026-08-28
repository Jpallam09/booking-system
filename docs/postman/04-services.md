# Guide: Service Module

**Base URL:** `http://localhost:8000/api`

**Headers:**

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
```

## 1. List Services (search + filter)

**GET** `/services`

Optional query params:

```
?search=cleaning&status=active&min_price=1000&max_price=5000
```

Notes:
- Any authenticated user can list services.
- `search` matches partial text in `title` or `description`.
- `status` accepts `active` or `inactive`.
- `min_price` / `max_price` filter by price.
- Results are paginated (10 per page).

## 2. Show Service

**GET** `/services/{id}`

Any authenticated user can view a service.

## 3. Create Service (Admin only)

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
- `title` is required.
- `status` accepts only `active` or `inactive`.

## 4. Update Service (Admin only)

**PUT** `/services/{id}`

```json
{
  "title": "Teeth Cleaning (Premium)",
  "price": 2000.00
}
```

Notes:
- Only users with the `admin` role can update services.
- Accepts the same fields as create; `title` is optional on update (`sometimes`).

## 5. Delete Service (Admin only)

**DELETE** `/services/{id}`

Notes:
- Only users with the `admin` role can delete services.
