<?php

namespace App\Services;

use App\Mail\AppointmentCancelledMail;
use App\Mail\AppointmentCompletedMail;
use App\Mail\AppointmentConfirmedMail;
use App\Mail\AppointmentCreatedMail;
use App\Mail\AppointmentRescheduledMail;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class EmailService
{
    public function sendAppointmentEmail(Appointment $appointment, string $event): void
    {
        try {
            $patient = $appointment->patient;

            match ($event) {
                'created' => $this->send($patient, new AppointmentCreatedMail($appointment)),
                'confirmed' => $this->send($patient, new AppointmentConfirmedMail($appointment)),
                'completed' => $this->send($patient, new AppointmentCompletedMail($appointment)),
                'cancelled' => $this->sendCancelled($appointment),
                'rescheduled' => $this->sendRescheduled($appointment),
                default => null,
            };
        } catch (Throwable $e) {
            Log::error("Failed to send appointment email for event [{$event}]: " . $e->getMessage());
        }
    }

    private function sendCancelled(Appointment $appointment): void
    {
        $this->send($appointment->patient, new AppointmentCancelledMail($appointment));

        if ($appointment->dentist_id && $appointment->dentist) {
            $this->send($appointment->dentist, new AppointmentCancelledMail($appointment));
        }
    }

    private function sendRescheduled(Appointment $appointment): void
    {
        $this->send($appointment->patient, new AppointmentRescheduledMail($appointment));

        if ($appointment->dentist_id && $appointment->dentist) {
            $this->send($appointment->dentist, new AppointmentRescheduledMail($appointment));
        }
    }

    private function send(?User $user, $mailable): void
    {
        if (!$user || !$user->email) {
            Log::warning('Skipping appointment email: recipient has no email address.');

            return;
        }

        Mail::to($user->email)->send($mailable);
    }
}
