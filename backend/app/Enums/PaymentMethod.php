<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum PaymentMethod: string implements HasLabel
{
    case Stripe = 'stripe';
    case TransferLocal = 'transfer_local';

    public function getLabel(): string
    {
        return match ($this) {
            self::Stripe => 'Stripe',
            self::TransferLocal => 'Transferencia local',
        };
    }
}
