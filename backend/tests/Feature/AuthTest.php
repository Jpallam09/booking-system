<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_patient_by_default(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'password' => 'password123',
            'phone' => '09123456789',
        ])
            ->assertCreated()
            ->assertJsonStructure(['message', 'data', 'token']);

        $this->assertDatabaseHas('users', [
            'email' => 'juan@example.com',
            'role' => 'patient',
        ]);
    }

    public function test_register_requires_valid_email(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Juan',
            'email' => 'not-an-email',
            'password' => 'password123',
        ])->assertUnprocessable();
    }

    public function test_register_requires_min_password_length(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Juan',
            'email' => 'juan@example.com',
            'password' => 'short',
        ])->assertUnprocessable();
    }

    public function test_login_succeeds(): void
    {
        $user = User::factory()->role(UserRole::Patient)->create([
            'email' => 'juan@example.com',
            'password' => bcrypt('password123'),
        ]);

        $this->postJson('/api/login', [
            'email' => 'juan@example.com',
            'password' => 'password123',
        ])
            ->assertOk()
            ->assertJsonStructure(['message', 'data', 'token']);
    }

    public function test_login_rejects_bad_credentials(): void
    {
        User::factory()->create(['email' => 'juan@example.com']);

        $this->postJson('/api/login', [
            'email' => 'juan@example.com',
            'password' => 'wrong-password',
        ])->assertUnprocessable();
    }

    public function test_logout_revokes_token(): void
    {
        $user = User::factory()->role(UserRole::Patient)->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_protected_route_requires_token(): void
    {
        $this->getJson('/api/user')->assertStatus(401);
    }

    public function test_user_endpoint_returns_current_user(): void
    {
        $user = User::factory()->role(UserRole::Patient)->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('id', $user->id);
    }
}
