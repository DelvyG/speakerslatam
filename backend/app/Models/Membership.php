<?php

namespace App\Models;

use App\Enums\MembershipStatus;
use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Membership extends Model
{
    protected $fillable = [
        'speaker_id',
        'starts_at',
        'expires_at',
        'amount_paid',
        'currency',
        'payment_method',
        'stripe_payment_id',
        'status',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => MembershipStatus::class,
            'payment_method' => PaymentMethod::class,
            'starts_at' => 'datetime',
            'expires_at' => 'datetime',
            'amount_paid' => 'decimal:2',
        ];
    }

    public function speaker(): BelongsTo
    {
        return $this->belongsTo(Speaker::class);
    }

    public function isActive(): bool
    {
        return $this->status === MembershipStatus::Active && $this->expires_at->isFuture();
    }
}
