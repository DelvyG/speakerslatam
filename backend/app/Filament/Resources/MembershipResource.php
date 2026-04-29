<?php

namespace App\Filament\Resources;

use App\Enums\MembershipStatus;
use App\Enums\PaymentMethod;
use App\Filament\Resources\MembershipResource\Pages;
use App\Models\Membership;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Actions;
use Filament\Tables;
use Filament\Tables\Table;

class MembershipResource extends Resource
{
    protected static ?string $model = Membership::class;

    protected static ?string $modelLabel = 'Membresia';

    protected static ?string $pluralModelLabel = 'Membresias';

    protected static ?int $navigationSort = 2;

    public static function getNavigationIcon(): string|\BackedEnum|null
    {
        return 'heroicon-o-credit-card';
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Conferencistas';
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->schema([
                Forms\Components\Section::make('Conferencista')
                    ->schema([
                        Forms\Components\Select::make('speaker_id')
                            ->label('Conferencista')
                            ->relationship('speaker', 'first_name')
                            ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->first_name} {$record->last_name}")
                            ->searchable(['first_name', 'last_name'])
                            ->preload()
                            ->required(),
                    ]),

                Forms\Components\Section::make('Periodo y pago')
                    ->schema([
                        Forms\Components\DateTimePicker::make('starts_at')
                            ->label('Fecha de inicio')
                            ->required(),
                        Forms\Components\DateTimePicker::make('expires_at')
                            ->label('Fecha de expiracion')
                            ->required(),
                        Forms\Components\TextInput::make('amount_paid')
                            ->label('Monto pagado')
                            ->numeric()
                            ->prefix('$')
                            ->required(),
                        Forms\Components\TextInput::make('currency')
                            ->label('Moneda')
                            ->default('USD')
                            ->maxLength(3)
                            ->required(),
                        Forms\Components\Select::make('payment_method')
                            ->label('Metodo de pago')
                            ->options(PaymentMethod::class)
                            ->required(),
                        Forms\Components\TextInput::make('stripe_payment_id')
                            ->label('ID de pago Stripe')
                            ->maxLength(255),
                    ])->columns(2),

                Forms\Components\Section::make('Estado')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Estado')
                            ->options(MembershipStatus::class)
                            ->default(MembershipStatus::Active)
                            ->required(),
                        Forms\Components\Textarea::make('admin_notes')
                            ->label('Notas del administrador')
                            ->rows(3)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('speaker.first_name')
                    ->label('Conferencista')
                    ->formatStateUsing(fn ($record) => "{$record->speaker->first_name} {$record->speaker->last_name}")
                    ->searchable(['first_name', 'last_name'])
                    ->sortable(),
                Tables\Columns\TextColumn::make('starts_at')
                    ->label('Inicio')
                    ->dateTime('d/m/Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('expires_at')
                    ->label('Expira')
                    ->dateTime('d/m/Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('amount_paid')
                    ->label('Monto')
                    ->money('USD')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estado')
                    ->badge(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estado')
                    ->options(MembershipStatus::class),
                Tables\Filters\SelectFilter::make('payment_method')
                    ->label('Metodo de pago')
                    ->options(PaymentMethod::class),
            ])
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
            'index' => Pages\ListMemberships::route('/'),
            'create' => Pages\CreateMembership::route('/create'),
            'edit' => Pages\EditMembership::route('/{record}/edit'),
        ];
    }
}
