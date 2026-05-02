<?php

namespace App\Filament\Resources;

use App\Enums\Modality;
use App\Enums\SpeakerStatus;
use App\Filament\Resources\SpeakerResource\Pages;
use App\Models\Category;
use App\Models\Language;
use App\Models\Speaker;
use App\Models\Topic;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Resources\Resource;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Table;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Illuminate\Database\Eloquent\Model;

class SpeakerResource extends Resource
{
    protected static ?string $model = Speaker::class;

    protected static ?string $modelLabel = 'Conferencista';

    protected static ?string $pluralModelLabel = 'Conferencistas';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'first_name';

    public static function getGloballySearchableAttributes(): array
    {
        return ['first_name', 'last_name', 'city', 'country', 'bio_short'];
    }

    public static function getGlobalSearchResultDetails(Model $record): array
    {
        return [
            'Ciudad' => $record->city . ', ' . $record->country,
            'Estado' => $record->status->getLabel(),
        ];
    }

    public static function getNavigationIcon(): string|\BackedEnum|null
    {
        return 'heroicon-o-microphone';
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Conferencistas';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Section::make('Informacion personal')
                    ->schema([
                        Forms\Components\TextInput::make('first_name')
                            ->label('Nombre')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('last_name')
                            ->label('Apellido')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('slug')
                            ->label('Slug')
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Forms\Components\TextInput::make('city')
                            ->label('Ciudad')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('country')
                            ->label('Pais')
                            ->default('Venezuela')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('phone')
                            ->label('Telefono')
                            ->tel()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('linkedin_url')
                            ->label('LinkedIn')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('website_url')
                            ->label('Sitio web')
                            ->url()
                            ->maxLength(255),
                    ])->columns(2),

                Section::make('Informacion profesional')
                    ->schema([
                        Forms\Components\Textarea::make('bio_short')
                            ->label('Bio corta')
                            ->maxLength(300)
                            ->rows(3),
                        Forms\Components\RichEditor::make('bio_long')
                            ->label('Bio completa')
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('video_url')
                            ->label('Video de presentacion')
                            ->url()
                            ->maxLength(255),
                        Forms\Components\Select::make('modality')
                            ->label('Modalidad')
                            ->options(Modality::class)
                            ->required(),
                        Forms\Components\TextInput::make('fee_range')
                            ->label('Rango de tarifa')
                            ->maxLength(255),
                        Forms\Components\TextInput::make('experience_years')
                            ->label('Anos de experiencia')
                            ->numeric()
                            ->minValue(0),
                    ])->columns(2),

                Section::make('Medios')
                    ->schema([
                        SpatieMediaLibraryFileUpload::make('photo')
                            ->label('Foto de perfil')
                            ->collection('photo')
                            ->image()
                            ->imageEditor()
                            ->imagePreviewHeight('200')
                            ->responsiveImages()
                            ->columnSpanFull(),
                        SpatieMediaLibraryFileUpload::make('gallery')
                            ->label('Galeria de imagenes')
                            ->collection('gallery')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->imagePreviewHeight('150')
                            ->panelLayout('grid')
                            ->columnSpanFull(),
                    ]),

                Section::make('Categorias, temas e idiomas')
                    ->schema([
                        Forms\Components\Select::make('categories')
                            ->label('Categorias')
                            ->relationship('categories', 'name')
                            ->multiple()
                            ->preload()
                            ->searchable(),
                        Forms\Components\Select::make('topics')
                            ->label('Temas')
                            ->relationship('topics', 'name')
                            ->multiple()
                            ->preload()
                            ->searchable(),
                        Forms\Components\Select::make('languages')
                            ->label('Idiomas')
                            ->relationship('languages', 'name')
                            ->multiple()
                            ->preload()
                            ->searchable(),
                    ])->columns(3),

                Section::make('Estado y visibilidad')
                    ->schema([
                        Forms\Components\Placeholder::make('user_email')
                            ->label('Cuenta de usuario')
                            ->content(fn (?Speaker $record) => $record?->user?->email ?? 'Sin cuenta asociada'),
                        Forms\Components\Select::make('status')
                            ->label('Estado')
                            ->options(SpeakerStatus::class)
                            ->default(SpeakerStatus::Pending)
                            ->required(),
                        Forms\Components\Toggle::make('is_featured')
                            ->label('Destacado'),
                        Forms\Components\Toggle::make('is_verified')
                            ->label('Verificado'),
                        Forms\Components\DateTimePicker::make('published_at')
                            ->label('Fecha de publicacion'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                SpatieMediaLibraryImageColumn::make('photo')
                    ->label('')
                    ->collection('photo')
                    ->circular()
                    ->size(36),
                Tables\Columns\TextColumn::make('first_name')
                    ->label('Nombre')
                    ->formatStateUsing(fn (Model $record) => $record->full_name)
                    ->description(fn (Model $record) => $record->user?->email)
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('city')
                    ->label('Ubicacion')
                    ->formatStateUsing(fn (Model $record) => $record->city ? "{$record->city}, {$record->country}" : $record->country)
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estado')
                    ->badge(),
                Tables\Columns\TextColumn::make('activeMembership.status')
                    ->label('Membresia')
                    ->badge()
                    ->default('Sin membresia'),
                Tables\Columns\ToggleColumn::make('is_verified')
                    ->label('Verificado'),
                Tables\Columns\ToggleColumn::make('is_featured')
                    ->label('Destacado')
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('modality')
                    ->label('Modalidad')
                    ->badge()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('experience_years')
                    ->label('Experiencia')
                    ->suffix(' anos')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estado')
                    ->options(SpeakerStatus::class),
                Tables\Filters\SelectFilter::make('country')
                    ->label('Pais')
                    ->options(fn () => Speaker::query()->distinct()->pluck('country', 'country')->toArray()),
                Tables\Filters\SelectFilter::make('city')
                    ->label('Ciudad')
                    ->options(fn () => Speaker::query()->whereNotNull('city')->distinct()->pluck('city', 'city')->toArray()),
                Tables\Filters\SelectFilter::make('modality')
                    ->label('Modalidad')
                    ->options(Modality::class),
                Tables\Filters\SelectFilter::make('languages')
                    ->label('Idioma')
                    ->relationship('languages', 'name')
                    ->multiple()
                    ->preload(),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Destacado'),
                Tables\Filters\TernaryFilter::make('is_verified')
                    ->label('Verificado'),
                Tables\Filters\SelectFilter::make('categories')
                    ->label('Categoria')
                    ->relationship('categories', 'name')
                    ->multiple()
                    ->preload(),
                Tables\Filters\Filter::make('experience_range')
                    ->label('Rango de experiencia')
                    ->form([
                        Forms\Components\TextInput::make('experience_min')
                            ->label('Minimo anos')
                            ->numeric()
                            ->minValue(0),
                        Forms\Components\TextInput::make('experience_max')
                            ->label('Maximo anos')
                            ->numeric()
                            ->minValue(0),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['experience_min'] ?? null, fn ($q, $min) => $q->where('experience_years', '>=', $min))
                            ->when($data['experience_max'] ?? null, fn ($q, $max) => $q->where('experience_years', '<=', $max));
                    }),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\DeleteAction::make()
                    ->before(function (Speaker $record) {
                        // Cascade: delete associated user account
                        if ($record->user) {
                            $record->user->tokens()->delete();
                            $record->user->delete();
                        }
                    }),
            ])
            ->bulkActions([
                Actions\BulkActionGroup::make([
                    Actions\DeleteBulkAction::make()
                        ->before(function (\Illuminate\Database\Eloquent\Collection $records) {
                            foreach ($records as $record) {
                                if ($record->user) {
                                    $record->user->tokens()->delete();
                                    $record->user->delete();
                                }
                            }
                        }),
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
            'index' => Pages\ListSpeakers::route('/'),
            'create' => Pages\CreateSpeaker::route('/create'),
            'edit' => Pages\EditSpeaker::route('/{record}/edit'),
        ];
    }
}
