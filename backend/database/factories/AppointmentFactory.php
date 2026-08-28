<?php

namespace Database\Factories;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'patient_id' => User::factory(),
            'dentist_id' => null,
            'service_id' => Service::factory(),
            'appointment_date' => fake()->dateTimeBetween('+1 day', '+1 month')->format('Y-m-d H:i:s'),
            'status' => AppointmentStatus::Pending,
            'dental_concern' => fake()->optional()->sentence(),
            'treatment_notes' => null,
            'cancellation_reason' => null,
            'cancelled_by' => null,
        ];
    }
}
