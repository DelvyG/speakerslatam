<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\RecentLeadsWidget;
use App\Filament\Widgets\RecentSpeakersWidget;
use App\Filament\Widgets\SiteAnalyticsWidget;
use App\Filament\Widgets\StatsOverview;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    public function getWidgets(): array
    {
        return [
            StatsOverview::class,
            SiteAnalyticsWidget::class,
            RecentLeadsWidget::class,
            RecentSpeakersWidget::class,
        ];
    }
}
