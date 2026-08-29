<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Seed the application's dental services catalog.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'General Consultation',
                'description' => 'Comprehensive oral examination and professional assessment of your dental health by our licensed dentists.',
                'price' => 500,
                'duration_minutes' => 30,
                'status' => 'active',
            ],
            [
                'title' => 'Teeth Cleaning / Prophylaxis',
                'description' => 'Routine dental prophylaxis to remove plaque and tartar buildup, leaving your teeth fresh and healthy.',
                'price' => 1200,
                'duration_minutes' => 45,
                'status' => 'active',
            ],
            [
                'title' => 'Scaling and Polishing',
                'description' => 'Deep cleaning that removes stains and hardened tartar from the teeth and gum line to prevent gum disease.',
                'price' => 1500,
                'duration_minutes' => 45,
                'status' => 'active',
            ],
            [
                'title' => 'Tooth Extraction',
                'description' => 'Safe removal of damaged, decayed, or problematic teeth performed under local anesthesia.',
                'price' => 2500,
                'duration_minutes' => 45,
                'status' => 'active',
            ],
            [
                'title' => 'Wisdom Tooth Removal',
                'description' => 'Surgical extraction of impacted or problematic wisdom teeth to relieve pain and prevent complications.',
                'price' => 8000,
                'duration_minutes' => 60,
                'status' => 'active',
            ],
            [
                'title' => 'Dental Filling',
                'description' => 'Tooth-colored composite fillings that restore cavities and protect your natural tooth structure.',
                'price' => 2000,
                'duration_minutes' => 60,
                'status' => 'active',
            ],
            [
                'title' => 'Root Canal Treatment',
                'description' => 'Endodontic therapy to save an infected or severely decayed tooth and relieve pain.',
                'price' => 12000,
                'duration_minutes' => 90,
                'status' => 'active',
            ],
            [
                'title' => 'Teeth Whitening',
                'description' => 'Professional dental bleaching that brightens your smile by several shades in a single visit.',
                'price' => 6000,
                'duration_minutes' => 60,
                'status' => 'active',
            ],
            [
                'title' => 'Dental Crown / Bridge',
                'description' => 'Custom-made caps and bridges that restore the shape, strength, and appearance of damaged or missing teeth.',
                'price' => 15000,
                'duration_minutes' => 90,
                'status' => 'active',
            ],
            [
                'title' => 'Braces Consultation',
                'description' => 'Orthodontic evaluation to discuss teeth straightening options, treatment plans, and expected results.',
                'price' => 1000,
                'duration_minutes' => 30,
                'status' => 'active',
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['title' => $service['title']],
                $service
            );
        }
    }
}