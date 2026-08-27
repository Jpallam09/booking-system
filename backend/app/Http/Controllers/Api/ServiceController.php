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

    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => $this->serviceManager->getAllServices()
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

        // Hand off to the service layer to handle the business logic & creation
        $service = $this->serviceManager->createService($validated, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Service created successfully',
            'data' => $service
        ], 201);
    }
}
