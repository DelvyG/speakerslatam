<?php

namespace App\Filament\Resources\CompanyLeadResource\Pages;

use App\Filament\Resources\CompanyLeadResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCompanyLead extends EditRecord
{
    protected static string $resource = CompanyLeadResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
