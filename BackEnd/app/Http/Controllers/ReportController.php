<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function dashboard()
    {
        try {
            // Get KPIs - count only active products
            $totalProducts = Products::active()->count();
            
            // Try to count categories, default to 0 if table doesn't exist
            try {
                $totalCategories = DB::table('categories')->count();
            } catch (\Exception $e) {
                $totalCategories = 0;
            }
            
            $totalCustomers = User::where('role', 'user')->count();
            $totalOrders = Order::count();

            // Get top products by order items (only active products)
            $topProducts = DB::table('order_items')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('products.is_active', true)
                ->select(
                    'products.id',
                    'products.name',
                    'products.image_url as image',
                    DB::raw('SUM(order_items.quantity) as sales'),
                    DB::raw('SUM(order_items.subtotal) as revenue')
                )
                ->groupBy('products.id', 'products.name', 'products.image_url')
                ->orderBy('sales', 'desc')
                ->limit(5)
                ->get();

            // Get low stock products (only active products)
            $lowStockProducts = Products::active()
                ->where('stock', '<', 10)
                ->orderBy('stock', 'asc')
                ->limit(10)
                ->get()
                ->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'category' => $product->category,
                        'stock' => $product->stock,
                        'price' => $product->price,
                    ];
                });

            // Get sales trend (last 30 days)
            $salesTrend = DB::table('orders')
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as sales'),
                    DB::raw('SUM(total) as revenue')
                )
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy(DB::raw('DATE(created_at)'))
                ->orderBy('date', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'kpis' => [
                        'totalProducts' => $totalProducts,
                        'totalCategories' => $totalCategories,
                        'totalCustomers' => $totalCustomers,
                        'totalOrders' => $totalOrders,
                    ],
                    'topProducts' => $topProducts,
                    'lowStockProducts' => $lowStockProducts,
                    'salesTrend' => $salesTrend,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function sales(Request $request)
    {
        $period = $request->get('period', 'month');
        
        // Sales report logic
        $sales = Order::with('items.product')
            ->where('created_at', '>=', now()->subDays(30))
            ->get();

        return response()->json([
            'success' => true,
            'data' => $sales,
        ]);
    }

    public function topProducts(Request $request)
    {
        $limit = $request->get('limit', 10);
        
        $topProducts = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_sales'),
                DB::raw('SUM(order_items.subtotal) as total_revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderBy('total_sales', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $topProducts,
        ]);
    }

    public function lowStock()
    {
        $lowStockProducts = Products::where('stock', '<', 10)
            ->orderBy('stock', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $lowStockProducts,
        ]);
    }
}
