<?php

namespace App\Filament\Pages;

use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class EditProfile extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.edit-profile';

    protected static ?string $title = 'Mi Perfil';

    protected static ?string $slug = 'mi-perfil';

    protected static bool $shouldRegisterNavigation = false;

    public ?array $profileData = [];
    public ?array $passwordData = [];

    public function mount(): void
    {
        $this->profileForm->fill([
            'name' => Auth::user()->name,
            'email' => Auth::user()->email,
        ]);

        $this->passwordForm->fill();
    }

    public function profileForm(Schema $form): Schema
    {
        return $form
            ->schema([
                Section::make('Datos Personales')
                    ->description('Actualiza tu nombre y correo electronico.')
                    ->schema([
                        TextInput::make('name')
                            ->label('Nombre completo')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('email')
                            ->label('Correo electronico')
                            ->email()
                            ->required()
                            ->unique('users', 'email', ignorable: Auth::user()),
                    ])
                    ->columns(2)
                    ->footerActions([
                        Action::make('updateProfile')
                            ->label('Guardar cambios')
                            ->icon('heroicon-o-check')
                            ->submit('updateProfile'),
                    ]),
            ])
            ->statePath('profileData');
    }

    public function passwordForm(Schema $form): Schema
    {
        return $form
            ->schema([
                Section::make('Cambiar Contrasena')
                    ->description('Asegurate de usar una contrasena segura de al menos 8 caracteres.')
                    ->schema([
                        TextInput::make('current_password')
                            ->label('Contrasena actual')
                            ->password()
                            ->revealable()
                            ->required(),
                        TextInput::make('new_password')
                            ->label('Nueva contrasena')
                            ->password()
                            ->revealable()
                            ->required()
                            ->minLength(8),
                        TextInput::make('new_password_confirmation')
                            ->label('Confirmar nueva contrasena')
                            ->password()
                            ->revealable()
                            ->required()
                            ->same('new_password'),
                    ])
                    ->columns(3)
                    ->footerActions([
                        Action::make('updatePassword')
                            ->label('Actualizar contrasena')
                            ->icon('heroicon-o-lock-closed')
                            ->submit('updatePassword'),
                    ]),
            ])
            ->statePath('passwordData');
    }

    protected function getForms(): array
    {
        return [
            'profileForm',
            'passwordForm',
        ];
    }

    public function updateProfile(): void
    {
        $data = $this->profileForm->getState();

        $user = Auth::user();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->save();

        Notification::make()
            ->title('Perfil actualizado exitosamente')
            ->success()
            ->send();
    }

    public function updatePassword(): void
    {
        $data = $this->passwordForm->getState();

        if (!Hash::check($data['current_password'], Auth::user()->password)) {
            Notification::make()
                ->title('La contrasena actual es incorrecta')
                ->danger()
                ->send();
            return;
        }

        $user = Auth::user();
        $user->password = $data['new_password'];
        $user->save();

        $this->passwordForm->fill();

        Notification::make()
            ->title('Contrasena actualizada exitosamente')
            ->success()
            ->send();
    }
}
