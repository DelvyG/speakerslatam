<?php

namespace App\Models;

use App\Enums\AddonBillingType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Addon extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'billing_type',
        'is_active',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'billing_type' => AddonBillingType::class,
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(AddonPurchase::class);
    }
}
