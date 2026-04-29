<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ConciergeRequestResource\Pages;
use App\Models\ConciergeRequest;
use App\Models\Speaker;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;

class ConciergeRequestResource extends Resource
{
    protected static ?string $model = ConciergeRequest::class;

    protected static ?string $modelLabel = 'Solicitud concierge';

    protected static ?string $pluralModelLabel = 'Solicitudes concierge';

    protected static ?int $navigationSort = 2;

    public static function getNavigationIcon(): string|\BackedEnum|null
    {
        return 'heroicon-o-clipboard-document-list';
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Comercial';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Forms\Components\Section::make('Lead asociado')
                    ->schema([
                        Forms\Components\Select::make('company_lead_id')
                            ->label('Lead de empresa')
                            ->relationship('companyLead', 'company_name')
                            ->searchable()
                            ->preload()
                            ->required(),
                    ]),

                Forms\Components\Section::make('Conferencistas')
                    ->schema([
                        Forms\Components\Select::make('proposed_speaker_ids')
                            ->label('Conferencistas propuestos')
                            ->multiple()
                            ->options(fn () => Speaker::query()->get()->mapWithKeys(fn ($s) => [$s->id => "{$s->first_name} {$s->last_name}"])->toArray())
                            ->searchable(),
                        Forms\Components\Select::make('selected_speaker_id')
                            ->label('Conferencista seleccionado')
                            ->relationship('selectedSpeaker', 'first_name')
                            ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->first_name} {$record->last_name}")
                            ->searchable(['first_name', 'last_name'])
                            ->preload(),
                    ]),

                Forms\Components\Section::make('Informacion financiera')
                    ->schema([
                        Forms\Components\TextInput::make('contract_value')
                            ->label('Valor del contrato')
                            ->numeric()
                            ->prefix('$'),
                        Forms\Components\TextInput::make('commission_rate')
                            ->label('Tasa de comision (%)')
                            ->numeric()
                            ->suffix('%'),
                        Forms\Components\TextInput::make('commission_amount')
                            ->label('Monto de comision')
                            ->numeric()
                            ->prefix('$'),
                        Forms\Components\DateTimePicker::make('closed_at')
                            ->label('Fecha de cierre'),
                    ])->columns(2),

                Forms\Components\Section::make('Notas')
                    ->schema([
                        Forms\Components\Textarea::make('admin_notes')
                            ->label('Notas del administrador')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('companyLead.company_name')
                    ->label('Empresa')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('contract_value')
                    ->label('Valor contrato')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('commission_amount')
                    ->label('Comision')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('closed_at')
                    ->label('Cerrado')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->placeholder('Abierto'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListConciergeRequests::route('/'),
            'create' => Pages\CreateConciergeRequest::route('/create'),
            'edit' => Pages\EditConciergeRequest::route('/{record}/edit'),
        ];
    }
}
