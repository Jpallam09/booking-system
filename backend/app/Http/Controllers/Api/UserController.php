<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['role', 'search', 'per_page']);

        return response()->json([
            'success' => true,
            'data' => $this->userService->getFilteredUsers($filters, $request->user()),
        ]);
    }
}