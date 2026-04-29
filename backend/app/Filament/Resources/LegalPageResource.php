<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LegalPageResource\Pages;
use App\Models\LegalPage;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;

class LegalPageResource extends Resource
{
    protected static ?string $model = LegalPage::class;

    protected static ?string $modelLabel = 'Pagina legal';

    protected static ?string $pluralModelLabel = 'Paginas legales';

    protected static ?int $navigationSort = 5;

    public static function getNavigationIcon(): string|\BackedEnum|null
    {
        return 'heroicon-o-document-text';
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Contenido';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Forms\Components\Section::make('Pagina')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->label('Titulo')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('slug')
                            ->label('Slug (identificador)')
                            ->required()
                            ->maxLength(100)
                            ->disabled(fn ($record) => $record !== null)
                            ->helperText('No modificar. Se usa internamente para identificar la pagina.'),
                        Forms\Components\RichEditor::make('content')
                            ->label('Contenido')
                            ->required()
                            ->columnSpanFull()
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'underline',
                                'strike',
                                'link',
                                'orderedList',
                                'bulletList',
                                'h2',
                                'h3',
                                'blockquote',
                                'redo',
                                'undo',
                            ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Titulo')
                    ->searchable(),
                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug')
                    ->badge()
                    ->color('gray'),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Ultima edicion')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->actions([
                Actions\EditAction::make(),
            ])
            ->defaultSort('title');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLegalPages::route('/'),
            'edit' => Pages\EditLegalPage::route('/{record}/edit'),
        ];
    }
}
