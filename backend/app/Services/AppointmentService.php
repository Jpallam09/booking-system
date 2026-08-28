<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Enums\UserRole;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\Auth;

class AppointmentService
{
    public function getFilteredAppointments(array $filters)
    {
        $user = Auth::user();
        $query = Appointment::with(['patient', 'dentist', 'service']);

        // Role-based scoping
        if ($user->role === UserRole::Patient) {
            $query->where('patient_id', $user->id);
        } elseif ($user->role === UserRole::Dentist) {
            $query->where('dentist_id', $user->id);
        }

        // Admins see everything

        if (!empty($filters['status']) && in_array($filters['status'], ['pending', 'confirmed', 'completed', 'cancelled'], true)) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['service_id']) && is_numeric($filters['service_id'])) {
            $query->where('service_id', $filters['service_id']);
        }

        if (!empty($filters['search'])) {
            $term = $filters['search'];
            $query->where(function ($q) use ($term) {
                $q->whereLike('dental_concern', "%{$term}%")
                  ->orWhereHas('patient', fn ($pq) => $pq->whereLike('name', "%{$term}%"))
                  ->orWhereHas('service', fn ($sq) => $sq->whereLike('title', "%{$term}%"));
            });
        }

        if (!empty($filters['from'])) {
            $query->where('appointment_date', '>=', $filters['from']);
        }

        if (!empty($filters['to'])) {
            $query->where('appointment_date', '<=', $filters['to']);
        }

        return $query->latest()->paginate(10);
    }

    public function getAppointment(int $id, User $user): Appointment
    {
        $appointment = Appointment::with(['patient', 'dentist', 'service'])->findOrFail($id);

        $this->ensureCanView($appointment, $user);

        return $appointment;
    }

    public function createAppointment(array $data, User $user): Appointment
    {
        if ($user->role !== UserRole::Patient) {
            throw new AuthorizationException('Only patients can book appointments.');
        }

        return Appointment::create([
            'patient_id' => $user->id,
            'service_id' => $data['service_id'],
            'appointment_date' => $data['appointment_date'],
            'dental_concern' => $data['dental_concern'] ?? null,
            'status' => AppointmentStatus::Pending,
        ]);
    }

    public function updateAppointment(Appointment $appointment, array $data, User $user): Appointment
    {
        if ($user->role === UserRole::Patient && $appointment->patient_id !== $user->id) {
            throw new AuthorizationException('You can only update your own appointments.');
        }

        if (!empty($data['appointment_date'])) {
            $appointment->appointment_date = $data['appointment_date'];
        }

        if (array_key_exists('dental_concern', $data)) {
            $appointment->dental_concern = $data['dental_concern'];
        }

        $appointment->save();

        return $appointment;
    }

    public function deleteAppointment(Appointment $appointment, User $user): void
    {
        if ($user->role !== UserRole::Admin) {
            throw new AuthorizationException('Only admins can delete appointments.');
        }

        $appointment->delete();
    }

    public function assignDentist(Appointment $appointment, User $dentist, User $user): Appointment
    {
        if ($user->role !== UserRole::Admin) {
            throw new AuthorizationException('Only admins can assign a dentist.');
        }

        $appointment->dentist_id = $dentist->id;
        $appointment->save();

        return $appointment;
    }

    public function changeStatus(Appointment $appointment, AppointmentStatus $status, User $user, ?string $reason = null): Appointment
    {
        if ($status === AppointmentStatus::Cancelled) {
            return $this->cancel($appointment, $user, $reason);
        }

        // confirm / complete
        $isAdmin = $user->role === UserRole::Admin;
        $isAssignedDentist = $user->role === UserRole::Dentist && $appointment->dentist_id === $user->id;

        if (!$isAdmin && !$isAssignedDentist) {
            throw new AuthorizationException('Only admins or the assigned dentist can update this appointment status.');
        }

        $appointment->status = $status;
        $appointment->save();

        return $appointment;
    }

    private function cancel(Appointment $appointment, User $user, ?string $reason): Appointment
    {
        $isAdmin = $user->role === UserRole::Admin;
        $isOwner = $user->role === UserRole::Patient && $appointment->patient_id === $user->id;

        if (!$isAdmin && !$isOwner) {
            throw new AuthorizationException('Only the patient or an admin can cancel this appointment.');
        }

        $appointment->status = AppointmentStatus::Cancelled;
        $appointment->cancellation_reason = $reason;
        $appointment->cancelled_by = $user->name;
        $appointment->save();

        return $appointment;
    }

    private function ensureCanView(Appointment $appointment, User $user): void
    {
        if ($user->role === UserRole::Admin) {
            return;
        }

        if ($user->role === UserRole::Patient && $appointment->patient_id === $user->id) {
            return;
        }

        if ($user->role === UserRole::Dentist && $appointment->dentist_id === $user->id) {
            return;
        }

        throw new AuthorizationException('You are not authorized to view this appointment.');
    }
}
