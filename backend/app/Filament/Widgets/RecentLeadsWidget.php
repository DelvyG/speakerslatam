<?php

namespace App\Filament\Widgets;

use App\Models\CompanyLead;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class RecentLeadsWidget extends TableWidget
{
    protected static ?int $sort = 2;

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Leads Recientes de Empresas')
            ->query(
                CompanyLead::query()
                    ->latest()
                    ->limit(5)
            )
            ->defaultPaginationPageOption(5)
            ->columns([
                TextColumn::make('company_name')
                    ->label('Empresa')
                    ->searchable(),

                TextColumn::make('contact_name')
                    ->label('Contacto'),

                TextColumn::make('email')
                    ->label('Email'),

                TextColumn::make('event_type')
                    ->label('Tipo de Evento'),

                TextColumn::make('status')
                    ->label('Estado')
                    ->badge(),

                TextColumn::make('created_at')
                    ->label('Fecha')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ]);
    }
}
