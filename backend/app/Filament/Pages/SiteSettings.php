<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SiteSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationLabel = 'Configuracion del sitio';

    protected static ?string $title = 'Configuracion del Sitio';

    protected static ?string $slug = 'site-settings';

    protected static ?int $navigationSort = 99;

    protected string $view = 'filament.pages.site-settings';

    public static function getNavigationIcon(): string|\BackedEnum|null
    {
        return 'heroicon-o-cog-6-tooth';
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Configuracion';
    }

    public ?array $data = [];

    private const FILE_KEYS = ['logo_url', 'logo_login_url', 'favicon_url', 'seo_og_image', 'hero_image_url'];

    public function mount(): void
    {
        $settings = SiteSetting::pluck('value', 'key')->toArray();

        // Convert stored paths to array format for FileUpload
        // FileUpload expects ['relative/path/file.png'] relative to disk
        foreach (self::FILE_KEYS as $key) {
            if (!empty($settings[$key])) {
                // Strip /storage/ prefix to get disk-relative path
                $path = preg_replace('#^/storage/#', '', $settings[$key]);
                $settings[$key] = [$path];
            }
        }

        $this->form->fill($settings);
    }

    public function form(Schema $form): Schema
    {
        return $form
            ->schema([
                Section::make('Marca')
                    ->description('Logo, favicon y nombre del sitio.')
                    ->icon('heroicon-o-paint-brush')
                    ->schema([
                        TextInput::make('site_name')
                            ->label('Nombre del sitio')
                            ->required(),
                        TextInput::make('site_tagline')
                            ->label('Eslogan / Subtitulo')
                            ->required(),
                        FileUpload::make('logo_url')
                            ->label('Logo principal')
                            ->helperText('Logo horizontal para el header del sitio.')
                            ->image()
                            ->imagePreviewHeight('80')
                            ->directory('branding')
                            ->disk('public')
                            ->visibility('public'),
                        FileUpload::make('logo_login_url')
                            ->label('Logo para login')
                            ->helperText('Logo grande para pantallas de login/registro.')
                            ->image()
                            ->imagePreviewHeight('100')
                            ->directory('branding')
                            ->disk('public')
                            ->visibility('public'),
                        FileUpload::make('favicon_url')
                            ->label('Favicon')
                            ->helperText('Icono para la pestana del navegador (PNG o ICO, recomendado 512x512).')
                            ->image()
                            ->imagePreviewHeight('64')
                            ->directory('branding')
                            ->disk('public')
                            ->visibility('public'),
                    ])->columns(2),

                Section::make('Hero del Home')
                    ->description('Imagen de fondo del hero en la pagina principal.')
                    ->icon('heroicon-o-photo')
                    ->schema([
                        FileUpload::make('hero_image_url')
                            ->label('Imagen de fondo')
                            ->helperText('Imagen para el hero del home. Recomendado: 1920x800px.')
                            ->image()
                            ->imagePreviewHeight('150')
                            ->directory('branding')
                            ->disk('public')
                            ->visibility('public'),
                        TextInput::make('hero_image_opacity')
                            ->label('Opacidad (0-100)')
                            ->helperText('0 = invisible, 100 = completamente visible. Recomendado: 10-25 para que el texto sea legible.')
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(100)
                            ->default(15),
                        TextInput::make('hero_image_position')
                            ->label('Posicion vertical (0-100)')
                            ->helperText('0 = arriba, 50 = centro, 100 = abajo.')
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(100)
                            ->default(50),
                    ])->columns(2),

                Section::make('SEO')
                    ->description('Optimizacion para motores de busqueda.')
                    ->icon('heroicon-o-magnifying-glass')
                    ->schema([
                        TextInput::make('seo_title')
                            ->label('Titulo SEO')
                            ->helperText('Titulo que aparece en Google y en la pestana del navegador. Max 70 caracteres.')
                            ->maxLength(70)
                            ->required(),
                        Textarea::make('seo_description')
                            ->label('Meta descripcion')
                            ->helperText('Descripcion para resultados de Google. Max 160 caracteres recomendado.')
                            ->maxLength(200)
                            ->rows(3)
                            ->required(),
                        Textarea::make('seo_keywords')
                            ->label('Palabras clave')
                            ->helperText('Separadas por coma.')
                            ->rows(2),
                        FileUpload::make('seo_og_image')
                            ->label('Imagen para redes sociales (OG Image)')
                            ->helperText('Imagen que se muestra al compartir en Facebook, Twitter, LinkedIn, etc.')
                            ->image()
                            ->imagePreviewHeight('100')
                            ->directory('branding')
                            ->disk('public')
                            ->visibility('public'),
                    ])->columns(2),

                Section::make('Codigo personalizado')
                    ->description('Inyeccion de codigo para Google Analytics, Search Console, GTM, etc.')
                    ->icon('heroicon-o-code-bracket')
                    ->schema([
                        Textarea::make('code_head')
                            ->label('Codigo en <head>')
                            ->helperText('Se inyecta antes de </head>. Util para Google Search Console, meta tags, etc.')
                            ->rows(5),
                        Textarea::make('code_body_start')
                            ->label('Codigo al inicio del <body>')
                            ->helperText('Se inyecta despues de <body>. Util para Google Tag Manager noscript, etc.')
                            ->rows(5),
                        Textarea::make('code_body_end')
                            ->label('Codigo al final del <body>')
                            ->helperText('Se inyecta antes de </body>. Util para scripts de analytics, chat widgets, etc.')
                            ->rows(5),
                    ]),

                Section::make('Redes sociales')
                    ->description('Enlaces a perfiles de redes sociales.')
                    ->icon('heroicon-o-globe-alt')
                    ->schema([
                        TextInput::make('contact_email')
                            ->label('Email de contacto')
                            ->email(),
                        TextInput::make('social_instagram')
                            ->label('Instagram URL')
                            ->placeholder('https://instagram.com/speakerlatam'),
                        TextInput::make('social_linkedin')
                            ->label('LinkedIn URL')
                            ->placeholder('https://linkedin.com/company/speakerlatam'),
                        TextInput::make('social_twitter')
                            ->label('X / Twitter URL')
                            ->placeholder('https://x.com/speakerlatam'),
                        TextInput::make('social_youtube')
                            ->label('YouTube URL')
                            ->placeholder('https://youtube.com/@speakerlatam'),
                    ])->columns(2),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            // FileUpload returns arrays - convert to storage path
            if (is_array($value)) {
                $value = !empty($value) ? '/storage/' . array_values($value)[0] : '';
            }

            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        SiteSetting::clearCache();

        Notification::make()
            ->title('Configuracion guardada')
            ->success()
            ->send();
    }
}
