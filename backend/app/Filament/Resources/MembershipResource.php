<?php

namespace App\Filament\Resources;

use App\Enums\MembershipStatus;
use App\Enums\PaymentMethod;
use App\Filament\Resources\MembershipResource\Pages;
use App\Models\Membership;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
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
    protected static ?int $navigationSort = 3;

    public static function getNavigationIcon(): string|\BackedEnum|null
    {
        return 'heroicon-o-ticket';
    }

    public static function getNavigationGroup(): string|\UnitEnum|null
    {
        return 'Comercial';
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'pending')->count() ?: null;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Section::make('Conferencista')
                ->schema([
                    Select::make('speaker_id')
                        ->label('Conferencista')
                        ->relationship('speaker', 'first_name')
                        ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->first_name} {$record->last_name}")
                        ->searchable(['first_name', 'last_name'])
                        ->preload()
                        ->required(),
                    Select::make('membership_plan_id')
                        ->label('Plan')
                        ->relationship('plan', 'name')
                        ->preload(),
                ])->columns(2),

            Section::make('Periodo y pago')
                ->schema([
                    DateTimePicker::make('starts_at')->label('Fecha de inicio')->required(),
                    DateTimePicker::make('expires_at')->label('Fecha de expiracion')->required(),
                    TextInput::make('amount_paid')->label('Monto pagado')->numeric()->prefix('$')->required(),
                    TextInput::make('currency')->label('Moneda')->default('USD')->maxLength(3),
                    Select::make('payment_method')->label('Metodo de pago')->options(PaymentMethod::class),
                    TextInput::make('payment_platform')->label('Plataforma de pago'),
                    TextInput::make('payment_reference')->label('Referencia del pago'),
                    DatePicker::make('payment_date')->label('Fecha del pago'),
                ])->columns(2),

            Section::make('Comprobante de pago')
                ->schema([
                    FileUpload::make('proof_file')
                        ->label('Comprobante')
                        ->image()
                        ->imagePreviewHeight('200')
                        ->directory('payment-proofs')
                        ->disk('public')
                        ->visibility('public')
                        ->columnSpanFull(),
                ]),

            Section::make('Estado')
                ->schema([
                    Select::make('status')
                        ->label('Estado')
                        ->options(MembershipStatus::class)
                        ->default(MembershipStatus::Pending)
                        ->required(),
                    Textarea::make('admin_notes')
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
                    ->searchable(['first_name', 'last_name']),
                Tables\Columns\TextColumn::make('plan.name')
                    ->label('Plan')
                    ->placeholder('Sin plan'),
                Tables\Columns\TextColumn::make('amount_paid')
                    ->label('Monto')
                    ->money('USD'),
                Tables\Columns\TextColumn::make('payment_platform')
                    ->label('Plataforma')
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('expires_at')
                    ->label('Expira')
                    ->dateTime('d/m/Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Estado')
                    ->badge(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estado')
                    ->options(MembershipStatus::class),
            ])
            ->actions([
                Actions\EditAction::make(),
                Actions\Action::make('aprobar')
                    ->label('Aprobar')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Aprobar membresia')
                    ->modalDescription('Esto activara la membresia y el speaker aparecera en el directorio.')
                    ->action(function (Membership $record) {
                        $record->update([
                            'status' => MembershipStatus::Active,
                            'starts_at' => now(),
                            'expires_at' => now()->addDays($record->plan?->duration_days ?? 365),
                        ]);
                    })
                    ->visible(fn (Membership $record) => $record->status === MembershipStatus::Pending),
                Actions\Action::make('rechazar')
                    ->label('Rechazar')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(fn (Membership $record) => $record->update(['status' => MembershipStatus::Rejected]))
                    ->visible(fn (Membership $record) => $record->status === MembershipStatus::Pending),
            ])
            ->defaultSort('created_at', 'desc');
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
