<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    /**
     * Seed appointments for the second patient.
     */
    public function run(): void
    {
        $patient = User::where('email', 'patient2@example.com')->first();

        if (!$patient) {
            return;
        }

        $dentist1 = User::where('email', 'dentist1@example.com')->first();
        $dentist2 = User::where('email', 'dentist2@example.com')->first();
        $admin = User::where('email', 'admin@example.com')->first();

        $service = function (string $title): ?Service {
            return Service::where('title', $title)->first();
        };

        $data = [
            [
                'dentist_id' => $dentist1->id ?? null,
                'service' => 'Teeth Cleaning / Prophylaxis',
                'appointment_date' => now()->startOfDay()->addDays(1)->setTime(10, 30),
                'status' => AppointmentStatus::Pending,
                'dental_concern' => 'Gum bleeding when brushing.',
            ],
            [
                'dentist_id' => null,
                'service' => 'General Consultation',
                'appointment_date' => now()->startOfDay()->addDays(3)->setTime(14, 0),
                'status' => AppointmentStatus::Pending,
                'dental_concern' => 'Mild toothache on upper left molar.',
            ],
            [
                'dentist_id' => $dentist2->id ?? null,
                'service' => 'Teeth Cleaning / Prophylaxis',
                'appointment_date' => now()->startOfDay()->addDays(5)->setTime(11, 0),
                'status' => AppointmentStatus::Confirmed,
                'dental_concern' => 'Routine cleaning request.',
            ],
            [
                'dentist_id' => $dentist1->id ?? null,
                'service' => 'Dental Filling',
                'appointment_date' => now()->startOfDay()->addDays(7)->setTime(9, 30),
                'status' => AppointmentStatus::Confirmed,
                'dental_concern' => 'Cavity on lower right molar.',
            ],
            [
                'dentist_id' => $dentist2->id ?? null,
                'service' => 'Tooth Extraction',
                'appointment_date' => now()->startOfDay()->subDays(2)->setTime(10, 0),
                'status' => AppointmentStatus::Completed,
                'dental_concern' => 'Decayed wisdom tooth removal.',
                'treatment_notes' => 'Procedure done under local anesthesia. Prescribed pain reliever and antibiotics.',
            ],
            [
                'dentist_id' => $dentist1->id ?? null,
                'service' => 'General Consultation',
                'appointment_date' => now()->startOfDay()->subDays(6)->setTime(15, 30),
                'status' => AppointmentStatus::Cancelled,
                'dental_concern' => 'Check-up for sensitive teeth.',
                'cancellation_reason' => 'Conflict with work schedule.',
                'cancelled_by' => $admin->name ?? null,
            ],
        ];

        foreach ($data as $appointment) {
            $serviceModel = $service($appointment['service']);

            if (!$serviceModel) {
                continue;
            }

            unset($appointment['service']);
            $appointment['service_id'] = $serviceModel->id;
            $appointment['appointment_date'] = $appointment['appointment_date']->format('Y-m-d H:i:s');

            Appointment::firstOrCreate(
                [
                    'patient_id' => $patient->id,
                    'service_id' => $appointment['service_id'],
                    'appointment_date' => $appointment['appointment_date'],
                ],
                $appointment
            );
        }
    }
}