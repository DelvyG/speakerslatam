<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MembershipPlanResource\Pages;
use App\Models\MembershipPlan;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;

class MembershipPlanResource extends Resource
{
    protected static ?string $model = MembershipPlan::class;

    protected static ?string $modelLabel = 'Plan de membresia';
    protected static ?string $pluralModelLabel = 'Planes de membresia';
    protected static ?int $navigationSort = 1;

    public static function getNavigationIcon(): string|\BackedEnum|null
    {
        return 'heroicon-o-credit-card';
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Comercial';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Section::make('Plan')
                ->schema([
                    TextInput::make('name')->label('Nombre del plan')->required(),
                    TextInput::make('slug')->label('Slug')->required()->unique(ignoreRecord: true),
                    TextInput::make('price')->label('Precio')->numeric()->required()->prefix('$'),
                    TextInput::make('currency')->label('Moneda')->default('USD')->maxLength(3),
                    TextInput::make('duration_days')->label('Duracion (dias)')->numeric()->default(365),
                    TextInput::make('sort_order')->label('Orden')->numeric()->default(0),
                    Toggle::make('is_active')->label('Activo')->default(true),
                ])->columns(2),
            Section::make('Caracteristicas incluidas')
                ->schema([
                    Repeater::make('features')
                        ->label('')
                        ->simple(TextInput::make('feature')->label('Caracteristica'))
                        ->addActionLabel('Agregar caracteristica')
                        ->defaultItems(0),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Plan')->searchable(),
                Tables\Columns\TextColumn::make('price')->label('Precio')->money('USD'),
                Tables\Columns\TextColumn::make('duration_days')->label('Duracion')->suffix(' dias'),
                Tables\Columns\IconColumn::make('is_active')->label('Activo')->boolean(),
            ])
            ->actions([Actions\EditAction::make()])
            ->defaultSort('sort_order');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMembershipPlans::route('/'),
            'create' => Pages\CreateMembershipPlan::route('/create'),
            'edit' => Pages\EditMembershipPlan::route('/{record}/edit'),
        ];
    }
}
