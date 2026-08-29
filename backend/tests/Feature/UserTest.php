<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_users_requires_authentication(): void
    {
        $this->getJson('/api/users')->assertStatus(401);
    }

    public function test_patient_cannot_list_users(): void
    {
        $patient = User::factory()->role(UserRole::Patient)->create();
        $this->actingAs($patient, 'sanctum');

        $this->getJson('/api/users')->assertForbidden();
    }

    public function test_admin_can_list_users(): void
    {
        $admin = User::factory()->role(UserRole::Admin)->create();
        User::factory()->role(UserRole::Patient)->create();
        User::factory()->role(UserRole::Dentist)->create();
        $this->actingAs($admin, 'sanctum');

        $this->getJson('/api/users')
            ->assertOk()
            ->assertJsonCount(3, 'data.data');
    }

    public function test_admin_can_filter_users_by_role(): void
    {
        $admin = User::factory()->role(UserRole::Admin)->create();
        $dentist = User::factory()->role(UserRole::Dentist)->create(['name' => 'Dentist 1']);
        User::factory()->role(UserRole::Patient)->create();
        $this->actingAs($admin, 'sanctum');

        $response = $this->getJson('/api/users?role=dentist')
            ->assertOk()
            ->assertJsonCount(1, 'data.data');

        $this->assertSame($dentist->id, $response->json('data.data.0.id'));
    }

    public function test_admin_can_search_users(): void
    {
        $admin = User::factory()->role(UserRole::Admin)->create();
        User::factory()->create(['name' => 'Dentist 1']);
        User::factory()->create(['name' => 'Juan Dela Cruz']);
        $this->actingAs($admin, 'sanctum');

        $this->getJson('/api/users?search=juan')
            ->assertOk()
            ->assertJsonCount(1, 'data.data');
    }
}