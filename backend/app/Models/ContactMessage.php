<?php

namespace App\Models;

use App\Enums\ContactMessageStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ContactMessage extends Model
{
    protected $fillable = [
        'uuid',
        'name',
        'email',
        'subject',
        'message',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => ContactMessageStatus::class,
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (ContactMessage $msg) {
            if (empty($msg->uuid)) {
                $msg->uuid = Str::uuid()->toString();
            }
        });
    }
}
