<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'status' => $this->status->value,
            'status_label' => $this->status->getLabel(),
            'featured_image_url' => $this->getFirstMediaUrl('featured_image', 'thumb') ?: null,
            'featured_image_hero_url' => $this->getFirstMediaUrl('featured_image', 'hero') ?: null,
            'author_name' => $this->author?->name,
            'speaker' => $this->when($this->speaker_id, fn () => [
                'name' => $this->speaker?->full_name,
                'slug' => $this->speaker?->slug,
                'photo_url' => $this->speaker?->getFirstMediaUrl('photo'),
            ]),
            'categories' => $this->whenLoaded('categories', fn () =>
                $this->categories->map(fn ($cat) => [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                ])
            ),
            'is_featured' => $this->is_featured,
            'reading_time_minutes' => $this->reading_time_minutes,
            'views_count' => $this->views_count,
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
