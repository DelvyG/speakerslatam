<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\BlogPostStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\BlogPostDetailResource;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SpeakerBlogController extends Controller
{
    private function getSpeaker(Request $request)
    {
        $speaker = $request->user()->speaker;
        if (! $speaker) {
            throw new NotFoundHttpException('No tienes un perfil de conferencista.');
        }
        return $speaker;
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $speaker = $this->getSpeaker($request);

        $query = BlogPost::bySpeaker($speaker->id)
            ->with(['categories', 'media']);

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $posts = $query->latest()->paginate(12);

        return BlogPostResource::collection($posts);
    }

    public function store(Request $request): BlogPostDetailResource
    {
        $speaker = $this->getSpeaker($request);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['exists:blog_categories,id'],
        ], [
            'title.required' => 'El titulo es obligatorio.',
        ]);

        $post = BlogPost::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'excerpt' => $validated['excerpt'] ?? null,
            'body' => $validated['body'] ?? null,
            'speaker_id' => $speaker->id,
            'author_user_id' => $request->user()->id,
            'status' => BlogPostStatus::Draft,
        ]);

        if (! empty($validated['category_ids'])) {
            $post->categories()->sync($validated['category_ids']);
        }

        $post->load(['categories', 'media']);

        return new BlogPostDetailResource($post);
    }

    public function show(Request $request, string $uuid): BlogPostDetailResource
    {
        $speaker = $this->getSpeaker($request);

        $post = BlogPost::bySpeaker($speaker->id)
            ->where('uuid', $uuid)
            ->with(['categories', 'media'])
            ->firstOrFail();

        return new BlogPostDetailResource($post);
    }

    public function update(Request $request, string $uuid): BlogPostDetailResource
    {
        $speaker = $this->getSpeaker($request);

        $post = BlogPost::bySpeaker($speaker->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        if (! in_array($post->status, [BlogPostStatus::Draft, BlogPostStatus::Rejected])) {
            return response()->json([
                'message' => 'Solo puedes editar articulos en borrador o rechazados.',
            ], 422);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'body' => ['nullable', 'string'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['exists:blog_categories,id'],
        ]);

        $post->update(collect($validated)->except('category_ids')->toArray());

        if (isset($validated['category_ids'])) {
            $post->categories()->sync($validated['category_ids']);
        }

        $post->load(['categories', 'media']);

        return new BlogPostDetailResource($post);
    }

    public function destroy(Request $request, string $uuid): JsonResponse
    {
        $speaker = $this->getSpeaker($request);

        $post = BlogPost::bySpeaker($speaker->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        if (! in_array($post->status, [BlogPostStatus::Draft, BlogPostStatus::Rejected])) {
            return response()->json([
                'message' => 'Solo puedes eliminar articulos en borrador o rechazados.',
            ], 422);
        }

        $post->delete();

        return response()->json(['message' => 'Articulo eliminado.']);
    }

    public function submitForReview(Request $request, string $uuid): JsonResponse
    {
        $speaker = $this->getSpeaker($request);

        $post = BlogPost::bySpeaker($speaker->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        if ($post->status !== BlogPostStatus::Draft && $post->status !== BlogPostStatus::Rejected) {
            return response()->json([
                'message' => 'Solo puedes enviar a revision articulos en borrador.',
            ], 422);
        }

        if (empty($post->title) || empty($post->body)) {
            return response()->json([
                'message' => 'El articulo debe tener titulo y contenido para enviarlo a revision.',
            ], 422);
        }

        $post->update([
            'status' => BlogPostStatus::PendingReview,
            'rejection_reason' => null,
        ]);

        return response()->json(['message' => 'Articulo enviado a revision.']);
    }

    public function uploadImage(Request $request, string $uuid): JsonResponse
    {
        $speaker = $this->getSpeaker($request);

        $post = BlogPost::bySpeaker($speaker->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,png,webp,gif', 'max:5120'],
        ], [
            'image.required' => 'La imagen es obligatoria.',
            'image.image' => 'El archivo debe ser una imagen.',
            'image.max' => 'La imagen no debe superar 5MB.',
        ]);

        $media = $post->addMediaFromRequest('image')
            ->toMediaCollection('content_images');

        return response()->json([
            'url' => $media->getUrl(),
        ]);
    }

    public function uploadFeaturedImage(Request $request, string $uuid): JsonResponse
    {
        $speaker = $this->getSpeaker($request);

        $post = BlogPost::bySpeaker($speaker->id)
            ->where('uuid', $uuid)
            ->firstOrFail();

        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:10240'],
        ]);

        $post->clearMediaCollection('featured_image');
        $post->addMediaFromRequest('image')
            ->toMediaCollection('featured_image');

        return response()->json([
            'url' => $post->getFirstMediaUrl('featured_image'),
            'thumb_url' => $post->getFirstMediaUrl('featured_image', 'thumb'),
        ]);
    }
}
