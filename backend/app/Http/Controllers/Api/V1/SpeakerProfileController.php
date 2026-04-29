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
