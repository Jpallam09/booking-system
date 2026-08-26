<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// frontend connection
Route::get('/test', function () {
    return response()->json([
        'message' => 'Hello from Laravel Backend! Frontend is connected successfully!'
    ]);
});
