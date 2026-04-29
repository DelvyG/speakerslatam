<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum AddonBillingType: string implements HasLabel
{
    case OneTime = 'one_time';
    case Monthly = 'monthly';
    case Yearly = 'yearly';

    public function getLabel(): string
    {
        return match ($this) {
            self::OneTime => 'Pago único',
            self::Monthly => 'Mensual',
            self::Yearly => 'Anual',
        };
    }
}
