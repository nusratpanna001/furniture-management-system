<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ProductController;

// Public Routes
Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [UsersController::class, 'login']);

// Public Product Routes (for viewing products on landing page)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/category/{category}', [ProductController::class, 'getByCategory']);
Route::get('/products/featured/list', [ProductController::class, 'getFeatured']);


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
        
        // Admin Product Management Routes
        Route::post('/admin/products', [ProductController::class, 'store']);
        Route::put('/admin/products/{id}', [ProductController::class, 'update']);
        Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
        Route::put('/admin/products/{id}/stock', [ProductController::class, 'updateStock']);
    });

    // Example: User-only API route
    Route::middleware('role:user')->group(function () {
        Route::get('/user/dashboard', function () {
            return ["message" => "User Dashboard Access Granted"];
        });
    });

});
