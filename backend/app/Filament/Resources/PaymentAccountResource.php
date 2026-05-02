<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PaymentAccountResource\Pages;
use App\Models\PaymentAccount;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;

class PaymentAccountResource extends Resource
{
    protected static ?string $model = PaymentAccount::class;

    protected static ?string $modelLabel = 'Cuenta de pago';
    protected static ?string $pluralModelLabel = 'Cuentas de pago';
    protected static ?int $navigationSort = 2;

    public static function getNavigationIcon(): string|\BackedEnum|null
    {
        return 'heroicon-o-banknotes';
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Comercial';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Section::make('Datos de la cuenta')
                ->schema([
                    TextInput::make('name')->label('Nombre (ej: PayPal, Binance, Banesco)')->required(),
                    TextInput::make('type')->label('Tipo (paypal, binance, pago_movil, transferencia)')->required(),
                    Textarea::make('details')->label('Datos de la cuenta')->required()->rows(4)
                        ->helperText('Numero de cuenta, email, ID, telefono, etc. Esto lo ve el speaker.'),
                    Textarea::make('instructions')->label('Instrucciones de pago')->rows(3)
                        ->helperText('Indicaciones para el speaker sobre como realizar el pago.'),
                    TextInput::make('sort_order')->label('Orden')->numeric()->default(0),
                    Toggle::make('is_active')->label('Activa')->default(true),
                ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Nombre')->searchable(),
                Tables\Columns\TextColumn::make('type')->label('Tipo')->badge(),
                Tables\Columns\TextColumn::make('details')->label('Datos')->limit(50),
                Tables\Columns\IconColumn::make('is_active')->label('Activa')->boolean(),
            ])
            ->actions([Actions\EditAction::make(), Actions\DeleteAction::make()])
            ->defaultSort('sort_order');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPaymentAccounts::route('/'),
            'create' => Pages\CreatePaymentAccount::route('/create'),
            'edit' => Pages\EditPaymentAccount::route('/{record}/edit'),
        ];
    }
}
