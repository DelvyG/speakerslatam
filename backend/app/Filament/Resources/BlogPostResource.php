<?php

namespace App\Filament\Resources;

use App\Enums\BlogPostStatus;
use App\Filament\Resources\BlogPostResource\Pages;
use App\Models\BlogPost;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Grid;
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
            ->columns(1)
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
                            })
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('slug')
                            ->label('URL amigable')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255)
                            ->prefix('/blog/')
                            ->columnSpanFull(),
                        Forms\Components\Textarea::make('excerpt')
                            ->label('Extracto')
                            ->helperText('Resumen corto para listados y SEO (max 500 caracteres)')
                            ->maxLength(500)
                            ->rows(4)
                            ->columnSpanFull(),
                        Forms\Components\RichEditor::make('body')
                            ->label('Contenido del articulo')
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

                Section::make('Imagen y categorias')
                    ->schema([
                        SpatieMediaLibraryFileUpload::make('featured_image')
                            ->label('Imagen destacada')
                            ->collection('featured_image')
                            ->image()
                            ->imageEditor()
                            ->imagePreviewHeight('200')
                            ->responsiveImages()
                            ->columnSpan(1),
                        Forms\Components\Select::make('categories')
                            ->label('Categorias')
                            ->relationship('categories', 'name')
                            ->multiple()
                            ->preload()
                            ->searchable()
                            ->columnSpan(1),
                    ])->columns(2),

                Section::make('Publicacion')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Estado')
                            ->options([
                                'draft' => 'Borrador',
                                'published' => 'Publicar ahora',
                                'scheduled' => 'Programar publicacion',
                            ])
                            ->default('draft')
                            ->required()
                            ->reactive(),
                        Forms\Components\Select::make('author_user_id')
                            ->label('Autor')
                            ->relationship('author', 'name')
                            ->searchable()
                            ->preload()
                            ->default(fn () => auth()->id())
                            ->required(),
                        Forms\Components\DateTimePicker::make('published_at')
                            ->label('Fecha de publicacion')
                            ->default(now())
                            ->visible(fn (callable $get) => $get('status') === 'published'),
                        Forms\Components\DateTimePicker::make('scheduled_at')
                            ->label('Programar para')
                            ->minDate(now())
                            ->required()
                            ->visible(fn (callable $get) => $get('status') === 'scheduled'),
                        Forms\Components\Textarea::make('rejection_reason')
                            ->label('Razon del rechazo')
                            ->rows(2)
                            ->columnSpanFull()
                            ->visible(fn (callable $get) => $get('status') === 'rejected'),
                        Forms\Components\Toggle::make('is_featured')
                            ->label('Articulo destacado'),
                        Forms\Components\Toggle::make('allow_comments')
                            ->label('Permitir comentarios')
                            ->default(true),
                    ])->columns(2),

                Section::make('SEO (opcional)')
                    ->collapsed()
                    ->schema([
                        Forms\Components\TextInput::make('meta_title')
                            ->label('Titulo SEO')
                            ->maxLength(70)
                            ->helperText('Si se deja vacio, se usa el titulo del articulo'),
                        Forms\Components\TextInput::make('og_title')
                            ->label('Titulo OpenGraph')
                            ->maxLength(255),
                        Forms\Components\Textarea::make('meta_description')
                            ->label('Descripcion SEO')
                            ->maxLength(160)
                            ->rows(2),
                        Forms\Components\Textarea::make('og_description')
                            ->label('Descripcion OpenGraph')
                            ->maxLength(300)
                            ->rows(2),
                        SpatieMediaLibraryFileUpload::make('og_image')
                            ->label('Imagen OpenGraph (1200x630px)')
                            ->collection('og_image')
                            ->image()
                            ->columnSpanFull(),
                    ])->columns(2),
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
