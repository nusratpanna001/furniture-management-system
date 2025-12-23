<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\WishlistController;

// Public Routes
Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [UsersController::class, 'login']);

// Public Category Routes
Route::get('/categories', [CategoryController::class, 'index']);

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

    // User Profile Routes
    Route::put('/user/profile', [UsersController::class, 'updateProfile']);
    Route::put('/user/password', [UsersController::class, 'changePassword']);

    // Example: Admin-only API route
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', function () {
            return ["message" => "Admin Dashboard Access Granted"];
        });
        
        // Admin Category Management Routes
        Route::post('/admin/categories', [CategoryController::class, 'store']);
        Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
        Route::post('/admin/categories/{id}', [CategoryController::class, 'update']); // For FormData with _method
        Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);

        // Admin Product Management Routes
        Route::post('/admin/products', [ProductController::class, 'store']);
        Route::put('/admin/products/{id}', [ProductController::class, 'update']);
        Route::delete('/admin/products/{id}', [ProductController::class, 'destroy']);
        Route::put('/admin/products/{id}/stock', [ProductController::class, 'updateStock']);

        // Admin Order Management Routes
        Route::get('/admin/orders', [OrderController::class, 'index']);
        Route::get('/admin/orders/{id}', [OrderController::class, 'show']);
        Route::put('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);
        Route::put('/admin/orders/{id}/payment-status', [OrderController::class, 'updatePaymentStatus']);
        Route::post('/admin/orders/{id}/cancel', [OrderController::class, 'cancel']);
        Route::delete('/admin/orders/{id}', [OrderController::class, 'destroy']);

        // Admin Report Routes
        Route::get('/reports/dashboard', [ReportController::class, 'dashboard']);
        Route::get('/reports/sales', [ReportController::class, 'sales']);
        Route::get('/reports/top-products', [ReportController::class, 'topProducts']);
        Route::get('/reports/low-stock', [ReportController::class, 'lowStock']);
    });

    // Example: User-only API route
    Route::middleware('role:user')->group(function () {
        Route::get('/user/dashboard', function () {
            return ["message" => "User Dashboard Access Granted"];
        });

        // User Order Routes
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/user/orders', [OrderController::class, 'getUserOrders']);
        Route::get('/user/orders/{id}', [OrderController::class, 'show']);
        
        // User Wishlist Routes
        Route::get('/user/wishlist', [WishlistController::class, 'index']);
        Route::post('/user/wishlist', [WishlistController::class, 'store']);
        Route::delete('/user/wishlist/{id}', [WishlistController::class, 'destroy']);
        Route::delete('/user/wishlist/product/{productId}', [WishlistController::class, 'removeByProduct']);
        Route::get('/user/wishlist/check/{productId}', [WishlistController::class, 'check']);
    });

});
