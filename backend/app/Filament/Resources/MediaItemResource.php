<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MediaItemResource\Pages;
use App\Models\MediaItem;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;

class MediaItemResource extends Resource
{
    protected static ?string $model = MediaItem::class;

    protected static ?string $modelLabel = 'Archivo';

    protected static ?string $pluralModelLabel = 'Biblioteca de Medios';

    protected static ?int $navigationSort = 1;

    public static function getNavigationIcon(): string|\BackedEnum|null
    {
        return 'heroicon-o-photo';
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Contenido';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Archivo')
                    ->schema([
                        SpatieMediaLibraryFileUpload::make('file')
                            ->label('Archivo')
                            ->collection('default')
                            ->acceptedFileTypes([
                                'image/jpeg',
                                'image/png',
                                'image/gif',
                                'image/webp',
                                'image/svg+xml',
                                'application/pdf',
                                'application/msword',
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            ])
                            ->maxSize(10240)
                            ->imagePreviewHeight('200')
                            ->columnSpanFull(),
                    ]),

                Section::make('Informacion')
                    ->schema([
                        TextInput::make('title')
                            ->label('Titulo')
                            ->helperText('Nombre descriptivo del archivo.')
                            ->maxLength(255),
                        TextInput::make('alt_text')
                            ->label('Texto alternativo (ALT)')
                            ->helperText('Descripcion de la imagen para accesibilidad y SEO.')
                            ->maxLength(255),
                        Textarea::make('description')
                            ->label('Descripcion')
                            ->helperText('Descripcion detallada del archivo.')
                            ->rows(3),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                SpatieMediaLibraryImageColumn::make('file')
                    ->label('Preview')
                    ->collection('default')
                    ->conversion('thumb')
                    ->circular(false)
                    ->width(80)
                    ->height(60),
                Tables\Columns\TextColumn::make('title')
                    ->label('Titulo')
                    ->searchable()
                    ->placeholder('Sin titulo'),
                Tables\Columns\TextColumn::make('media.file_name')
                    ->label('Archivo')
                    ->searchable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('media.mime_type')
                    ->label('Tipo')
                    ->badge()
                    ->color(fn (string $state): string => match (true) {
                        str_contains($state, 'image') => 'success',
                        str_contains($state, 'pdf') => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('media.size')
                    ->label('Tamano')
                    ->formatStateUsing(fn ($state) => $state ? number_format($state / 1024, 0) . ' KB' : '-'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Subido')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([])
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
            'index' => Pages\ListMediaItems::route('/'),
            'create' => Pages\CreateMediaItem::route('/create'),
            'edit' => Pages\EditMediaItem::route('/{record}/edit'),
        ];
    }
}
