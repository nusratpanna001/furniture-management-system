<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    // List all categories (public)
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Category::orderBy('name')->get(),
        ]);
    }

    // Store new category (admin)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:categories,name',
            'icon' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:4096',
            'image_url' => 'nullable|string',
        ]);

        $imagePath = null;

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('category'), $imageName);
            $imagePath = 'category/' . $imageName;
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->image_url;
        }

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'icon' => $request->icon,
            'image' => $imagePath,
        ]);

        return response()->json([
            'success' => true,
            'data' => $category,
        ], 201);
    }

    // Update category (admin)
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $request->validate([
            'name' => 'required|string|unique:categories,name,' . $id,
            'icon' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:4096',
            'image_url' => 'nullable|string',
        ]);

        $imagePath = $category->image;

        // Handle new image upload
        if ($request->hasFile('image')) {
            // Delete old image if it exists and is a local file
            if ($category->image && !filter_var($category->image, FILTER_VALIDATE_URL)) {
                $oldImagePath = public_path($category->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }

            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('category'), $imageName);
            $imagePath = 'category/' . $imageName;
        } elseif ($request->filled('image_url')) {
            $imagePath = $request->image_url;
        }

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'icon' => $request->icon,
            'image' => $imagePath,
        ]);
        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    // Delete category (admin)
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json([
            'success' => true,
            'message' => 'Category deleted',
        ]);
    }
}
