<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DentalServiceManager;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    protected $serviceManager;

    public function __construct(DentalServiceManager $serviceManager)
    {
        $this->serviceManager = $serviceManager;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'min_price', 'max_price']);

        return response()->json([
            'success' => true,
            'data' => $this->serviceManager->getAllServices($filters)
        ], 200);
    }

    public function show(int $id)
    {
        return response()->json([
            'success' => true,
            'data' => $this->serviceManager->getService($id)
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'duration_minutes' => 'nullable|integer',
            'status' => 'nullable|string|in:active,inactive'
        ]);

        $service = $this->serviceManager->createService($validated, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Service created successfully',
            'data' => $service
        ], 201);
    }

    public function update(Request $request, int $id)
    {
        $service = $this->serviceManager->getService($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'duration_minutes' => 'nullable|integer',
            'status' => 'nullable|string|in:active,inactive'
        ]);

        $service = $this->serviceManager->updateService($service, $validated, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Service updated successfully',
            'data' => $service
        ], 200);
    }

    public function destroy(Request $request, int $id)
    {
        $service = $this->serviceManager->getService($id);

        $this->serviceManager->deleteService($service, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully'
        ], 200);
    }
}
