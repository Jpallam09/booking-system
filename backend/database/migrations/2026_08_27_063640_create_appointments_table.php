<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up(): void
{
    Schema::create('appointments', function (Blueprint $table) {
        $table->id();
        $table->foreignId('patient_id')->constrained('users')->cascadeOnDelete();
        $table->foreignId('dentist_id')->nullable()->constrained('users')->nullOnDelete();
        $table->foreignId('service_id')->constrained('services')->cascadeOnDelete();
        $table->dateTime('appointment_date');
        $table->string('status', 50)->default('pending');
        $table->text('dental_concern')->nullable();
        $table->text('treatment_notes')->nullable();
        $table->text('cancellation_reason')->nullable();
        $table->string('cancelled_by', 50)->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
