<x-filament-panels::page>
    <form wire:submit="updateProfile">
        {{ $this->profileForm }}

        <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
            <x-filament::button type="submit" icon="heroicon-o-check">
                Guardar cambios
            </x-filament::button>
        </div>
    </form>

    <div style="margin-top: 2rem;"></div>

    <form wire:submit="updatePassword">
        {{ $this->passwordForm }}

        <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
            <x-filament::button type="submit" icon="heroicon-o-lock-closed">
                Actualizar contrasena
            </x-filament::button>
        </div>
    </form>

    <div style="margin-top: 2rem;"></div>

    <x-filament::section>
        <x-slot name="heading">Informacion de la cuenta</x-slot>
        <x-slot name="description">Datos de tu cuenta en la plataforma.</x-slot>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
            <div style="background: #f9fafb; border-radius: 0.5rem; padding: 1rem;">
                <div style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Rol</div>
                <div style="margin-top: 0.5rem; font-size: 1rem; font-weight: 600; color: #111827;">
                    {{ auth()->user()->getRoleNames()->map(fn($r) => ucfirst($r))->implode(', ') ?: 'Sin rol' }}
                </div>
            </div>
            <div style="background: #f9fafb; border-radius: 0.5rem; padding: 1rem;">
                <div style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Miembro desde</div>
                <div style="margin-top: 0.5rem; font-size: 1rem; font-weight: 600; color: #111827;">
                    {{ auth()->user()->created_at->format('d/m/Y') }}
                </div>
            </div>
            <div style="background: #f9fafb; border-radius: 0.5rem; padding: 1rem;">
                <div style="font-size: 0.75rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Email verificado</div>
                <div style="margin-top: 0.5rem; font-size: 1rem; font-weight: 600; color: {{ auth()->user()->email_verified_at ? '#059669' : '#dc2626' }};">
                    {{ auth()->user()->email_verified_at ? auth()->user()->email_verified_at->format('d/m/Y') : 'No verificado' }}
                </div>
            </div>
        </div>
    </x-filament::section>
</x-filament-panels::page>
