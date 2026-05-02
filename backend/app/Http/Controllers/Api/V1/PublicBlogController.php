<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogCategoryResource;
use App\Http\Resources\BlogPostDetailResource;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicBlogController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = BlogPost::published()
            ->with(['categories', 'author', 'speaker.media', 'media']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        if ($category = $request->query('category')) {
            $query->whereHas('categories', fn ($q) => $q->where('slug', $category));
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        $perPage = min((int) $request->query('per_page', 12), 24);
        $posts = $query->latest('published_at')->paginate($perPage);

        return BlogPostResource::collection($posts);
    }

    public function featured(): AnonymousResourceCollection
    {
        $posts = BlogPost::published()
            ->featured()
            ->with(['categories', 'author', 'media'])
            ->latest('published_at')
            ->limit(6)
            ->get();

        return BlogPostResource::collection($posts);
    }

    public function show(string $slug): BlogPostDetailResource
    {
        $post = BlogPost::published()
            ->where('slug', $slug)
            ->with(['categories', 'author', 'speaker.media', 'media'])
            ->firstOrFail();

        $post->increment('views_count');

        return new BlogPostDetailResource($post);
    }

    public function categories(): AnonymousResourceCollection
    {
        $categories = BlogCategory::active()
            ->roots()
            ->with('children')
            ->withCount('posts')
            ->orderBy('order')
            ->get();

        return BlogCategoryResource::collection($categories);
    }

    public function categoryPosts(string $slug, Request $request): AnonymousResourceCollection
    {
        $category = BlogCategory::active()->where('slug', $slug)->firstOrFail();

        $perPage = min((int) $request->query('per_page', 12), 24);

        $posts = BlogPost::published()
            ->whereHas('categories', fn ($q) => $q->where('blog_categories.id', $category->id))
            ->with(['categories', 'author', 'media'])
            ->latest('published_at')
            ->paginate($perPage);

        return BlogPostResource::collection($posts);
    }
}
