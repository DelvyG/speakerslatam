<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TestimonialResource\Pages;
use App\Models\Testimonial;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;

class TestimonialResource extends Resource
{
    protected static ?string $model = Testimonial::class;

    protected static ?string $modelLabel = 'Testimonio';

    protected static ?string $pluralModelLabel = 'Testimonios';

    protected static ?int $navigationSort = 1;

    public static function getNavigationIcon(): string|\BackedEnum|null
    {
        return 'heroicon-o-chat-bubble-left-right';
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Contenido';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Forms\Components\TextInput::make('company_name')
                    ->label('Empresa')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('contact_name')
                    ->label('Nombre del contacto')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('contact_role')
                    ->label('Cargo del contacto')
                    ->maxLength(255),
                Forms\Components\Textarea::make('quote')
                    ->label('Testimonio')
                    ->required()
                    ->rows(4)
                    ->columnSpanFull(),
                Forms\Components\Select::make('rating')
                    ->label('Calificacion')
                    ->options([
                        1 => '1 estrella',
                        2 => '2 estrellas',
                        3 => '3 estrellas',
                        4 => '4 estrellas',
                        5 => '5 estrellas',
                    ])
                    ->required(),
                Forms\Components\Toggle::make('is_featured')
                    ->label('Destacado'),
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
                Tables\Columns\TextColumn::make('rating')
                    ->label('Calificacion')
                    ->formatStateUsing(fn (int $state): string => str_repeat('*', $state))
                    ->sortable(),
                Tables\Columns\ToggleColumn::make('is_featured')
                    ->label('Destacado'),
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
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTestimonials::route('/'),
            'create' => Pages\CreateTestimonial::route('/create'),
            'edit' => Pages\EditTestimonial::route('/{record}/edit'),
        ];
    }
}
