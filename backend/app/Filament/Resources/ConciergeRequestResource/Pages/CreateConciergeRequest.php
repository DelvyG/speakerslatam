<?php

namespace App\Filament\Resources\ConciergeRequestResource\Pages;

use App\Filament\Resources\ConciergeRequestResource;
use Filament\Resources\Pages\CreateRecord;

class CreateConciergeRequest extends CreateRecord
{
    protected static string $resource = ConciergeRequestResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
