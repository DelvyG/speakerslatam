<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaItem extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'title',
        'alt_text',
        'description',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('default')
            ->useDisk('public');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(200)
            ->height(200)
            ->sharpen(10)
            ->nonQueued();

        $this->addMediaConversion('preview')
            ->width(600)
            ->height(600)
            ->sharpen(10)
            ->nonQueued();
    }
}
