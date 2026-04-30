<?php

namespace Database\Seeders;

use App\Models\MembershipPlan;
use App\Models\PaymentAccount;
use Illuminate\Database\Seeder;

class MembershipPlanSeeder extends Seeder
{
    public function run(): void
    {
        MembershipPlan::updateOrCreate(
            ['slug' => 'anual-speaker'],
            [
                'name' => 'Membresia Anual Speaker',
                'price' => 99.00,
                'currency' => 'USD',
                'duration_days' => 365,
                'features' => [
                    'Perfil verificado en el directorio',
                    'Visible para empresas y organizadores de eventos',
                    'Foto de perfil y portada personalizadas',
                    'Hasta 5 categorias de especialidad',
                    'Enlace a video de presentacion',
                    'Enlace a redes sociales y sitio web',
                    'Estadisticas basicas de tu perfil',
                    'Soporte por correo electronico',
                ],
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        PaymentAccount::updateOrCreate(
            ['type' => 'paypal'],
            [
                'name' => 'PayPal',
                'details' => 'pagos@speakerslatam.net',
                'instructions' => 'Enviar pago como "Amigos y familia" al correo indicado. Incluir tu nombre completo en la nota.',
                'is_active' => true,
                'sort_order' => 1,
            ]
        );

        PaymentAccount::updateOrCreate(
            ['type' => 'binance'],
            [
                'name' => 'Binance Pay',
                'details' => 'ID: 123456789',
                'instructions' => 'Enviar pago en USDT via Binance Pay al ID indicado.',
                'is_active' => true,
                'sort_order' => 2,
            ]
        );

        PaymentAccount::updateOrCreate(
            ['type' => 'pago_movil'],
            [
                'name' => 'Pago Movil',
                'details' => "Banco: Banesco\nTelefono: 0412-1234567\nCedula: V-12345678",
                'instructions' => 'Realizar pago movil con los datos indicados. El monto en bolivares se calcula al cambio del dia.',
                'is_active' => true,
                'sort_order' => 3,
            ]
        );

        PaymentAccount::updateOrCreate(
            ['type' => 'transferencia'],
            [
                'name' => 'Transferencia Bancaria',
                'details' => "Banco: Banesco\nCuenta: 0134-0000-00-0000000000\nRIF: J-12345678-9\nNombre: SpeakerLATAM C.A.",
                'instructions' => 'Realizar transferencia a la cuenta indicada. Enviar comprobante con tu nombre completo.',
                'is_active' => true,
                'sort_order' => 4,
            ]
        );
    }
}
