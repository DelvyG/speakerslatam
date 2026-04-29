<?php

namespace App\Filament\Resources\ConciergeRequestResource\Pages;

use App\Filament\Resources\ConciergeRequestResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListConciergeRequests extends ListRecords
{
    protected static string $resource = ConciergeRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->label('Crear solicitud'),
        ];
    }
}
