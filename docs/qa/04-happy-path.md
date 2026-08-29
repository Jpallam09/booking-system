# 04 — Happy Path Walkthroughs

End-to-end, from the browser against the running stack. Seed the DB first (`pnpm php:seed`).

Prerequisites: `pnpm docker:up` (MySQL + backend on `:8000`) and `pnpm dev`
(frontend on `:5173`).

## 1. Admin happy path

1. Open `http://localhost:5173/login`, sign in as `admin@example.com` / `password123`.
2. Land on the dashboard; verify stats render.
3. Go to **Services** → create a new service (title, description, price) via the
   "New Service" dialog → it appears in the list.
4. Go to **Appointments** → the list shows all appointments (admin scope).
   Use the search box to find one by patient/service/concern.
5. Open an appointment → **Assign dentist** (enter a dentist ID, e.g. `2`) →
   status stays pending, dentist assigned.
6. **Confirm** the appointment → status `confirmed`.
7. **Complete** the appointment → status `completed`.

## 2. Patient happy path

1. Register a new account (`/register`) or log in as `patient@example.com`.
2. On `/`, click the hero **Book an appointment** CTA.
3. In the dialog choose a service, pick a future date/time, add a concern → submit.
4. Redirected to **My Appointments** → the new appointment shows as `pending`.
5. From the list, use filters (status/date) and search to locate an appointment.
6. Open the detail page → if still `pending`, **Cancel** (enter a reason) →
   status `cancelled`.
7. Re-book a service that an admin keeps as `pending`, then have an admin/dentist
   **confirm** it; patient sees the updated status.

## 3. Dentist happy path

1. Log in as `dentist1@example.com` / `password123` (Dentist 1).
2. **Appointments** shows only appointments assigned to the dentist.
3. Open one → **Confirm** → **Complete**.
4. Verify the detail page reflects the new statuses.

## 4. Guest happy path

1. Visit `/` without logging in → landing page with hero + services preview.
2. Click the book CTA → booking dialog opens.
3. Submitting booking (or trying to reach `/appointments/new`) redirects to
   `/login?redirect=/appointments/new`; after login the user is returned.
