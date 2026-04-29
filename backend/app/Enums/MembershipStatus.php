<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum MembershipStatus: string implements HasLabel, HasColor
{
    case Active = 'active';
    case Expired = 'expired';
    case Cancelled = 'cancelled';

    public function getLabel(): string
    {
        return match ($this) {
            self::Active => 'Activa',
            self::Expired => 'Expirada',
            self::Cancelled => 'Cancelada',
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::Active => 'success',
            self::Expired => 'danger',
            self::Cancelled => 'gray',
        };
    }
}
