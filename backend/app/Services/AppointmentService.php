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

        return $query->latest()->paginate(10);
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
}
