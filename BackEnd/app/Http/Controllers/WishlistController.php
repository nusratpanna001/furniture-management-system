<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    /**
     * Get all wishlist items for authenticated user
     */
    public function index(Request $request)
    {
        try {
            $userId = Auth::id();
            
            $wishlistItems = Wishlist::with(['product'])
                ->where('user_id', $userId)
                ->get()
                ->map(function ($wishlist) {
                    return [
                        'id' => $wishlist->id,
                        'product_id' => $wishlist->product_id,
                        'product' => $wishlist->product ? [
                            'id' => $wishlist->product->id,
                            'name' => $wishlist->product->name,
                            'price' => $wishlist->product->price,
                            'image_url' => $wishlist->product->image_url,
                            'stock' => $wishlist->product->stock,
                            'inStock' => $wishlist->product->stock > 0,
                        ] : null,
                        'created_at' => $wishlist->created_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $wishlistItems,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch wishlist',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add product to wishlist
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
            ]);

            $userId = Auth::id();
            
            // Check if already in wishlist
            $existing = Wishlist::where('user_id', $userId)
                ->where('product_id', $request->product_id)
                ->first();

            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product already in wishlist',
                ], 409);
            }

            $wishlist = Wishlist::create([
                'user_id' => $userId,
                'product_id' => $request->product_id,
            ]);

            $wishlist->load('product');

            return response()->json([
                'success' => true,
                'message' => 'Product added to wishlist',
                'data' => [
                    'id' => $wishlist->id,
                    'product_id' => $wishlist->product_id,
                    'product' => $wishlist->product ? [
                        'id' => $wishlist->product->id,
                        'name' => $wishlist->product->name,
                        'price' => $wishlist->product->price,
                        'image_url' => $wishlist->product->image_url,
                        'stock' => $wishlist->product->stock,
                        'inStock' => $wishlist->product->stock > 0,
                    ] : null,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add to wishlist',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove product from wishlist
     */
    public function destroy($id)
    {
        try {
            $userId = Auth::id();
            
            $wishlist = Wishlist::where('id', $id)
                ->where('user_id', $userId)
                ->first();

            if (!$wishlist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Wishlist item not found',
                ], 404);
            }

            $wishlist->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product removed from wishlist',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove from wishlist',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove product from wishlist by product_id
     */
    public function removeByProduct($productId)
    {
        try {
            $userId = Auth::id();
            
            $wishlist = Wishlist::where('product_id', $productId)
                ->where('user_id', $userId)
                ->first();

            if (!$wishlist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not in wishlist',
                ], 404);
            }

            $wishlist->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product removed from wishlist',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove from wishlist',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check if product is in wishlist
     */
    public function check($productId)
    {
        try {
            $userId = Auth::id();
            
            $inWishlist = Wishlist::where('user_id', $userId)
                ->where('product_id', $productId)
                ->exists();

            return response()->json([
                'success' => true,
                'inWishlist' => $inWishlist,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check wishlist',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
