<?php

namespace App\Http\Controllers\Api;

use App\Enums\AppointmentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\User;
use App\Services\AppointmentService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    protected $appointmentService;

    public function __construct(AppointmentService $appointmentService)
    {
        $this->appointmentService = $appointmentService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['status', 'service_id', 'from', 'to', 'search']);

        return response()->json([
            'success' => true,
            'data' => $this->appointmentService->getFilteredAppointments($filters)
        ]);
    }

    public function show(Request $request, int $id)
    {
        $appointment = $this->appointmentService->getAppointment($id, $request->user());

        return response()->json([
            'success' => true,
            'data' => $appointment
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'appointment_date' => 'required|date|after:now',
            'dental_concern' => 'nullable|string|max:500',
        ]);

        $appointment = $this->appointmentService->createAppointment($validated, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Appointment booked successfully.',
            'data' => $appointment
        ], 201);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'appointment_date' => 'sometimes|date|after:now',
            'dental_concern' => 'nullable|string|max:500',
        ]);

        $appointment = $this->appointmentService->updateAppointment($appointment, $validated, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Appointment updated successfully.',
            'data' => $appointment
        ]);
    }

    public function destroy(Request $request, Appointment $appointment)
    {
        $this->appointmentService->deleteAppointment($appointment, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Appointment deleted successfully.'
        ]);
    }

    public function assignDentist(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'dentist_id' => 'required|exists:users,id',
        ]);

        $dentist = User::find($validated['dentist_id']);

        if ($dentist->role !== UserRole::Dentist) {
            throw ValidationException::withMessages([
                'dentist_id' => ['The selected user is not a dentist.'],
            ]);
        }

        $appointment = $this->appointmentService->assignDentist($appointment, $dentist, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Dentist assigned successfully.',
            'data' => $appointment
        ]);
    }

    public function confirm(Request $request, Appointment $appointment)
    {
        $appointment = $this->appointmentService->changeStatus($appointment, AppointmentStatus::Confirmed, $request->user());

        return $this->statusResponse($appointment, 'Appointment confirmed.');
    }

    public function complete(Request $request, Appointment $appointment)
    {
        $appointment = $this->appointmentService->changeStatus($appointment, AppointmentStatus::Completed, $request->user());

        return $this->statusResponse($appointment, 'Appointment completed.');
    }

    public function cancel(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'cancellation_reason' => 'required|string|max:500',
        ]);

        $appointment = $this->appointmentService->changeStatus(
            $appointment,
            AppointmentStatus::Cancelled,
            $request->user(),
            $validated['cancellation_reason']
        );

        return $this->statusResponse($appointment, 'Appointment cancelled.');
    }

    private function statusResponse($appointment, string $message)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $appointment
        ]);
    }
}
