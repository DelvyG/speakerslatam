<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SpeakerDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isOwner = $request->user()?->id === $this->user_id;

        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'bio_short' => $this->bio_short,
            'bio_long' => $this->bio_long,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'modality' => $this->modality?->value,
            'fee_range' => $this->fee_range,
            'experience_years' => $this->experience_years,
            'is_featured' => $this->is_featured,
            'is_verified' => $this->is_verified,
            'phone' => $this->when($isOwner, $this->phone),
            'linkedin_url' => $this->linkedin_url,
            'website_url' => $this->website_url,
            'video_url' => $this->video_url,
            'photo_url' => $this->getFirstMediaUrl('photo'),
            'cover_url' => $this->getFirstMediaUrl('cover'),
            'cover_position' => $this->cover_position ?? 50,
            'gallery_urls' => $this->getMedia('gallery')->map(fn ($media) => $media->getUrl()),
            'languages' => $this->whenLoaded('languages', fn () =>
                $this->languages->map(fn ($lang) => [
                    'id' => $lang->id,
                    'name' => $lang->name,
                    'code' => $lang->code,
                ])
            ),
            'categories' => $this->whenLoaded('categories', fn () =>
                $this->categories->map(fn ($cat) => [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                ])
            ),
            'topics' => $this->whenLoaded('topics', fn () =>
                $this->topics->map(fn ($topic) => [
                    'id' => $topic->id,
                    'name' => $topic->name,
                ])
            ),
            'active_membership' => $this->whenLoaded('activeMembership', fn () =>
                $this->activeMembership !== null
            ),
            'testimonials_count' => $this->whenCounted('testimonials'),
        ];
    }
}
