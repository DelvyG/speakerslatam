<x-filament-panels::page>
    <div class="space-y-6">

        {{-- Datos Personales --}}
        <x-filament::section>
            <x-slot name="heading">Datos Personales</x-slot>
            <x-slot name="description">Actualiza tu nombre y correo electronico.</x-slot>

            <form wire:submit="updateProfile" class="space-y-6">
                <div class="py-2">
                    {{ $this->profileForm }}
                </div>

                <div class="border-t border-gray-200 pt-6 dark:border-white/10">
                    <div class="flex justify-end gap-3">
                        <x-filament::button type="submit" icon="heroicon-o-check">
                            Guardar cambios
                        </x-filament::button>
                    </div>
                </div>
            </form>
        </x-filament::section>

        {{-- Cambiar Contrasena --}}
        <x-filament::section>
            <x-slot name="heading">Cambiar Contrasena</x-slot>
            <x-slot name="description">Asegurate de usar una contrasena segura de al menos 8 caracteres.</x-slot>

            <form wire:submit="updatePassword" class="space-y-6">
                <div class="py-2">
                    {{ $this->passwordForm }}
                </div>

                <div class="border-t border-gray-200 pt-6 dark:border-white/10">
                    <div class="flex justify-end gap-3">
                        <x-filament::button type="submit" icon="heroicon-o-lock-closed">
                            Actualizar contrasena
                        </x-filament::button>
                    </div>
                </div>
            </form>
        </x-filament::section>

        {{-- Info de la cuenta --}}
        <x-filament::section>
            <x-slot name="heading">Informacion de la cuenta</x-slot>
            <x-slot name="description">Datos de tu cuenta en la plataforma.</x-slot>

            <div class="grid grid-cols-1 gap-6 py-2 sm:grid-cols-3">
                <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Rol</p>
                    <p class="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                        {{ auth()->user()->getRoleNames()->map(fn($r) => ucfirst($r))->implode(', ') ?: 'Sin rol' }}
                    </p>
                </div>
                <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Miembro desde</p>
                    <p class="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                        {{ auth()->user()->created_at->translatedFormat('d M Y') }}
                    </p>
                </div>
                <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Email verificado</p>
                    <p class="mt-2 text-lg font-semibold {{ auth()->user()->email_verified_at ? 'text-success-600' : 'text-danger-600' }}">
                        {{ auth()->user()->email_verified_at ? auth()->user()->email_verified_at->translatedFormat('d M Y') : 'No verificado' }}
                    </p>
                </div>
            </div>
        </x-filament::section>

    </div>
</x-filament-panels::page>
