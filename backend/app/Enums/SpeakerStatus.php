<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum SpeakerStatus: string implements HasLabel, HasColor
{
    case Pending = 'pending';
    case Active = 'active';
    case Inactive = 'inactive';
    case Rejected = 'rejected';

    public function getLabel(): string
    {
        return match ($this) {
            self::Pending => 'Pendiente',
            self::Active => 'Activo',
            self::Inactive => 'Inactivo',
            self::Rejected => 'Rechazado',
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::Pending => 'warning',
            self::Active => 'success',
            self::Inactive => 'gray',
            self::Rejected => 'danger',
        };
    }
}
