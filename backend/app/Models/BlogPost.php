<?php

namespace App\Models;

use App\Enums\BlogPostStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class BlogPost extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'uuid',
        'speaker_id',
        'author_user_id',
        'title',
        'slug',
        'excerpt',
        'body',
        'status',
        'rejection_reason',
        'meta_title',
        'meta_description',
        'og_title',
        'og_description',
        'is_featured',
        'allow_comments',
        'reading_time_minutes',
        'views_count',
        'published_at',
        'scheduled_at',
        'reviewed_at',
        'reviewed_by',
    ];

    protected function casts(): array
    {
        return [
            'status' => BlogPostStatus::class,
            'is_featured' => 'boolean',
            'allow_comments' => 'boolean',
            'published_at' => 'datetime',
            'scheduled_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (BlogPost $post) {
            if (empty($post->uuid)) {
                $post->uuid = Str::uuid()->toString();
            }
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title);
            }
        });

        static::saving(function (BlogPost $post) {
            if ($post->body) {
                $wordCount = str_word_count(strip_tags($post->body));
                $post->reading_time_minutes = max(1, (int) ceil($wordCount / 200));
            }
        });
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('featured_image')->singleFile();
        $this->addMediaCollection('og_image')->singleFile();
        $this->addMediaCollection('content_images');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(400)
            ->height(250)
            ->sharpen(10)
            ->nonQueued();

        $this->addMediaConversion('hero')
            ->width(1200)
            ->height(630)
            ->sharpen(10)
            ->nonQueued();
    }

    // Relationships

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_user_id');
    }

    public function speaker(): BelongsTo
    {
        return $this->belongsTo(Speaker::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(BlogCategory::class);
    }

    // Scopes

    public function scopePublished($query)
    {
        return $query->where('status', BlogPostStatus::Published)
            ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeBySpeaker($query, $speakerId)
    {
        return $query->where('speaker_id', $speakerId);
    }

    public function scopePendingReview($query)
    {
        return $query->where('status', BlogPostStatus::PendingReview);
    }
}
