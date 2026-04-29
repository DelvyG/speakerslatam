<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SpeakerListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'bio_short' => $this->bio_short,
            'city' => $this->city,
            'country' => $this->country,
            'modality' => $this->modality?->value,
            'fee_range' => $this->fee_range,
            'experience_years' => $this->experience_years,
            'is_featured' => $this->is_featured,
            'is_verified' => $this->is_verified,
            'photo_url' => $this->getFirstMediaUrl('photo'),
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
        ];
    }
}
