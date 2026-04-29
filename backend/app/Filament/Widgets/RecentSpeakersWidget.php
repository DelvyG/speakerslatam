<?php

namespace App\Filament\Widgets;

use App\Models\Speaker;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class RecentSpeakersWidget extends TableWidget
{
    protected static ?int $sort = 3;

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Conferencistas Registrados Recientemente')
            ->query(
                Speaker::query()
                    ->latest()
                    ->limit(5)
            )
            ->defaultPaginationPageOption(5)
            ->columns([
                TextColumn::make('full_name')
                    ->label('Nombre Completo')
                    ->state(fn (Speaker $record): string => "{$record->first_name} {$record->last_name}")
                    ->searchable(['first_name', 'last_name']),

                TextColumn::make('city')
                    ->label('Ciudad'),

                TextColumn::make('country')
                    ->label('País'),

                TextColumn::make('status')
                    ->label('Estado')
                    ->badge(),

                TextColumn::make('created_at')
                    ->label('Fecha de Registro')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ]);
    }
}
