# Guide: Appointment Module

**Base URL:** `http://localhost:8000/api`

**Headers:**

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
```

## 1. Book Appointment (Patient only)

**POST** `/appointments`

```json
{
  "service_id": 1,
  "appointment_date": "2026-09-01 10:00:00",
  "dental_concern": "Toothache on lower right molar"
}
```

Notes:
- Requires a valid, future `appointment_date`.
- Only users with the `patient` role can book.

## 2. List Appointments (role-scoped)

**GET** `/appointments`

Optional query params:

```
?status=pending
```

Notes:
- `patient` sees only their own appointments.
- `dentist` sees appointments assigned to them.
- `admin` sees all appointments.
