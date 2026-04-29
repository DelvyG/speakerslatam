<x-filament-panels::page>
    <form wire:submit="updateProfile">
        {{ $this->profileForm }}
    </form>

    <form wire:submit="updatePassword">
        {{ $this->passwordForm }}
    </form>

    <x-filament::section>
        <x-slot name="heading">Informacion de la cuenta</x-slot>
        <x-slot name="description">Datos de tu cuenta en la plataforma.</x-slot>

        <dl class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-lg bg-gray-50 p-4 dark:bg-white/5">
                <dt class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Rol</dt>
                <dd class="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                    {{ auth()->user()->getRoleNames()->map(fn($r) => ucfirst($r))->implode(', ') ?: 'Sin rol' }}
                </dd>
            </div>
            <div class="rounded-lg bg-gray-50 p-4 dark:bg-white/5">
                <dt class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Miembro desde</dt>
                <dd class="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                    {{ auth()->user()->created_at->format('d/m/Y') }}
                </dd>
            </div>
            <div class="rounded-lg bg-gray-50 p-4 dark:bg-white/5">
                <dt class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Email verificado</dt>
                <dd class="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                    {{ auth()->user()->email_verified_at ? auth()->user()->email_verified_at->format('d/m/Y') : 'No verificado' }}
                </dd>
            </div>
        </dl>
    </x-filament::section>
</x-filament-panels::page>
