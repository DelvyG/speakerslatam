<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasLabel;

enum LeadStatus: string implements HasLabel, HasColor
{
    case New = 'new';
    case Contacted = 'contacted';
    case ProposalSent = 'proposal_sent';
    case ClosedWon = 'closed_won';
    case ClosedLost = 'closed_lost';

    public function getLabel(): string
    {
        return match ($this) {
            self::New => 'Nuevo',
            self::Contacted => 'Contactado',
            self::ProposalSent => 'Propuesta enviada',
            self::ClosedWon => 'Cerrado ganado',
            self::ClosedLost => 'Cerrado perdido',
        };
    }

    public function getColor(): string|array|null
    {
        return match ($this) {
            self::New => 'info',
            self::Contacted => 'warning',
            self::ProposalSent => 'primary',
            self::ClosedWon => 'success',
            self::ClosedLost => 'danger',
        };
    }
}
