<?php

namespace App\Filament\Widgets;

use App\Enums\LeadStatus;
use App\Enums\MembershipStatus;
use App\Enums\SpeakerStatus;
use App\Models\CompanyLead;
use App\Models\Membership;
use App\Models\Speaker;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        $totalActiveSpeakers = Speaker::where('status', SpeakerStatus::Active)->count();

        $totalActiveMemberships = Membership::where('status', MembershipStatus::Active)->count();

        $newLeads = CompanyLead::where('status', LeadStatus::New)->count();

        $monthlyRevenue = Membership::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('amount_paid');

        return [
            Stat::make('Total Speakers', $totalActiveSpeakers)
                ->description('Conferencistas activos en la plataforma')
                ->icon('heroicon-o-microphone')
                ->color('success'),

            Stat::make('Membresías Activas', $totalActiveMemberships)
                ->description('Suscripciones vigentes')
                ->icon('heroicon-o-credit-card')
                ->color('primary'),

            Stat::make('Leads Nuevos', $newLeads)
                ->description('Solicitudes de empresas sin contactar')
                ->icon('heroicon-o-building-office')
                ->color('info'),

            Stat::make('Ingresos del Mes', '$' . number_format($monthlyRevenue, 2))
                ->description('Total facturado este mes')
                ->icon('heroicon-o-banknotes')
                ->color('warning'),
        ];
    }
}
