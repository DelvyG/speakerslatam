<x-filament-panels::page>
    <x-filament::section>
        <x-slot name="heading">Datos Personales</x-slot>
        <x-slot name="description">Actualiza tu nombre y correo electronico.</x-slot>

        <form wire:submit="updateProfile">
            {{ $this->profileForm }}

            <div class="mt-6 flex justify-end">
                <x-filament::button type="submit">
                    Guardar cambios
                </x-filament::button>
            </div>
        </form>
    </x-filament::section>

    <x-filament::section>
        <x-slot name="heading">Cambiar Contrasena</x-slot>
        <x-slot name="description">Asegurate de usar una contrasena segura.</x-slot>

        <form wire:submit="updatePassword">
            {{ $this->passwordForm }}

            <div class="mt-6 flex justify-end">
                <x-filament::button type="submit">
                    Actualizar contrasena
                </x-filament::button>
            </div>
        </form>
    </x-filament::section>

    <x-filament::section>
        <x-slot name="heading">Informacion de la cuenta</x-slot>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Rol</p>
                <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {{ auth()->user()->getRoleNames()->implode(', ') ?: 'Sin rol' }}
                </p>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Miembro desde</p>
                <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {{ auth()->user()->created_at->format('d/m/Y') }}
                </p>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Email verificado</p>
                <p class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {{ auth()->user()->email_verified_at ? auth()->user()->email_verified_at->format('d/m/Y') : 'No verificado' }}
                </p>
            </div>
        </div>
    </x-filament::section>
</x-filament-panels::page>
