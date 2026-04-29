<?php

namespace App\Filament\Resources\CompanyLeadResource\Pages;

use App\Filament\Resources\CompanyLeadResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCompanyLead extends CreateRecord
{
    protected static string $resource = CompanyLeadResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
