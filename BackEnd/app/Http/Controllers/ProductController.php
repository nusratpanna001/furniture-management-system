<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Products::active();

            // Filter by category if provided
            if ($request->has('category') && $request->category) {
                $query->byCategory($request->category);
            }

            // Search by name if provided
            if ($request->has('search') && $request->search) {
                $query->where('name', 'LIKE', '%' . $request->search . '%');
            }

            // Filter by price range
            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }
            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            // Order by
            $orderBy = $request->get('order_by', 'created_at');
            $orderDirection = $request->get('order_direction', 'desc');
            $query->orderBy($orderBy, $orderDirection);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $products = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $products->items(),
                'meta' => [
                    'total' => $products->total(),
                    'per_page' => $products->perPage(),
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created product
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:100',
                'material' => 'required|string|max:100',
                'size' => 'required|string|max:50',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'description' => 'nullable|string|max:1000',
                'image_url' => 'nullable|string|max:500',
                'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:4096', // 4MB max
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();

            // Handle file upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->move(public_path('product'), $imageName);
                $data['image_url'] = 'product/' . $imageName;
            }

            $product = Products::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $product
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified product
     */
    public function show($id): JsonResponse
    {
        try {
            $product = Products::active()->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            Log::info("Update request for product ID: {$id}");
            Log::info("Request data:", $request->all());
            
            $product = Products::findOrFail($id);
            Log::info("Product found:", ['id' => $product->id, 'name' => $product->name, 'image_url' => $product->image_url]);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'category' => 'sometimes|string|max:100',
                'material' => 'sometimes|string|max:100',
                'size' => 'sometimes|string|max:50',
                'price' => 'sometimes|numeric|min:0',
                'stock' => 'sometimes|integer|min:0',
                'description' => 'nullable|string|max:1000',
                'image_url' => 'nullable|string|max:500',
                'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:4096', // 4MB max
                'is_active' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                Log::error("Validation failed:", $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            Log::info("Validated data:", $data);

            // Handle file upload
            if ($request->hasFile('image')) {
                Log::info("New image file detected");
                // Delete old image if exists
                if ($product->image_url && file_exists(public_path($product->image_url))) {
                    unlink(public_path($product->image_url));
                    Log::info("Old image deleted: {$product->image_url}");
                }

                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $image->move(public_path('product'), $imageName);
                $data['image_url'] = 'product/' . $imageName;
                Log::info("New image saved: {$data['image_url']}");
            } else {
                Log::info("No new image file, checking for image_url in request");
                if ($request->has('image_url')) {
                    Log::info("image_url provided: " . $request->image_url);
                } else {
                    Log::info("No image_url provided, keeping existing: " . $product->image_url);
                }
            }

            $product->update($data);
            Log::info("Product updated successfully");

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product->fresh()
            ]);
        } catch (\Exception $e) {
            Log::error("Update failed: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified product from database
     */
    public function destroy($id): JsonResponse
    {
        try {
            Log::info("Delete request for product ID: {$id}");
            
            $product = Products::findOrFail($id);
            Log::info("Product found: {$product->name}");
            
            // Store image path before deletion
            $imagePath = $product->image_url;
            
            // Use DB transaction for safety
            DB::beginTransaction();
            
            try {
                // Delete related records first (if not using cascade)
                DB::table('order_items')->where('product_id', $id)->delete();
                DB::table('wishlists')->where('product_id', $id)->delete();
                
                // Delete the product from database
                $deleted = DB::table('products')->where('id', $id)->delete();
                Log::info("Product deleted, rows affected: {$deleted}");
                
                // Delete product image if exists
                if ($imagePath && file_exists(public_path($imagePath))) {
                    @unlink(public_path($imagePath));
                    Log::info("Image deleted: {$imagePath}");
                }
                
                DB::commit();
                
                return response()->json([
                    'success' => true,
                    'message' => 'Product deleted successfully'
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error("Product deletion error: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products by category
     */
    public function getByCategory($category): JsonResponse
    {
        try {
            $products = Products::active()
                ->byCategory($category)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products by category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get featured products (can be based on some criteria)
     */
    public function getFeatured(): JsonResponse
    {
        try {
            $products = Products::active()
                ->inStock()
                ->orderBy('created_at', 'desc')
                ->limit(8)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch featured products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update product stock
     */
    public function updateStock(Request $request, $id): JsonResponse
    {
        try {
            $product = Products::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'stock' => 'required|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $product->update(['stock' => $request->stock]);

            return response()->json([
                'success' => true,
                'message' => 'Stock updated successfully',
                'data' => $product->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}