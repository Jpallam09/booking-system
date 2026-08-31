<?php

namespace Database\Seeders;

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

        // 2. Create Dentist Accounts
        $dentists = [
            ['name' => 'Dr. Ramon Dela Cruz', 'phone' => '09123456780'],
            ['name' => 'Dr. Maria Santos', 'phone' => '09123456781'],
            ['name' => 'Dr. Liza Reyes', 'phone' => '09123456782'],
        ];

        foreach ($dentists as $i => $dentist) {
            User::updateOrCreate(
                ['email' => 'dentist'.($i + 1).'@example.com'],
                [
                    'name' => $dentist['name'],
                    'password' => Hash::make('password123'),
                    'role' => 'dentist',
                    'phone' => $dentist['phone'],
                ]
            );
        }

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

        // 4. Create Second Patient Account
        User::updateOrCreate(
            ['email' => 'patient2@example.com'],
            [
                'name' => 'Juan Tamad',
                'password' => Hash::make('password123'),
                'role' => 'patient',
                'phone' => '09171234567',
            ]
        );

        // 5. Seed curated dental services
        $this->call(ServiceSeeder::class);

        // 6. Seed appointments for the second patient
        $this->call(AppointmentSeeder::class);
    }
}
