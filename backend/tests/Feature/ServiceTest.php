<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsRole(UserRole $role): User
    {
        $user = User::factory()->role($role)->create();
        $this->actingAs($user, 'sanctum');

        return $user;
    }

    public function test_list_services_requires_authentication(): void
    {
        $this->getJson('/api/services')->assertStatus(401);
    }

    public function test_index_returns_paginated_services(): void
    {
        $this->actingAsRole(UserRole::Patient);
        Service::factory()->count(5)->create();

        $this->getJson('/api/services')
            ->assertOk()
            ->assertJsonStructure(['success', 'data' => ['data']]);
    }

    public function test_index_filters_by_status(): void
    {
        $this->actingAsRole(UserRole::Patient);
        Service::factory()->create(['status' => 'active', 'title' => 'Active Service']);
        Service::factory()->create(['status' => 'inactive', 'title' => 'Inactive Service']);

        $this->getJson('/api/services?status=inactive')
            ->assertOk()
            ->assertJsonCount(1, 'data.data');
    }

    public function test_index_searches_by_title(): void
    {
        $this->actingAsRole(UserRole::Patient);
        Service::factory()->create(['title' => 'Teeth Cleaning']);
        Service::factory()->create(['title' => 'Root Canal']);

        $this->getJson('/api/services?search=Cleaning')
            ->assertOk()
            ->assertJsonCount(1, 'data.data')
            ->assertJsonPath('data.data.0.title', 'Teeth Cleaning');
    }

    public function test_index_filters_by_price_range(): void
    {
        $this->actingAsRole(UserRole::Patient);
        Service::factory()->create(['title' => 'Cheap', 'price' => 100]);
        Service::factory()->create(['title' => 'Expensive', 'price' => 5000]);

        $this->getJson('/api/services?min_price=1000')
            ->assertOk()
            ->assertJsonCount(1, 'data.data')
            ->assertJsonPath('data.data.0.title', 'Expensive');
    }

    public function test_show_returns_a_service(): void
    {
        $this->actingAsRole(UserRole::Patient);
        $service = Service::factory()->create(['title' => 'Consultation']);

        $this->getJson("/api/services/{$service->id}")
            ->assertOk()
            ->assertJsonPath('data.title', 'Consultation');
    }

    public function test_show_returns_404_for_missing_service(): void
    {
        $this->actingAsRole(UserRole::Patient);

        $this->getJson('/api/services/9999')->assertNotFound();
    }

    public function test_store_service_requires_admin(): void
    {
        $this->actingAsRole(UserRole::Patient);

        $this->postJson('/api/services', ['title' => 'Service'])
            ->assertForbidden();
    }

    public function test_admin_can_create_service(): void
    {
        $this->actingAsRole(UserRole::Admin);

        $this->postJson('/api/services', [
            'title' => 'Teeth Whitening',
            'price' => 3000,
            'status' => 'active',
        ])
            ->assertCreated()
            ->assertJsonPath('data.title', 'Teeth Whitening');
    }

    public function test_update_service_requires_admin(): void
    {
        $this->actingAsRole(UserRole::Patient);
        $service = Service::factory()->create();

        $this->putJson("/api/services/{$service->id}", ['title' => 'Edited'])
            ->assertForbidden();
    }

    public function test_admin_can_update_service(): void
    {
        $this->actingAsRole(UserRole::Admin);
        $service = Service::factory()->create(['title' => 'Original']);

        $this->putJson("/api/services/{$service->id}", ['title' => 'Updated'])
            ->assertOk()
            ->assertJsonPath('data.title', 'Updated');
    }

    public function test_delete_service_requires_admin(): void
    {
        $this->actingAsRole(UserRole::Patient);
        $service = Service::factory()->create();

        $this->deleteJson("/api/services/{$service->id}")->assertForbidden();
    }

    public function test_admin_can_delete_service(): void
    {
        $this->actingAsRole(UserRole::Admin);
        $service = Service::factory()->create();

        $this->deleteJson("/api/services/{$service->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('services', ['id' => $service->id]);
    }
}
