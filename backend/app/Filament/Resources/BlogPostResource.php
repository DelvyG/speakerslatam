<?php

namespace App\Filament\Resources;

use App\Enums\BlogPostStatus;
use App\Filament\Resources\BlogPostResource\Pages;
use App\Models\BlogPost;
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
use Illuminate\Support\Str;

class BlogPostResource extends Resource
{
    protected static ?string $model = BlogPost::class;

    protected static ?string $modelLabel = 'Articulo';

    protected static ?string $pluralModelLabel = 'Articulos';

    protected static ?int $navigationSort = 1;

    protected static ?string $recordTitleAttribute = 'title';

    public static function getNavigationIcon(): string|\BackedEnum|null
    {
        return 'heroicon-o-newspaper';
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Blog';
    }

    public static function getNavigationBadge(): ?string
    {
        $count = BlogPost::where('status', BlogPostStatus::PendingReview)->count();
        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function getGloballySearchableAttributes(): array
    {
        return ['title', 'excerpt', 'body'];
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Forms\Components\Grid::make(3)
                    ->schema([
                        // Main content (2/3)
                        Forms\Components\Grid::make(1)
                            ->schema([
                                Section::make('Contenido')
                                    ->schema([
                                        Forms\Components\TextInput::make('title')
                                            ->label('Titulo')
                                            ->required()
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(function ($state, callable $set, ?Model $record) {
                                                if (! $record) {
                                                    $set('slug', Str::slug($state));
                                                }
                                            }),
                                        Forms\Components\TextInput::make('slug')
                                            ->label('URL amigable')
                                            ->required()
                                            ->unique(ignoreRecord: true)
                                            ->maxLength(255)
                                            ->prefix('/blog/'),
                                        Forms\Components\Textarea::make('excerpt')
                                            ->label('Extracto')
                                            ->helperText('Resumen corto que aparece en listados y SEO (max 500 caracteres)')
                                            ->maxLength(500)
                                            ->rows(3),
                                        Forms\Components\RichEditor::make('body')
                                            ->label('Contenido')
                                            ->required()
                                            ->columnSpanFull()
                                            ->fileAttachmentsDisk('public')
                                            ->fileAttachmentsDirectory('blog-content-images')
                                            ->toolbarButtons([
                                                'bold', 'italic', 'underline', 'strike',
                                                'link', 'h2', 'h3',
                                                'bulletList', 'orderedList', 'blockquote',
                                                'attachFiles',
                                                'redo', 'undo',
                                            ]),
                                    ]),
                            ])
                            ->columnSpan(2),

                        // Sidebar (1/3)
                        Forms\Components\Grid::make(1)
                            ->schema([
                                Section::make('Publicacion')
                                    ->schema([
                                        Forms\Components\Select::make('status')
                                            ->label('Estado')
                                            ->options(BlogPostStatus::class)
                                            ->default(BlogPostStatus::Draft)
                                            ->required()
                                            ->reactive(),
                                        Forms\Components\DateTimePicker::make('published_at')
                                            ->label('Fecha de publicacion')
                                            ->visible(fn (callable $get) => in_array($get('status'), [
                                                BlogPostStatus::Published->value,
                                                BlogPostStatus::Published,
                                                'published',
                                            ])),
                                        Forms\Components\DateTimePicker::make('scheduled_at')
                                            ->label('Programar para')
                                            ->visible(fn (callable $get) => in_array($get('status'), [
                                                BlogPostStatus::Scheduled->value,
                                                BlogPostStatus::Scheduled,
                                                'scheduled',
                                            ])),
                                        Forms\Components\Placeholder::make('author_info')
                                            ->label('Autor')
                                            ->content(fn (?BlogPost $record) => $record?->author?->name ?? 'Tu (admin)'),
                                        Forms\Components\Placeholder::make('speaker_info')
                                            ->label('Speaker')
                                            ->content(fn (?BlogPost $record) => $record?->speaker?->full_name ?? '—')
                                            ->visible(fn (?BlogPost $record) => $record?->speaker_id !== null),
                                        Forms\Components\Textarea::make('rejection_reason')
                                            ->label('Razon del rechazo')
                                            ->rows(3)
                                            ->visible(fn (callable $get) => in_array($get('status'), [
                                                BlogPostStatus::Rejected->value,
                                                BlogPostStatus::Rejected,
                                                'rejected',
                                            ])),
                                    ]),

                                Section::make('Imagen destacada')
                                    ->schema([
                                        SpatieMediaLibraryFileUpload::make('featured_image')
                                            ->label('')
                                            ->collection('featured_image')
                                            ->image()
                                            ->imageEditor()
                                            ->imagePreviewHeight('200')
                                            ->responsiveImages(),
                                    ]),

                                Section::make('Categorias')
                                    ->schema([
                                        Forms\Components\Select::make('categories')
                                            ->label('')
                                            ->relationship('categories', 'name')
                                            ->multiple()
                                            ->preload()
                                            ->searchable(),
                                    ]),

                                Section::make('SEO')
                                    ->collapsed()
                                    ->schema([
                                        Forms\Components\TextInput::make('meta_title')
                                            ->label('Titulo SEO')
                                            ->maxLength(70)
                                            ->helperText('Si se deja vacio, se usa el titulo del articulo'),
                                        Forms\Components\Textarea::make('meta_description')
                                            ->label('Descripcion SEO')
                                            ->maxLength(160)
                                            ->rows(2)
                                            ->helperText('Si se deja vacio, se usa el extracto'),
                                        Forms\Components\TextInput::make('og_title')
                                            ->label('Titulo OpenGraph')
                                            ->maxLength(255),
                                        Forms\Components\Textarea::make('og_description')
                                            ->label('Descripcion OpenGraph')
                                            ->maxLength(300)
                                            ->rows(2),
                                        SpatieMediaLibraryFileUpload::make('og_image')
                                            ->label('Imagen OpenGraph')
                                            ->collection('og_image')
                                            ->image()
                                            ->helperText('1200x630px recomendado'),
                                    ]),

                                Section::make('Opciones')
                                    ->collapsed()
                                    ->schema([
                                        Forms\Components\Toggle::make('is_featured')
                                            ->label('Destacado'),
                                        Forms\Components\Toggle::make('allow_comments')
                                            ->label('Permitir comentarios')
                                            ->default(true),
                                        Forms\Components\Placeholder::make('reading_time')
                                            ->label('Tiempo de lectura')
                                            ->content(fn (?BlogPost $record) => $record?->reading_time_minutes
                                                ? "{$record->reading_time_minutes} min"
                                                : 'Se calculara al guardar'),
                                        Forms\Components\Placeholder::make('views')
                                            ->label('Vistas')
                                            ->content(fn (?BlogPost $record) => number_format($record?->views_count ?? 0)),
                                    ]),
                            ])
                            ->columnSpan(1),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                SpatieMediaLibraryImageColumn::make('featured_image')
                    ->label('')
                    ->collection('featured_image')
                    ->conversion('thumb')
                    ->width(80)
                    ->height(50)
                    ->defaultImageUrl(fn () => ''),
                Tables\Columns\TextColumn::make('title')
                    ->label('Titulo')
                    ->description(fn (BlogPost $record) => $record->author?->name ?? '')
                    ->searchable()
                    ->sortable()
                    ->limit(50),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estado')
                    ->badge(),
                Tables\Columns\TextColumn::make('categories.name')
                    ->label('Categorias')
                    ->badge()
                    ->separator(','),
                Tables\Columns\TextColumn::make('published_at')
                    ->label('Publicado')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('views_count')
                    ->label('Vistas')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\ToggleColumn::make('is_featured')
                    ->label('Destacado')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estado')
                    ->options(BlogPostStatus::class),
                Tables\Filters\SelectFilter::make('categories')
                    ->label('Categoria')
                    ->relationship('categories', 'name')
                    ->multiple()
                    ->preload(),
                Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Destacado'),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\Action::make('aprobar')
                    ->label('Aprobar')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Aprobar articulo')
                    ->modalDescription('Este articulo sera publicado inmediatamente.')
                    ->action(function (BlogPost $record) {
                        $record->update([
                            'status' => BlogPostStatus::Published,
                            'published_at' => $record->published_at ?? now(),
                            'reviewed_at' => now(),
                            'reviewed_by' => auth()->id(),
                        ]);
                    })
                    ->visible(fn (BlogPost $record) => $record->status === BlogPostStatus::PendingReview),
                Actions\Action::make('rechazar')
                    ->label('Rechazar')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->form([
                        Forms\Components\Textarea::make('rejection_reason')
                            ->label('Razon del rechazo')
                            ->required()
                            ->rows(3),
                    ])
                    ->action(function (BlogPost $record, array $data) {
                        $record->update([
                            'status' => BlogPostStatus::Rejected,
                            'rejection_reason' => $data['rejection_reason'],
                            'reviewed_at' => now(),
                            'reviewed_by' => auth()->id(),
                        ]);
                    })
                    ->visible(fn (BlogPost $record) => $record->status === BlogPostStatus::PendingReview),
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
            'index' => Pages\ListBlogPosts::route('/'),
            'create' => Pages\CreateBlogPost::route('/create'),
            'edit' => Pages\EditBlogPost::route('/{record}/edit'),
        ];
    }
}
