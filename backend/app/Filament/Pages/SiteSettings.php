<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
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

    public function mount(): void
    {
        $settings = SiteSetting::pluck('value', 'key')->toArray();
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
                        TextInput::make('logo_url')
                            ->label('Logo principal (URL)')
                            ->helperText('Logo horizontal para el header. Ruta relativa, ej: /branding/logo-horizontal.png')
                            ->required(),
                        TextInput::make('logo_login_url')
                            ->label('Logo login (URL)')
                            ->helperText('Logo grande para pantallas de login/registro.'),
                        TextInput::make('favicon_url')
                            ->label('Favicon (URL)')
                            ->helperText('Icono para la pestana del navegador.')
                            ->required(),
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
                        TextInput::make('seo_og_image')
                            ->label('Imagen para redes sociales (OG Image URL)')
                            ->helperText('Imagen que se muestra al compartir en redes sociales.'),
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
