<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->randomElement([
                'Teeth Cleaning',
                'Tooth Extraction',
                'Dental Filling',
                'Root Canal',
                'Teeth Whitening',
                'Braces Consultation',
                'Dental Implant',
                'Scaling and Polishing',
                'Wisdom Tooth Removal',
                'Gum Treatment',
            ]),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 500, 15000),
            'duration_minutes' => fake()->randomElement([15, 30, 45, 60, 90]),
            'status' => fake()->randomElement(['active', 'inactive']),
        ];
    }
}
