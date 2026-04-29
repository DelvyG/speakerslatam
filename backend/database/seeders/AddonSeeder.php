<?php

namespace Database\Seeders;

use App\Models\Addon;
use Illuminate\Database\Seeder;

class AddonSeeder extends Seeder
{
    public function run(): void
    {
        $addons = [
            [
                'name' => 'Perfil Destacado',
                'slug' => 'perfil-destacado',
                'description' => 'Posición top en directorio, aparición en home, badge visual diferenciador.',
                'price' => 199.00,
                'billing_type' => 'yearly',
                'order' => 1,
            ],
            [
                'name' => 'Producción de Contenido Profesional',
                'slug' => 'produccion-contenido',
                'description' => 'Sesión de copywriting de bio, edición de video reel y diseño de one-pager profesional.',
                'price' => 150.00,
                'billing_type' => 'one_time',
                'order' => 2,
            ],
            [
                'name' => 'Capacitación Speaker Pro',
                'slug' => 'capacitacion-pro',
                'description' => 'Programa formativo: storytelling, oratoria avanzada, ventas de conferencias.',
                'price' => 149.00,
                'billing_type' => 'one_time',
                'order' => 3,
            ],
            [
                'name' => 'Promoción Dirigida',
                'slug' => 'promocion-dirigida',
                'description' => 'Mención individual en newsletter, posteo en redes sociales y email a base de empresas.',
                'price' => 69.00,
                'billing_type' => 'one_time',
                'order' => 4,
            ],
            [
                'name' => 'Verificación Premium',
                'slug' => 'verificacion-premium',
                'description' => 'Sello de speaker verificado y elegibilidad para gestión comercial activa.',
                'price' => 49.00,
                'billing_type' => 'one_time',
                'order' => 5,
            ],
        ];

        foreach ($addons as $addon) {
            Addon::create($addon);
        }
    }
}
