<?php

namespace App\Filament\Resources;

use App\Enums\LeadStatus;
use App\Enums\Modality;
use App\Filament\Resources\CompanyLeadResource\Pages;
use App\Models\CompanyLead;
use Filament\Forms;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;

class CompanyLeadResource extends Resource
{
    protected static ?string $model = CompanyLead::class;

    protected static ?string $modelLabel = 'Lead de empresa';

    protected static ?string $pluralModelLabel = 'Leads de empresas';

    protected static ?int $navigationSort = 1;

    public static function getNavigationIcon(): string|\BackedEnum|null
    {
        return 'heroicon-o-building-office';
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Comercial';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Empresa')
                    ->schema([
                        Forms\Components\TextInput::make('company_name')
                            ->label('Nombre de la empresa')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('contact_name')
                            ->label('Nombre del contacto')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('email')
                            ->label('Correo electronico')
                            ->email()
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('phone')
                            ->label('Telefono')
                            ->tel()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('sector')
                            ->label('Sector')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('city')
                            ->label('Ciudad')
                            ->maxLength(255),
                    ])->columns(2),

                Section::make('Evento')
                    ->schema([
                        Forms\Components\TextInput::make('event_type')
                            ->label('Tipo de evento')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('event_topic')
                            ->label('Tema del evento')
                            ->maxLength(255),
                        Forms\Components\Textarea::make('audience_description')
                            ->label('Descripcion de la audiencia')
                            ->rows(3),
                        Forms\Components\TextInput::make('budget_range')
                            ->label('Rango de presupuesto')
                            ->maxLength(255),
                        Forms\Components\DatePicker::make('event_date')
                            ->label('Fecha del evento'),
                        Forms\Components\Select::make('modality')
                            ->label('Modalidad')
                            ->options(Modality::class),
                        Forms\Components\Textarea::make('message')
                            ->label('Mensaje')
                            ->rows(4)
                            ->columnSpanFull(),
                    ])->columns(2),

                Section::make('Estado')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Estado')
                            ->options(LeadStatus::class)
                            ->default(LeadStatus::New)
                            ->required(),
                        Forms\Components\TextInput::make('source')
                            ->label('Fuente')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('kommo_lead_id')
                            ->label('ID en Kommo')
                            ->maxLength(255),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('company_name')
                    ->label('Empresa')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('contact_name')
                    ->label('Contacto')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Correo')
                    ->searchable(),
                Tables\Columns\TextColumn::make('event_type')
                    ->label('Tipo de evento'),
                Tables\Columns\TextColumn::make('event_date')
                    ->label('Fecha evento')
                    ->date('d/m/Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estado')
                    ->badge(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estado')
                    ->options(LeadStatus::class),
                Tables\Filters\SelectFilter::make('source')
                    ->label('Fuente')
                    ->options(fn () => CompanyLead::query()->whereNotNull('source')->distinct()->pluck('source', 'source')->toArray()),
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
            'index' => Pages\ListCompanyLeads::route('/'),
            'create' => Pages\CreateCompanyLead::route('/create'),
            'edit' => Pages\EditCompanyLead::route('/{record}/edit'),
        ];
    }
}
