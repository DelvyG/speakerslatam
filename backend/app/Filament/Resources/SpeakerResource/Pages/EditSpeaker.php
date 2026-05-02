<?php

namespace App\Filament\Resources\SpeakerResource\Pages;

use App\Filament\Resources\SpeakerResource;
use App\Models\Speaker;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditSpeaker extends EditRecord
{
    protected static string $resource = SpeakerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()
                ->before(function () {
                    $speaker = $this->record;
                    if ($speaker->user) {
                        $speaker->user->tokens()->delete();
                        $speaker->user->delete();
                    }
                }),
        ];
    }
}
