<x-filament-panels::page>
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {{-- Datos personales --}}
        <div class="fi-section rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="fi-section-header px-6 py-4">
                <h3 class="text-base font-semibold leading-6 text-gray-950 dark:text-white">
                    Datos Personales
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Actualiza tu nombre y correo electronico.
                </p>
            </div>

            <div class="border-t border-gray-200 dark:border-white/10">
                <form wire:submit="updateProfile" class="space-y-4 p-6">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nombre completo
                        </label>
                        <input
                            id="name"
                            type="text"
                            wire:model="profileData.name"
                            class="fi-input block w-full rounded-lg border-gray-300 shadow-sm transition duration-75 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                        @error('profileData.name')
                            <p class="mt-1 text-sm text-danger-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Correo electronico
                        </label>
                        <input
                            id="email"
                            type="email"
                            wire:model="profileData.email"
                            class="fi-input block w-full rounded-lg border-gray-300 shadow-sm transition duration-75 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                        @error('profileData.email')
                            <p class="mt-1 text-sm text-danger-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="flex justify-end pt-2">
                        <x-filament::button type="submit" wire:loading.attr="disabled">
                            Guardar cambios
                        </x-filament::button>
                    </div>
                </form>
            </div>
        </div>

        {{-- Cambiar contrasena --}}
        <div class="fi-section rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="fi-section-header px-6 py-4">
                <h3 class="text-base font-semibold leading-6 text-gray-950 dark:text-white">
                    Cambiar Contrasena
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Asegurate de usar una contrasena segura.
                </p>
            </div>

            <div class="border-t border-gray-200 dark:border-white/10">
                <form wire:submit="updatePassword" class="space-y-4 p-6">
                    <div>
                        <label for="current_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Contrasena actual
                        </label>
                        <input
                            id="current_password"
                            type="password"
                            wire:model="passwordData.current_password"
                            class="fi-input block w-full rounded-lg border-gray-300 shadow-sm transition duration-75 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                        @error('passwordData.current_password')
                            <p class="mt-1 text-sm text-danger-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <label for="new_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nueva contrasena
                        </label>
                        <input
                            id="new_password"
                            type="password"
                            wire:model="passwordData.new_password"
                            class="fi-input block w-full rounded-lg border-gray-300 shadow-sm transition duration-75 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                        @error('passwordData.new_password')
                            <p class="mt-1 text-sm text-danger-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <label for="new_password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirmar nueva contrasena
                        </label>
                        <input
                            id="new_password_confirmation"
                            type="password"
                            wire:model="passwordData.new_password_confirmation"
                            class="fi-input block w-full rounded-lg border-gray-300 shadow-sm transition duration-75 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                        />
                    </div>

                    <div class="flex justify-end pt-2">
                        <x-filament::button type="submit" wire:loading.attr="disabled">
                            Actualizar contrasena
                        </x-filament::button>
                    </div>
                </form>
            </div>
        </div>

    </div>

    {{-- Info de la cuenta --}}
    <div class="mt-6 fi-section rounded-xl bg-white shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
        <div class="px-6 py-4">
            <h3 class="text-base font-semibold leading-6 text-gray-950 dark:text-white">
                Informacion de la cuenta
            </h3>
        </div>
        <div class="border-t border-gray-200 dark:border-white/10 px-6 py-4">
            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Rol</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ auth()->user()->getRoleNames()->implode(', ') ?: 'Sin rol' }}
                    </dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Miembro desde</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ auth()->user()->created_at->format('d/m/Y') }}
                    </dd>
                </div>
                <div>
                    <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Email verificado</dt>
                    <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                        {{ auth()->user()->email_verified_at ? auth()->user()->email_verified_at->format('d/m/Y') : 'No verificado' }}
                    </dd>
                </div>
            </dl>
        </div>
    </div>
</x-filament-panels::page>
