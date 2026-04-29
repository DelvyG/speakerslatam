<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum Modality: string implements HasLabel
{
    case Presencial = 'presencial';
    case Virtual = 'virtual';
    case Both = 'both';

    public function getLabel(): string
    {
        return match ($this) {
            self::Presencial => 'Presencial',
            self::Virtual => 'Virtual',
            self::Both => 'Presencial y Virtual',
        };
    }
}
