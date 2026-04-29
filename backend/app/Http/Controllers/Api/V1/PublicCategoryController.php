<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicCategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $categories = Category::withCount('topics')
            ->with('topics')
            ->orderBy('order')
            ->get();

        return CategoryResource::collection($categories);
    }

    public function show(string $slug): CategoryResource
    {
        $category = Category::where('slug', $slug)
            ->withCount(['topics', 'speakers'])
            ->with('topics')
            ->firstOrFail();

        return new CategoryResource($category);
    }
}
