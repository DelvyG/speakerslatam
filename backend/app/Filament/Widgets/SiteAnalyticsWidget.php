<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class SiteAnalyticsWidget extends StatsOverviewWidget
{
    protected static ?int $sort = 4;

    protected int | string | array $columnSpan = 'full';

    protected ?string $heading = 'Analíticas del Sitio';

    protected function getStats(): array
    {
        try {
            $today = now()->toDateString();
            $monthStart = now()->startOfMonth()->toDateString();

            $viewsToday = DB::table('page_views')
                ->whereDate('created_at', $today)
                ->count();

            $viewsThisMonth = DB::table('page_views')
                ->whereDate('created_at', '>=', $monthStart)
                ->count();

            $uniqueVisitorsToday = DB::table('page_views')
                ->whereDate('created_at', $today)
                ->distinct('ip_address')
                ->count('ip_address');

            $totalPagesTracked = DB::table('page_views')
                ->distinct('path')
                ->count('path');
        } catch (\Exception $e) {
            $viewsToday = 0;
            $viewsThisMonth = 0;
            $uniqueVisitorsToday = 0;
            $totalPagesTracked = 0;
        }

        return [
            Stat::make('Visitas Hoy', $viewsToday)
                ->description('Páginas vistas hoy')
                ->icon('heroicon-o-eye')
                ->color('primary'),

            Stat::make('Visitas Este Mes', $viewsThisMonth)
                ->description('Páginas vistas en el mes actual')
                ->icon('heroicon-o-chart-bar')
                ->color('success'),

            Stat::make('Visitantes Únicos Hoy', $uniqueVisitorsToday)
                ->description('IPs únicas registradas hoy')
                ->icon('heroicon-o-users')
                ->color('info'),

            Stat::make('Páginas Rastreadas', $totalPagesTracked)
                ->description('Total de rutas distintas registradas')
                ->icon('heroicon-o-document-text')
                ->color('warning'),
        ];
    }
}
