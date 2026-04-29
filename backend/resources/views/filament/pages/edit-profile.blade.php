<x-filament-panels::page>
    <div class="mx-auto max-w-4xl space-y-8">

        {{-- Datos Personales --}}
        <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-950 dark:text-white">Datos Personales</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Actualiza tu nombre y correo electronico.</p>
            </div>

            <form wire:submit="updateProfile">
                {{ $this->profileForm }}

                <div class="mt-8 flex justify-end">
                    <x-filament::button type="submit" icon="heroicon-o-check">
                        Guardar cambios
                    </x-filament::button>
                </div>
            </form>
        </div>

        {{-- Cambiar Contrasena --}}
        <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-950 dark:text-white">Cambiar Contrasena</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Asegurate de usar una contrasena segura de al menos 8 caracteres.</p>
            </div>

            <form wire:submit="updatePassword">
                {{ $this->passwordForm }}

                <div class="mt-8 flex justify-end">
                    <x-filament::button type="submit" icon="heroicon-o-lock-closed">
                        Actualizar contrasena
                    </x-filament::button>
                </div>
            </form>
        </div>

        {{-- Info de la cuenta --}}
        <div class="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-950/5 dark:bg-gray-900 dark:ring-white/10">
            <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-950 dark:text-white">Informacion de la cuenta</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Datos de tu cuenta en la plataforma.</p>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div class="rounded-lg bg-gray-50 px-4 py-5 dark:bg-gray-800">
                    <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Rol</p>
                    <p class="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                        {{ auth()->user()->getRoleNames()->map(fn($r) => ucfirst($r))->implode(', ') ?: 'Sin rol' }}
                    </p>
                </div>
                <div class="rounded-lg bg-gray-50 px-4 py-5 dark:bg-gray-800">
                    <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Miembro desde</p>
                    <p class="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                        {{ auth()->user()->created_at->format('d/m/Y') }}
                    </p>
                </div>
                <div class="rounded-lg bg-gray-50 px-4 py-5 dark:bg-gray-800">
                    <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Email verificado</p>
                    <p class="mt-2 text-lg font-semibold {{ auth()->user()->email_verified_at ? 'text-green-600' : 'text-red-600' }}">
                        {{ auth()->user()->email_verified_at ? auth()->user()->email_verified_at->format('d/m/Y') : 'No verificado' }}
                    </p>
                </div>
            </div>
        </div>

    </div>
</x-filament-panels::page>
