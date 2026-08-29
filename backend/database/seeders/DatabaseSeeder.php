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

        // 4. Seed curated dental services
        $this->call(ServiceSeeder::class);
    }
}
