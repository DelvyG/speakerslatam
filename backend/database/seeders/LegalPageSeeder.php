<?php

namespace Database\Seeders;

use App\Models\LegalPage;
use Illuminate\Database\Seeder;

class LegalPageSeeder extends Seeder
{
    public function run(): void
    {
        LegalPage::updateOrCreate(
            ['slug' => 'terminos'],
            [
                'title' => 'Terminos y Condiciones',
                'content' => <<<'HTML'
<h2>1. Aceptacion de los Terminos</h2>
<p>Al acceder y utilizar la plataforma SpeakerLATAM (en adelante, "la Plataforma"), usted acepta estar sujeto a estos Terminos y Condiciones de uso. Si no esta de acuerdo con alguna parte de estos terminos, no debera utilizar la Plataforma.</p>

<h2>2. Descripcion del Servicio</h2>
<p>SpeakerLATAM es un directorio profesional que conecta conferencistas, speakers y facilitadores con empresas y organizadores de eventos en America Latina. La Plataforma ofrece:</p>
<ul>
<li>Directorio publico de conferencistas con perfiles verificados.</li>
<li>Membresias anuales para conferencistas que deseen destacar su perfil.</li>
<li>Servicio de concierge para empresas que buscan el speaker ideal.</li>
<li>Contenido educativo a traves de SpeakerLATAM Academy.</li>
</ul>

<h2>3. Registro y Cuentas de Usuario</h2>
<p>Para acceder a ciertas funcionalidades de la Plataforma, debera crear una cuenta proporcionando informacion veraz, completa y actualizada. Usted es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta.</p>

<h2>4. Membresias y Pagos</h2>
<p>Las membresias para conferencistas son anuales y se renuevan automaticamente salvo cancelacion previa. Los precios se expresan en dolares estadounidenses (USD) y pueden variar segun el pais de origen. Los pagos se procesan a traves de pasarelas de pago seguras y no almacenamos datos de tarjetas de credito en nuestros servidores.</p>
<p>Las solicitudes de reembolso deben realizarse dentro de los primeros 14 dias posteriores a la compra, siempre que no se hayan utilizado los servicios premium incluidos en la membresia.</p>

<h2>5. Contenido del Usuario</h2>
<p>Al publicar contenido en la Plataforma (biografia, fotos, videos, testimonios), usted declara que:</p>
<ul>
<li>Es el autor o tiene los derechos necesarios para compartir dicho contenido.</li>
<li>El contenido no infringe derechos de terceros ni leyes aplicables.</li>
<li>Otorga a SpeakerLATAM una licencia no exclusiva para mostrar dicho contenido en la Plataforma y materiales promocionales relacionados.</li>
</ul>

<h2>6. Uso Aceptable</h2>
<p>Los usuarios se comprometen a no utilizar la Plataforma para:</p>
<ul>
<li>Publicar informacion falsa o engañosa.</li>
<li>Enviar spam o comunicaciones no solicitadas.</li>
<li>Intentar acceder sin autorizacion a cuentas de otros usuarios.</li>
<li>Realizar actividades que puedan dañar, sobrecargar o deteriorar la Plataforma.</li>
</ul>

<h2>7. Servicio de Concierge</h2>
<p>El servicio de concierge para empresas tiene una comision que oscila entre el 20% y 30% sobre el honorario del conferencista seleccionado. SpeakerLATAM actua como intermediario y no es parte del contrato entre la empresa y el conferencista. No nos hacemos responsables por cancelaciones, cambios de agenda o incumplimientos entre las partes.</p>

<h2>8. Propiedad Intelectual</h2>
<p>Todo el contenido de la Plataforma, incluyendo pero no limitado a logotipos, diseños, textos, graficos e interfaz de usuario, es propiedad de SpeakerLATAM o de sus respectivos titulares y esta protegido por las leyes de propiedad intelectual aplicables.</p>

<h2>9. Limitacion de Responsabilidad</h2>
<p>SpeakerLATAM no garantiza la exactitud, integridad o actualidad de la informacion publicada por los conferencistas en sus perfiles. La Plataforma se proporciona "tal cual" y "segun disponibilidad". En ningun caso SpeakerLATAM sera responsable por danos indirectos, incidentales o consecuentes derivados del uso de la Plataforma.</p>

<h2>10. Modificaciones</h2>
<p>SpeakerLATAM se reserva el derecho de modificar estos Terminos y Condiciones en cualquier momento. Las modificaciones entraran en vigor al momento de su publicacion en la Plataforma. El uso continuado de la Plataforma despues de la publicacion de cambios constituye la aceptacion de los mismos.</p>

<h2>11. Ley Aplicable</h2>
<p>Estos Terminos y Condiciones se rigen por las leyes de la Republica Bolivariana de Venezuela. Cualquier controversia sera sometida a los tribunales competentes de la ciudad de Caracas.</p>

<h2>12. Contacto</h2>
<p>Para consultas relacionadas con estos terminos, puede contactarnos a traves de <a href="/contacto">nuestra pagina de contacto</a> o al correo <strong>contacto@speakerslatam.net</strong>.</p>

<p><em>Ultima actualizacion: Abril 2026</em></p>
HTML
            ]
        );

        LegalPage::updateOrCreate(
            ['slug' => 'privacidad'],
            [
                'title' => 'Politica de Privacidad',
                'content' => <<<'HTML'
<h2>1. Informacion que Recopilamos</h2>
<p>En SpeakerLATAM recopilamos la siguiente informacion personal cuando usted utiliza nuestra Plataforma:</p>
<ul>
<li><strong>Datos de registro:</strong> nombre completo, correo electronico, telefono, ciudad y pais.</li>
<li><strong>Datos de perfil de conferencista:</strong> biografia, foto profesional, areas de experiencia, idiomas, video de presentacion, redes sociales y rango de honorarios.</li>
<li><strong>Datos de empresas:</strong> nombre de la empresa, sector, datos del contacto y detalles del evento solicitado.</li>
<li><strong>Datos de uso:</strong> paginas visitadas, tiempo de permanencia, dispositivo y navegador utilizado, direccion IP.</li>
<li><strong>Datos de pago:</strong> procesados directamente por nuestro proveedor de pagos (Stripe). No almacenamos numeros de tarjeta de credito.</li>
</ul>

<h2>2. Como Utilizamos su Informacion</h2>
<p>Utilizamos la informacion recopilada para:</p>
<ul>
<li>Operar y mantener la Plataforma y sus funcionalidades.</li>
<li>Mostrar perfiles de conferencistas en el directorio publico.</li>
<li>Facilitar la conexion entre conferencistas y empresas.</li>
<li>Procesar pagos de membresias y servicios.</li>
<li>Enviar comunicaciones relacionadas con el servicio (confirmaciones, actualizaciones, alertas de seguridad).</li>
<li>Enviar comunicaciones de marketing solo si usted ha dado su consentimiento previo.</li>
<li>Mejorar la experiencia del usuario mediante analisis de uso.</li>
</ul>

<h2>3. Comparticion de Informacion</h2>
<p>No vendemos ni alquilamos su informacion personal a terceros. Podemos compartir informacion con:</p>
<ul>
<li><strong>Proveedores de servicios:</strong> empresas que nos ayudan a operar la Plataforma (hosting, pagos, envio de correos).</li>
<li><strong>Empresas solicitantes:</strong> cuando una empresa solicita un conferencista a traves del servicio concierge, compartimos la informacion del perfil publico del conferencista.</li>
<li><strong>Requerimientos legales:</strong> cuando sea necesario para cumplir con una obligacion legal, proteger nuestros derechos o responder a un proceso judicial.</li>
</ul>

<h2>4. Seguridad de los Datos</h2>
<p>Implementamos medidas de seguridad tecnicas y organizativas para proteger su informacion personal, incluyendo:</p>
<ul>
<li>Cifrado SSL/TLS en todas las comunicaciones.</li>
<li>Acceso restringido a datos personales solo al personal autorizado.</li>
<li>Respaldos periodicos y almacenamiento seguro.</li>
<li>Monitoreo continuo de la infraestructura.</li>
</ul>

<h2>5. Cookies y Tecnologias de Rastreo</h2>
<p>Utilizamos cookies y tecnologias similares para:</p>
<ul>
<li>Mantener su sesion activa.</li>
<li>Recordar sus preferencias.</li>
<li>Analizar el trafico y uso de la Plataforma.</li>
</ul>
<p>Puede configurar su navegador para rechazar cookies, aunque esto podria afectar la funcionalidad de la Plataforma.</p>

<h2>6. Sus Derechos</h2>
<p>Usted tiene derecho a:</p>
<ul>
<li><strong>Acceder</strong> a su informacion personal almacenada en nuestros sistemas.</li>
<li><strong>Rectificar</strong> cualquier dato incorrecto o desactualizado.</li>
<li><strong>Eliminar</strong> su cuenta y datos personales (derecho al olvido), salvo cuando la ley exija su conservacion.</li>
<li><strong>Oponerse</strong> al tratamiento de sus datos con fines de marketing.</li>
<li><strong>Portabilidad:</strong> solicitar una copia de sus datos en formato estructurado.</li>
</ul>
<p>Para ejercer cualquiera de estos derechos, contactenos a traves de <a href="/contacto">nuestra pagina de contacto</a>.</p>

<h2>7. Retencion de Datos</h2>
<p>Conservamos su informacion personal mientras su cuenta este activa o sea necesaria para prestarle nuestros servicios. Si solicita la eliminacion de su cuenta, procederemos a eliminar sus datos en un plazo maximo de 30 dias, salvo obligacion legal de conservacion.</p>

<h2>8. Transferencias Internacionales</h2>
<p>Sus datos pueden ser almacenados y procesados en servidores ubicados fuera de su pais de residencia. Nos aseguramos de que estos servidores cuenten con medidas de proteccion adecuadas conforme a los estandares internacionales de privacidad.</p>

<h2>9. Menores de Edad</h2>
<p>La Plataforma no esta dirigida a menores de 18 anos. No recopilamos intencionalmente informacion de menores. Si detectamos que hemos recopilado datos de un menor, procederemos a eliminarlos de inmediato.</p>

<h2>10. Cambios en esta Politica</h2>
<p>Podemos actualizar esta Politica de Privacidad periodicamente. Le notificaremos sobre cambios significativos a traves de un aviso en la Plataforma o por correo electronico. Le recomendamos revisar esta pagina regularmente.</p>

<h2>11. Contacto</h2>
<p>Si tiene preguntas o inquietudes sobre esta Politica de Privacidad, puede contactarnos en <strong>contacto@speakerslatam.net</strong> o a traves de <a href="/contacto">nuestra pagina de contacto</a>.</p>

<p><em>Ultima actualizacion: Abril 2026</em></p>
HTML
            ]
        );
    }
}
