<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSpeakerProfileRequest;
use App\Http\Resources\SpeakerDetailResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SpeakerProfileController extends Controller
{
    public function show(Request $request): SpeakerDetailResource
    {
        $speaker = $request->user()->speaker;

        if (! $speaker) {
            throw new NotFoundHttpException('No tienes un perfil de conferencista.');
        }

        $speaker->load(['categories', 'topics', 'languages', 'media', 'activeMembership']);

        return new SpeakerDetailResource($speaker);
    }

    public function update(UpdateSpeakerProfileRequest $request): SpeakerDetailResource
    {
        $user = $request->user();
        $speaker = $user->speaker;

        if (! $speaker) {
            throw new NotFoundHttpException('No tienes un perfil de conferencista.');
        }

        $validated = $request->validated();

        $speaker->update(collect($validated)->except(['category_ids', 'topic_ids', 'language_ids'])->toArray());

        $speaker->categories()->sync($validated['category_ids']);
        $speaker->topics()->sync($validated['topic_ids'] ?? []);
        $speaker->languages()->sync($validated['language_ids']);

        // Auto-activate when profile is complete
        if ($speaker->status->value === 'pending' && $speaker->bio_short && $speaker->city) {
            $speaker->update([
                'status' => 'active',
                'published_at' => now(),
            ]);
        }

        $speaker->load(['categories', 'topics', 'languages', 'media', 'activeMembership']);

        return new SpeakerDetailResource($speaker);
    }

    public function uploadPhoto(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:2048'],
        ], [
            'photo.required' => 'La foto es obligatoria.',
            'photo.image' => 'El archivo debe ser una imagen.',
            'photo.mimes' => 'La imagen debe ser JPEG, PNG o WebP.',
            'photo.max' => 'La imagen no debe superar los 2MB.',
        ]);

        $speaker = $request->user()->speaker;

        if (! $speaker) {
            throw new NotFoundHttpException('No tienes un perfil de conferencista.');
        }

        $speaker->clearMediaCollection('photo');
        $speaker->addMediaFromRequest('photo')->toMediaCollection('photo');

        return response()->json([
            'message' => 'Foto actualizada exitosamente.',
            'photo_url' => $speaker->getFirstMediaUrl('photo'),
        ]);
    }

    public function uploadCover(Request $request): JsonResponse
    {
        $request->validate([
            'cover' => ['required', 'image', 'mimes:jpeg,png,webp', 'max:5120'],
            'cover_position' => ['nullable', 'integer', 'min:0', 'max:100'],
        ], [
            'cover.required' => 'La imagen de portada es obligatoria.',
            'cover.image' => 'El archivo debe ser una imagen.',
            'cover.mimes' => 'La imagen debe ser JPEG, PNG o WebP.',
            'cover.max' => 'La imagen no debe superar los 5MB.',
        ]);

        $speaker = $request->user()->speaker;

        if (! $speaker) {
            throw new NotFoundHttpException('No tienes un perfil de conferencista.');
        }

        $speaker->clearMediaCollection('cover');
        $speaker->addMediaFromRequest('cover')->toMediaCollection('cover');

        if ($request->has('cover_position')) {
            $speaker->update(['cover_position' => $request->cover_position]);
        }

        return response()->json([
            'message' => 'Portada actualizada exitosamente.',
            'cover_url' => $speaker->getFirstMediaUrl('cover'),
        ]);
    }

    public function updateCoverPosition(Request $request): JsonResponse
    {
        $request->validate([
            'cover_position' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $speaker = $request->user()->speaker;

        if (! $speaker) {
            throw new NotFoundHttpException('No tienes un perfil de conferencista.');
        }

        $speaker->update(['cover_position' => $request->cover_position]);

        return response()->json([
            'message' => 'Posicion actualizada.',
        ]);
    }

    public function uploadGallery(Request $request): JsonResponse
    {
        $request->validate([
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['image', 'mimes:jpeg,png,webp', 'max:2048'],
        ], [
            'images.required' => 'Debe subir al menos una imagen.',
            'images.*.image' => 'Cada archivo debe ser una imagen.',
            'images.*.mimes' => 'Las imágenes deben ser JPEG, PNG o WebP.',
            'images.*.max' => 'Cada imagen no debe superar los 2MB.',
        ]);

        $speaker = $request->user()->speaker;

        if (! $speaker) {
            throw new NotFoundHttpException('No tienes un perfil de conferencista.');
        }

        foreach ($request->file('images') as $image) {
            $speaker->addMedia($image)->toMediaCollection('gallery');
        }

        $galleryUrls = $speaker->getMedia('gallery')->map(fn ($media) => $media->getUrl());

        return response()->json([
            'message' => 'Galería actualizada exitosamente.',
            'gallery_urls' => $galleryUrls,
        ]);
    }
}
