<?php

namespace App\Filament\Pages;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class EditProfile extends Page
{
    protected string $view = 'filament.pages.edit-profile';

    protected static ?string $title = 'Mi Perfil';

    protected static ?string $slug = 'mi-perfil';

    protected static bool $shouldRegisterNavigation = false;

    public ?array $profileData = [];
    public ?array $passwordData = [];

    public function mount(): void
    {
        $user = Auth::user();
        $this->profileData = [
            'name' => $user->name,
            'email' => $user->email,
        ];
        $this->passwordData = [
            'current_password' => '',
            'new_password' => '',
            'new_password_confirmation' => '',
        ];
    }

    public function updateProfile(): void
    {
        $data = $this->profileData;

        $this->validate([
            'profileData.name' => ['required', 'string', 'max:255'],
            'profileData.email' => ['required', 'email', 'unique:users,email,' . Auth::id()],
        ]);

        $user = Auth::user();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->save();

        Notification::make()
            ->title('Perfil actualizado')
            ->success()
            ->send();
    }

    public function updatePassword(): void
    {
        $data = $this->passwordData;

        $this->validate([
            'passwordData.current_password' => ['required'],
            'passwordData.new_password' => ['required', 'min:8', 'confirmed'],
        ], [], [
            'passwordData.current_password' => 'contrasena actual',
            'passwordData.new_password' => 'nueva contrasena',
            'passwordData.new_password_confirmation' => 'confirmacion',
        ]);

        $user = Auth::user();

        if (!Hash::check($data['current_password'], $user->password)) {
            $this->addError('passwordData.current_password', 'La contrasena actual es incorrecta.');
            return;
        }

        $user->password = $data['new_password'];
        $user->save();

        $this->passwordData = [
            'current_password' => '',
            'new_password' => '',
            'new_password_confirmation' => '',
        ];

        Notification::make()
            ->title('Contrasena actualizada')
            ->success()
            ->send();
    }
}
