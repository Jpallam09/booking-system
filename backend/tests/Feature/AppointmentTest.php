<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Enums\UserRole;
use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AppointmentTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsRole(UserRole $role): User
    {
        $user = User::factory()->role($role)->create();
        $this->actingAs($user, 'sanctum');

        return $user;
    }

    private function makeService(): Service
    {
        return Service::factory()->create();
    }

    private function futureDate(): string
    {
        return now()->addDays(3)->format('Y-m-d H:i:s');
    }

    public function test_list_requires_authentication(): void
    {
        $this->getJson('/api/appointments')->assertStatus(401);
    }

    public function test_patient_sees_only_own_appointments(): void
    {
        $patient = $this->actingAsRole(UserRole::Patient);
        $service = $this->makeService();

        Appointment::factory()->create(['patient_id' => $patient->id, 'service_id' => $service->id]);
        Appointment::factory()->create(['service_id' => $service->id]);

        $this->getJson('/api/appointments')
            ->assertOk()
            ->assertJsonCount(1, 'data.data');
    }

    public function test_admin_sees_all_appointments(): void
    {
        $this->actingAsRole(UserRole::Admin);
        $service = $this->makeService();

        Appointment::factory()->count(3)->create(['service_id' => $service->id]);

        $this->getJson('/api/appointments')
            ->assertOk()
            ->assertJsonCount(3, 'data.data');
    }

    public function test_list_filters_by_status(): void
    {
        $this->actingAsRole(UserRole::Admin);
        $service = $this->makeService();

        Appointment::factory()->create(['service_id' => $service->id, 'status' => AppointmentStatus::Pending]);
        Appointment::factory()->create(['service_id' => $service->id, 'status' => AppointmentStatus::Confirmed]);

        $this->getJson('/api/appointments?status=confirmed')
            ->assertOk()
            ->assertJsonCount(1, 'data.data');
    }

    public function test_only_patients_can_book(): void
    {
        $this->actingAsRole(UserRole::Admin);
        $service = $this->makeService();

        $this->postJson('/api/appointments', [
            'service_id' => $service->id,
            'appointment_date' => $this->futureDate(),
        ])->assertForbidden();
    }

    public function test_patient_can_book(): void
    {
        $patient = $this->actingAsRole(UserRole::Patient);
        $service = $this->makeService();

        $this->postJson('/api/appointments', [
            'service_id' => $service->id,
            'appointment_date' => $this->futureDate(),
        ])
            ->assertCreated()
            ->assertJsonPath('data.patient_id', $patient->id);
    }

    public function test_booking_rejects_past_date(): void
    {
        $this->actingAsRole(UserRole::Patient);
        $service = $this->makeService();

        $this->postJson('/api/appointments', [
            'service_id' => $service->id,
            'appointment_date' => now()->subDay()->format('Y-m-d H:i:s'),
        ])->assertUnprocessable();
    }

    public function test_patient_cannot_view_others_appointment(): void
    {
        $this->actingAsRole(UserRole::Patient);
        $service = $this->makeService();
        $other = User::factory()->role(UserRole::Patient)->create();
        $appointment = Appointment::factory()->create(['patient_id' => $other->id, 'service_id' => $service->id]);

        $this->getJson("/api/appointments/{$appointment->id}")->assertForbidden();
    }

    public function test_patient_can_view_own_appointment(): void
    {
        $patient = $this->actingAsRole(UserRole::Patient);
        $service = $this->makeService();
        $appointment = Appointment::factory()->create(['patient_id' => $patient->id, 'service_id' => $service->id]);

        $this->getJson("/api/appointments/{$appointment->id}")->assertOk();
    }

    public function test_patient_cannot_update_others_appointment(): void
    {
        $this->actingAsRole(UserRole::Patient);
        $service = $this->makeService();
        $other = User::factory()->role(UserRole::Patient)->create();
        $appointment = Appointment::factory()->create(['patient_id' => $other->id, 'service_id' => $service->id]);

        $this->putJson("/api/appointments/{$appointment->id}", ['dental_concern' => 'test'])->assertForbidden();
    }

    public function test_patient_can_update_own_appointment(): void
    {
        $patient = $this->actingAsRole(UserRole::Patient);
        $service = $this->makeService();
        $appointment = Appointment::factory()->create(['patient_id' => $patient->id, 'service_id' => $service->id]);

        $this->putJson("/api/appointments/{$appointment->id}", [
            'appointment_date' => $this->futureDate(),
        ])->assertOk();
    }

    public function test_delete_requires_admin(): void
    {
        $this->actingAsRole(UserRole::Patient);
        $service = $this->makeService();
        $appointment = Appointment::factory()->create(['service_id' => $service->id]);

        $this->deleteJson("/api/appointments/{$appointment->id}")->assertForbidden();
    }

    public function test_admin_can_delete_appointment(): void
    {
        $this->actingAsRole(UserRole::Admin);
        $service = $this->makeService();
        $appointment = Appointment::factory()->create(['service_id' => $service->id]);

        $this->deleteJson("/api/appointments/{$appointment->id}")
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('appointments', ['id' => $appointment->id]);
    }

    public function test_admin_can_assign_dentist(): void
    {
        $admin = $this->actingAsRole(UserRole::Admin);
        $patient = User::factory()->role(UserRole::Patient)->create();
        $dentist = User::factory()->role(UserRole::Dentist)->create();
        $service = $this->makeService();
        $appointment = Appointment::factory()->create(['patient_id' => $patient->id, 'service_id' => $service->id]);

        $this->postJson("/api/appointments/{$appointment->id}/assign-dentist", ['dentist_id' => $dentist->id])
            ->assertOk()
            ->assertJsonPath('data.dentist_id', $dentist->id);
    }

    public function test_assign_dentist_rejects_non_dentist(): void
    {
        $this->actingAsRole(UserRole::Admin);
        $patient = User::factory()->role(UserRole::Patient)->create();
        $anotherPatient = User::factory()->role(UserRole::Patient)->create();
        $service = $this->makeService();
        $appointment = Appointment::factory()->create(['patient_id' => $patient->id, 'service_id' => $service->id]);

        $this->postJson("/api/appointments/{$appointment->id}/assign-dentist", ['dentist_id' => $anotherPatient->id])
            ->assertUnprocessable();
    }

    public function test_patient_cannot_confirm_appointment(): void
    {
        $this->actingAsRole(UserRole::Patient);
        $service = $this->makeService();
        $appointment = Appointment::factory()->create(['service_id' => $service->id]);

        $this->postJson("/api/appointments/{$appointment->id}/confirm")->assertForbidden();
    }

    public function test_admin_can_confirm_appointment(): void
    {
        $this->actingAsRole(UserRole::Admin);
        $service = $this->makeService();
        $appointment = Appointment::factory()->create(['service_id' => $service->id]);

        $this->postJson("/api/appointments/{$appointment->id}/confirm")
            ->assertOk()
            ->assertJsonPath('data.status', 'confirmed');
    }

    public function test_assigned_dentist_can_complete_appointment(): void
    {
        $dentist = $this->actingAsRole(UserRole::Dentist);
        $patient = User::factory()->role(UserRole::Patient)->create();
        $service = $this->makeService();
        $appointment = Appointment::factory()->create([
            'patient_id' => $patient->id,
            'dentist_id' => $dentist->id,
            'service_id' => $service->id,
        ]);

        $this->postJson("/api/appointments/{$appointment->id}/complete")
            ->assertOk()
            ->assertJsonPath('data.status', 'completed');
    }

    public function test_unassigned_dentist_cannot_complete(): void
    {
        $this->actingAsRole(UserRole::Dentist);
        $patient = User::factory()->role(UserRole::Patient)->create();
        $service = $this->makeService();
        $appointment = Appointment::factory()->create(['patient_id' => $patient->id, 'service_id' => $service->id]);

        $this->postJson("/api/appointments/{$appointment->id}/complete")->assertForbidden();
    }

    public function test_patient_can_cancel_own_appointment_with_reason(): void
    {
        $patient = $this->actingAsRole(UserRole::Patient);
        $service = $this->makeService();
        $appointment = Appointment::factory()->create(['patient_id' => $patient->id, 'service_id' => $service->id]);

        $this->postJson("/api/appointments/{$appointment->id}/cancel", ['cancellation_reason' => 'Change of plans'])
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');
    }

    public function test_cancel_requires_reason(): void
    {
        $patient = $this->actingAsRole(UserRole::Patient);
        $service = $this->makeService();
        $appointment = Appointment::factory()->create(['patient_id' => $patient->id, 'service_id' => $service->id]);

        $this->postJson("/api/appointments/{$appointment->id}/cancel")->assertUnprocessable();
    }
}
