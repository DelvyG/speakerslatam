<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogPostDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'body' => $this->body,
            'status' => $this->status->value,
            'status_label' => $this->status->getLabel(),
            'rejection_reason' => $this->rejection_reason,
            'featured_image_url' => $this->getFirstMediaUrl('featured_image') ?: null,
            'featured_image_hero_url' => $this->getFirstMediaUrl('featured_image', 'hero') ?: null,
            'og_image_url' => $this->getFirstMediaUrl('og_image') ?: $this->getFirstMediaUrl('featured_image', 'hero') ?: null,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'og_title' => $this->og_title,
            'og_description' => $this->og_description,
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
            'allow_comments' => $this->allow_comments,
            'reading_time_minutes' => $this->reading_time_minutes,
            'views_count' => $this->views_count,
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
