<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;

// Public Routes
Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [UsersController::class, 'login']);


// ==============================
// Protected Routes (Login Required)
// ==============================
Route::middleware('auth:sanctum')->group(function () {

    // get authenticated user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Example: Admin-only API route
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', function () {
            return ["message" => "Admin Dashboard Access Granted"];
        });
    });

    // Example: User-only API route
    Route::middleware('role:user')->group(function () {
        Route::get('/user/dashboard', function () {
            return ["message" => "User Dashboard Access Granted"];
        });
    });

});
