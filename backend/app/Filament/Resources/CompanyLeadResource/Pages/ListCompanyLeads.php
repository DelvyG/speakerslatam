<?php

namespace App\Filament\Resources\CompanyLeadResource\Pages;

use App\Filament\Resources\CompanyLeadResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListCompanyLeads extends ListRecords
{
    protected static string $resource = CompanyLeadResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->label('Crear lead'),
        ];
    }
}
