<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value', 'type', 'group'];

    public static function get(string $key, mixed $default = null): mixed
    {
        $settings = Cache::remember('site_settings', 3600, function () {
            return static::pluck('value', 'key')->toArray();
        });

        return $settings[$key] ?? $default;
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget('site_settings');
    }

    public static function getGroup(string $group): array
    {
        $settings = Cache::remember('site_settings', 3600, function () {
            return static::all()->groupBy('group')->map(function ($items) {
                return $items->pluck('value', 'key')->toArray();
            })->toArray();
        });

        return $settings[$group] ?? [];
    }

    public static function getAllPublic(): array
    {
        return Cache::remember('site_settings_public', 3600, function () {
            return static::pluck('value', 'key')->toArray();
        });
    }

    public static function clearCache(): void
    {
        Cache::forget('site_settings');
        Cache::forget('site_settings_public');
    }
}
