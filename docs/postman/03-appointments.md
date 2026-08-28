# Guide: Appointment Module

**Base URL:** `http://localhost:8000/api`

**Headers:**

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>
```

## 1. List Appointments (role-scoped)

**GET** `/appointments`

Optional query params:

```
?status=pending&service_id=1&from=2026-09-01&to=2026-09-30
```

Notes:
- `patient` sees only their own appointments.
- `dentist` sees only appointments assigned to them.
- `admin` sees all appointments.
- `status` accepts `pending`, `confirmed`, `completed`, `cancelled`.
- Results are paginated (10 per page).

## 2. Book Appointment (Patient only)

**POST** `/appointments`

```json
{
  "service_id": 1,
  "appointment_date": "2026-09-01 10:00:00",
  "dental_concern": "Toothache on lower right molar"
}
```

Notes:
- `service_id` is required and must exist.
- `appointment_date` is required and must be in the future.
- Only users with the `patient` role can book.

## 3. Show Appointment

**GET** `/appointments/{id}`

Notes:
- `patient` can only view their own.
- `dentist` can only view appointments assigned to them.
- `admin` can view any.

## 4. Update Appointment

**PUT** `/appointments/{id}`

```json
{
  "appointment_date": "2026-09-02 11:00:00",
  "dental_concern": "Updated concern"
}
```

Notes:
- Only the owning `patient` or an `admin` can update.
- `appointment_date` must be in the future.

## 5. Delete Appointment (Admin only)

**DELETE** `/appointments/{id}`

Notes:
- Only `admin` can delete.

## 6. Assign Dentist (Admin only)

**POST** `/appointments/{id}/assign-dentist`

```json
{
  "dentist_id": 2
}
```

Notes:
- Only `admin` can assign.
- `dentist_id` must reference a user with the `dentist` role.

## 7. Confirm Appointment

**POST** `/appointments/{id}/confirm`

Notes:
- Allowed for `admin` or the `dentist` assigned to the appointment.

## 8. Complete Appointment

**POST** `/appointments/{id}/complete`

Notes:
- Allowed for `admin` or the `dentist` assigned to the appointment.

## 9. Cancel Appointment

**POST** `/appointments/{id}/cancel`

```json
{
  "cancellation_reason": "Change of plans"
}
```

Notes:
- Allowed for the owning `patient` or an `admin`.
- `cancellation_reason` is required.
