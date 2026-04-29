<?php

namespace App\Filament\Resources\ConciergeRequestResource\Pages;

use App\Filament\Resources\ConciergeRequestResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditConciergeRequest extends EditRecord
{
    protected static string $resource = ConciergeRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
