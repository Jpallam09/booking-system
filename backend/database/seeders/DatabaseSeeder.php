<?php

namespace Database\Seeders;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Admin Account
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '09189876543',
            ]
        );

        // 2. Create Dentist Account
        User::updateOrCreate(
            ['email' => 'dentist@example.com'],
            [
                'name' => 'Dr. Smith',
                'password' => Hash::make('password123'),
                'role' => 'dentist',
                'phone' => '09123456789',
            ]
        );

        // 3. Create Patient Account
        User::updateOrCreate(
            ['email' => 'patient@example.com'],
            [
                'name' => 'Juan Dela Cruz',
                'password' => Hash::make('password123'),
                'role' => 'patient',
                'phone' => '09123456789',
            ]
        );

        // 4. Seed demo services
        if (Service::count() === 0) {
            Service::factory()->count(10)->create();
        }

        // 5. Seed a few demo appointments
        if (Appointment::count() === 0) {
            $patient = User::where('email', 'patient@example.com')->first();
            $dentist = User::where('email', 'dentist@example.com')->first();

            if ($patient && Service::exists()) {
                Appointment::factory()->count(5)->create([
                    'patient_id' => $patient->id,
                    'dentist_id' => $dentist?->id,
                    'status' => AppointmentStatus::Pending,
                ]);
            }
        }
    }
}
