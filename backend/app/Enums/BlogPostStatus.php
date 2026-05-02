<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum BlogPostStatus: string implements HasLabel, HasColor
{
    case Draft = 'draft';
    case PendingReview = 'pending_review';
    case Scheduled = 'scheduled';
    case Published = 'published';
    case Rejected = 'rejected';

    public function getLabel(): string
    {
        return match ($this) {
            self::Draft => 'Borrador',
            self::PendingReview => 'En revision',
            self::Scheduled => 'Programado',
            self::Published => 'Publicado',
            self::Rejected => 'Rechazado',
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::Draft => 'gray',
            self::PendingReview => 'warning',
            self::Scheduled => 'info',
            self::Published => 'success',
            self::Rejected => 'danger',
        };
    }
}
