<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum MembershipStatus: string implements HasLabel, HasColor
{
    case Pending = 'pending';
    case Active = 'active';
    case Expired = 'expired';
    case Rejected = 'rejected';
    case Cancelled = 'cancelled';

    public function getLabel(): string
    {
        return match ($this) {
            self::Pending => 'Pendiente de pago',
            self::Active => 'Activa',
            self::Expired => 'Expirada',
            self::Rejected => 'Rechazada',
            self::Cancelled => 'Cancelada',
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::Pending => 'warning',
            self::Active => 'success',
            self::Expired => 'danger',
            self::Rejected => 'danger',
            self::Cancelled => 'gray',
        };
    }
}
