<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum ContactMessageStatus: string implements HasLabel, HasColor
{
    case New = 'new';
    case Read = 'read';
    case Replied = 'replied';
    case Archived = 'archived';

    public function getLabel(): string
    {
        return match ($this) {
            self::New => 'Nuevo',
            self::Read => 'Leido',
            self::Replied => 'Respondido',
            self::Archived => 'Archivado',
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::New => 'info',
            self::Read => 'warning',
            self::Replied => 'success',
            self::Archived => 'gray',
        };
    }
}
