<?php

namespace App\Filament\Pages;

use App\Models\SiteSetting;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class SiteSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Configuracion del sitio';

    protected static ?string $title = 'Configuracion del Sitio';

    protected static ?string $slug = 'site-settings';

    protected static ?int $navigationSort = 99;

    protected static string $view = 'filament.pages.site-settings';

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

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Tabs::make('settings')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('Marca')
                            ->icon('heroicon-o-paint-brush')
                            ->schema([
                                Forms\Components\TextInput::make('site_name')
                                    ->label('Nombre del sitio')
                                    ->required(),
                                Forms\Components\TextInput::make('site_tagline')
                                    ->label('Eslogan / Subtitulo')
                                    ->required(),
                                Forms\Components\TextInput::make('logo_url')
                                    ->label('Logo principal (URL)')
                                    ->helperText('Logo horizontal para el header. Ruta relativa al backend, ej: /branding/logo-horizontal.png')
                                    ->required(),
                                Forms\Components\TextInput::make('logo_login_url')
                                    ->label('Logo login (URL)')
                                    ->helperText('Logo grande para pantallas de login/registro.'),
                                Forms\Components\TextInput::make('favicon_url')
                                    ->label('Favicon (URL)')
                                    ->helperText('Icono para la pestana del navegador. Ruta relativa, ej: /branding/favicon.png')
                                    ->required(),
                            ]),

                        Forms\Components\Tabs\Tab::make('SEO')
                            ->icon('heroicon-o-magnifying-glass')
                            ->schema([
                                Forms\Components\TextInput::make('seo_title')
                                    ->label('Titulo SEO')
                                    ->helperText('Titulo que aparece en Google y en la pestana del navegador.')
                                    ->maxLength(70)
                                    ->required(),
                                Forms\Components\Textarea::make('seo_description')
                                    ->label('Meta descripcion')
                                    ->helperText('Descripcion que aparece en resultados de Google. Maximo 160 caracteres recomendado.')
                                    ->maxLength(200)
                                    ->rows(3)
                                    ->required(),
                                Forms\Components\Textarea::make('seo_keywords')
                                    ->label('Palabras clave')
                                    ->helperText('Separadas por coma.')
                                    ->rows(2),
                                Forms\Components\TextInput::make('seo_og_image')
                                    ->label('Imagen para redes sociales (OG Image URL)')
                                    ->helperText('Imagen que se muestra al compartir en redes sociales.'),
                            ]),

                        Forms\Components\Tabs\Tab::make('Codigo personalizado')
                            ->icon('heroicon-o-code-bracket')
                            ->schema([
                                Forms\Components\Textarea::make('code_head')
                                    ->label('Codigo en <head>')
                                    ->helperText('Se inyecta antes de </head>. Util para Google Search Console, meta tags, etc.')
                                    ->rows(6)
                                    ->columnSpanFull(),
                                Forms\Components\Textarea::make('code_body_start')
                                    ->label('Codigo al inicio del <body>')
                                    ->helperText('Se inyecta justo despues de <body>. Util para Google Tag Manager noscript, etc.')
                                    ->rows(6)
                                    ->columnSpanFull(),
                                Forms\Components\Textarea::make('code_body_end')
                                    ->label('Codigo al final del <body>')
                                    ->helperText('Se inyecta antes de </body>. Util para scripts de analytics, chat widgets, etc.')
                                    ->rows(6)
                                    ->columnSpanFull(),
                            ]),

                        Forms\Components\Tabs\Tab::make('Redes sociales')
                            ->icon('heroicon-o-globe-alt')
                            ->schema([
                                Forms\Components\TextInput::make('contact_email')
                                    ->label('Email de contacto')
                                    ->email(),
                                Forms\Components\TextInput::make('social_instagram')
                                    ->label('Instagram URL')
                                    ->url()
                                    ->placeholder('https://instagram.com/speakerlatam'),
                                Forms\Components\TextInput::make('social_linkedin')
                                    ->label('LinkedIn URL')
                                    ->url()
                                    ->placeholder('https://linkedin.com/company/speakerlatam'),
                                Forms\Components\TextInput::make('social_twitter')
                                    ->label('X / Twitter URL')
                                    ->url()
                                    ->placeholder('https://x.com/speakerlatam'),
                                Forms\Components\TextInput::make('social_youtube')
                                    ->label('YouTube URL')
                                    ->url()
                                    ->placeholder('https://youtube.com/@speakerlatam'),
                            ]),
                    ])
                    ->columnSpanFull(),
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
