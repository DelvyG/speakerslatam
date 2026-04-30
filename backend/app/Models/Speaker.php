<?php

namespace App\Models;

use App\Enums\Modality;
use App\Enums\SpeakerStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Speaker extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'user_id',
        'uuid',
        'slug',
        'first_name',
        'last_name',
        'bio_short',
        'bio_long',
        'city',
        'country',
        'phone',
        'linkedin_url',
        'website_url',
        'video_url',
        'modality',
        'fee_range',
        'experience_years',
        'cover_position',
        'is_featured',
        'is_verified',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => SpeakerStatus::class,
            'modality' => Modality::class,
            'is_featured' => 'boolean',
            'is_verified' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Speaker $speaker) {
            if (empty($speaker->uuid)) {
                $speaker->uuid = Str::uuid()->toString();
            }
            if (empty($speaker->slug)) {
                $speaker->slug = Str::slug($speaker->first_name . ' ' . $speaker->last_name);
            }
        });
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photo')->singleFile();
        $this->addMediaCollection('cover')->singleFile();
        $this->addMediaCollection('gallery');
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    // Relaciones
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function topics(): BelongsToMany
    {
        return $this->belongsToMany(Topic::class);
    }

    public function languages(): BelongsToMany
    {
        return $this->belongsToMany(Language::class);
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(Membership::class);
    }

    public function activeMembership(): HasOne
    {
        return $this->hasOne(Membership::class)->where('status', 'active')->latest();
    }

    public function addonPurchases(): HasMany
    {
        return $this->hasMany(AddonPurchase::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', SpeakerStatus::Active);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }
}
