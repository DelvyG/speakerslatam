<?php

namespace Database\Seeders;

use App\Enums\MembershipStatus;
use App\Enums\Modality;
use App\Enums\SpeakerStatus;
use App\Models\Category;
use App\Models\Language;
use App\Models\Membership;
use App\Models\Speaker;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SpeakerSeeder extends Seeder
{
    public function run(): void
    {
        $speakers = [
            [
                'first_name' => 'Ana',
                'last_name' => 'Martinez',
                'city' => 'Caracas',
                'bio_short' => 'Experta en liderazgo transformacional con 15 anos de experiencia formando equipos de alto rendimiento en organizaciones latinoamericanas.',
                'bio_long' => 'Ana Martinez es una reconocida conferencista y consultora en liderazgo organizacional. Con mas de 15 anos de experiencia en el sector corporativo, ha trabajado con empresas de todos los tamanos en Venezuela y la region. Su enfoque combina la neurociencia del liderazgo con herramientas practicas que los equipos pueden implementar de inmediato. Ha formado a mas de 5,000 lideres en LATAM.',
                'modality' => Modality::Both,
                'fee_range' => '$500 - $1,500',
                'experience_years' => 15,
                'is_featured' => true,
                'is_verified' => true,
                'categories' => ['liderazgo'],
                'topics' => ['liderazgo-transformacional', 'gestion-de-equipos'],
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'linkedin_url' => 'https://linkedin.com/in/example',
                'photo_url' => 'https://randomuser.me/api/portraits/women/44.jpg',
            ],
            [
                'first_name' => 'Ricardo',
                'last_name' => 'Silva',
                'city' => 'Maracaibo',
                'bio_short' => 'Especialista en transformacion digital y estrategia de innovacion. Ayudo a empresas a adoptar tecnologia con impacto real en sus resultados.',
                'bio_long' => 'Ricardo Silva es ingeniero de sistemas y MBA con especializacion en innovacion. Durante 12 anos ha liderado procesos de transformacion digital en empresas venezolanas y colombianas. Su metodologia "Innovacion con Proposito" ha sido adoptada por mas de 40 organizaciones. Columnista en medios especializados y mentor en programas de emprendimiento.',
                'modality' => Modality::Both,
                'fee_range' => '$800 - $2,000',
                'experience_years' => 12,
                'is_featured' => true,
                'is_verified' => true,
                'categories' => ['innovacion', 'tecnologia'],
                'topics' => ['transformacion-digital', 'cultura-de-innovacion'],
                'video_url' => null,
                'linkedin_url' => 'https://linkedin.com/in/example',
                'photo_url' => 'https://randomuser.me/api/portraits/men/32.jpg',
            ],
            [
                'first_name' => 'Elena',
                'last_name' => 'Ruiz',
                'city' => 'Valencia',
                'bio_short' => 'Consultora en marketing digital y branding personal. Creo estrategias que posicionan marcas y personas en el mercado latinoamericano.',
                'bio_long' => 'Elena Ruiz es especialista en marketing digital con enfoque en branding personal para profesionales y empresas. Ha desarrollado estrategias de posicionamiento para mas de 200 clientes en Venezuela y el Caribe. Su conferencia "Tu Marca Eres Tu" ha sido presentada en mas de 50 eventos corporativos. Certificada en Google Ads y Meta Business.',
                'modality' => Modality::Virtual,
                'fee_range' => '$400 - $1,000',
                'experience_years' => 8,
                'is_featured' => true,
                'is_verified' => true,
                'categories' => ['marketing'],
                'topics' => ['branding-personal', 'marketing-digital', 'redes-sociales'],
                'video_url' => null,
                'linkedin_url' => null,
                'photo_url' => 'https://randomuser.me/api/portraits/women/68.jpg',
            ],
            [
                'first_name' => 'Carlos',
                'last_name' => 'Mendoza',
                'city' => 'Barquisimeto',
                'bio_short' => 'Coach de ventas consultivas y negociacion. Mas de 10 anos entrenando equipos comerciales que superan sus metas consistentemente.',
                'bio_long' => 'Carlos Mendoza es coach certificado en ventas y negociacion con mas de 10 anos de experiencia en el sector comercial. Ha entrenado a mas de 3,000 vendedores en Venezuela, Colombia y Panama. Su programa "Ventas con Ciencia" combina psicologia del consumidor con tecnicas de cierre probadas. Ex director comercial de empresas multinacionales.',
                'modality' => Modality::Presencial,
                'fee_range' => '$600 - $1,500',
                'experience_years' => 10,
                'is_featured' => false,
                'is_verified' => true,
                'categories' => ['ventas'],
                'topics' => ['negociacion', 'ventas-consultivas', 'cierre-de-ventas'],
                'video_url' => null,
                'linkedin_url' => 'https://linkedin.com/in/example',
                'photo_url' => 'https://randomuser.me/api/portraits/men/75.jpg',
            ],
            [
                'first_name' => 'Gabriela',
                'last_name' => 'Torres',
                'city' => 'Puerto Ordaz',
                'bio_short' => 'Facilitadora en inteligencia emocional y bienestar laboral. Transformo culturas organizacionales desde el desarrollo humano.',
                'bio_long' => 'Gabriela Torres es psicologa organizacional con maestria en desarrollo humano. Lleva 9 anos facilitando talleres y conferencias sobre inteligencia emocional, mindfulness corporativo y bienestar en el trabajo. Ha trabajado con empresas del sector petrolero, bancario y tecnologico en Venezuela. Autora del libro "Equipos que Sienten, Equipos que Rinden".',
                'modality' => Modality::Both,
                'fee_range' => '$400 - $1,200',
                'experience_years' => 9,
                'is_featured' => false,
                'is_verified' => true,
                'categories' => ['desarrollo-personal', 'recursos-humanos'],
                'topics' => ['inteligencia-emocional', 'mindfulness', 'bienestar-laboral'],
                'video_url' => null,
                'linkedin_url' => null,
                'photo_url' => 'https://randomuser.me/api/portraits/women/90.jpg',
            ],
            [
                'first_name' => 'Miguel',
                'last_name' => 'Herrera',
                'city' => 'Merida',
                'bio_short' => 'Emprendedor serial y mentor de startups. He fundado 3 empresas y ahora ayudo a otros a escalar sus negocios en LATAM.',
                'bio_long' => 'Miguel Herrera es emprendedor con mas de 14 anos de experiencia fundando y escalando negocios en Venezuela y Estados Unidos. Ha levantado mas de $2M en capital para sus proyectos. Actualmente es mentor en Wayra y 500 Startups LATAM. Su conferencia "Del Garaje al Mercado" inspira a cientos de emprendedores cada ano.',
                'modality' => Modality::Both,
                'fee_range' => '$700 - $2,000',
                'experience_years' => 14,
                'is_featured' => true,
                'is_verified' => true,
                'categories' => ['emprendimiento'],
                'topics' => ['startups', 'modelos-de-negocio', 'escalabilidad'],
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'linkedin_url' => 'https://linkedin.com/in/example',
                'photo_url' => 'https://randomuser.me/api/portraits/men/46.jpg',
            ],
            [
                'first_name' => 'Patricia',
                'last_name' => 'Gonzalez',
                'city' => 'Caracas',
                'bio_short' => 'Experta en cultura organizacional y gestion del talento. Diseno estrategias de employer branding que atraen y retienen al mejor equipo.',
                'bio_long' => 'Patricia Gonzalez es especialista en recursos humanos con 11 anos de experiencia en empresas multinacionales. Ha liderado procesos de transformacion cultural en organizaciones de mas de 500 empleados. Su enfoque integra datos, psicologia organizacional y diseno de experiencia del empleado. Ponente frecuente en foros de HR en Venezuela y Colombia.',
                'modality' => Modality::Virtual,
                'fee_range' => '$500 - $1,200',
                'experience_years' => 11,
                'is_featured' => false,
                'is_verified' => true,
                'categories' => ['recursos-humanos'],
                'topics' => ['cultura-organizacional', 'employer-branding', 'gestion-del-talento'],
                'video_url' => null,
                'linkedin_url' => 'https://linkedin.com/in/example',
                'photo_url' => 'https://randomuser.me/api/portraits/women/26.jpg',
            ],
            [
                'first_name' => 'Jose',
                'last_name' => 'Ramirez',
                'city' => 'San Cristobal',
                'bio_short' => 'Conferencista en ciberseguridad y privacidad digital. Hago que temas complejos sean comprensibles y accionables para cualquier audiencia.',
                'bio_long' => 'Jose Ramirez es ingeniero en computacion con certificaciones CISSP y CEH. Ha trabajado 10 anos en ciberseguridad para empresas financieras y tecnologicas. Su habilidad para traducir conceptos tecnicos en lenguaje claro lo ha convertido en uno de los speakers mas solicitados en el area. Ha presentado en mas de 30 eventos corporativos y universitarios.',
                'modality' => Modality::Both,
                'fee_range' => '$600 - $1,800',
                'experience_years' => 10,
                'is_featured' => false,
                'is_verified' => false,
                'categories' => ['tecnologia'],
                'topics' => ['ciberseguridad', 'ia-aplicada-a-negocios'],
                'video_url' => null,
                'linkedin_url' => null,
                'photo_url' => 'https://randomuser.me/api/portraits/men/22.jpg',
            ],
            [
                'first_name' => 'Maria',
                'last_name' => 'Fernandez',
                'city' => 'Maracay',
                'bio_short' => 'Especialista en productividad y gestion del tiempo. Mi metodo "3H" ha ayudado a miles de profesionales a recuperar el control de su agenda.',
                'bio_long' => 'Maria Fernandez es coach de productividad certificada con 7 anos de experiencia. Creo el metodo "3H" (Habitos, Herramientas, Horas) que ha sido implementado en mas de 80 empresas en Venezuela. Su enfoque practico y orientado a resultados la diferencia de los enfoques teoricos tradicionales. Colaboradora en podcasts y medios digitales de productividad.',
                'modality' => Modality::Virtual,
                'fee_range' => '$300 - $800',
                'experience_years' => 7,
                'is_featured' => false,
                'is_verified' => true,
                'categories' => ['desarrollo-personal'],
                'topics' => ['productividad', 'gestion-del-cambio'],
                'video_url' => null,
                'linkedin_url' => 'https://linkedin.com/in/example',
                'photo_url' => 'https://randomuser.me/api/portraits/women/52.jpg',
            ],
            [
                'first_name' => 'Andres',
                'last_name' => 'Lopez',
                'city' => 'Lecheria',
                'bio_short' => 'Consultor en estrategia de contenido y social selling. Convierto la presencia digital de tu empresa en un canal de ventas real.',
                'bio_long' => 'Andres Lopez es estratega digital con 8 anos de experiencia en marketing de contenidos y social selling. Ha gestionado estrategias para marcas con mas de 500K seguidores y generado pipelines de ventas por mas de $3M a traves de canales digitales. Su taller "LinkedIn como Maquina de Ventas" es uno de los mas solicitados en el circuito corporativo venezolano.',
                'modality' => Modality::Both,
                'fee_range' => '$400 - $1,000',
                'experience_years' => 8,
                'is_featured' => false,
                'is_verified' => true,
                'categories' => ['marketing', 'ventas'],
                'topics' => ['estrategia-de-contenido', 'social-selling', 'redes-sociales'],
                'video_url' => null,
                'linkedin_url' => 'https://linkedin.com/in/example',
                'photo_url' => 'https://randomuser.me/api/portraits/men/86.jpg',
            ],
            [
                'first_name' => 'Laura',
                'last_name' => 'Castillo',
                'city' => 'Barinas',
                'bio_short' => 'Conferencista en liderazgo femenino y toma de decisiones. Impulso a mujeres profesionales a ocupar los espacios que merecen.',
                'bio_long' => 'Laura Castillo es abogada y coach ejecutiva con 13 anos de experiencia en posiciones de liderazgo. Ha sido directora legal en empresas del sector energetico y ahora se dedica a conferencias y mentoria para mujeres en roles de liderazgo. Su programa "Decide y Lidera" ha impactado a mas de 2,000 mujeres profesionales en Venezuela y Colombia.',
                'modality' => Modality::Presencial,
                'fee_range' => '$500 - $1,500',
                'experience_years' => 13,
                'is_featured' => true,
                'is_verified' => true,
                'categories' => ['liderazgo'],
                'topics' => ['liderazgo-femenino', 'toma-de-decisiones'],
                'video_url' => null,
                'linkedin_url' => 'https://linkedin.com/in/example',
                'photo_url' => 'https://randomuser.me/api/portraits/women/79.jpg',
            ],
            [
                'first_name' => 'Diego',
                'last_name' => 'Vargas',
                'city' => 'Punto Fijo',
                'bio_short' => 'Facilitador en design thinking e innovacion corporativa. Creo experiencias de aprendizaje que desbloquean la creatividad de los equipos.',
                'bio_long' => 'Diego Vargas es disenador industrial y facilitador certificado en design thinking por la d.school de Stanford. Con 6 anos de experiencia, ha facilitado mas de 100 workshops de innovacion para empresas en Venezuela, Peru y Chile. Su enfoque ludico y orientado a prototipos rapidos genera resultados tangibles en cada sesion.',
                'modality' => Modality::Presencial,
                'fee_range' => '$600 - $1,500',
                'experience_years' => 6,
                'is_featured' => false,
                'is_verified' => false,
                'categories' => ['innovacion'],
                'topics' => ['design-thinking', 'cultura-de-innovacion'],
                'video_url' => null,
                'linkedin_url' => null,
                'photo_url' => 'https://randomuser.me/api/portraits/men/55.jpg',
            ],
        ];

        $allLanguages = Language::all();
        $spanish = $allLanguages->firstWhere('code', 'es');
        $english = $allLanguages->firstWhere('code', 'en');

        foreach ($speakers as $data) {
            $user = User::create([
                'name' => $data['first_name'] . ' ' . $data['last_name'],
                'email' => Str::slug($data['first_name'] . '.' . $data['last_name']) . '@example.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
            $user->assignRole('speaker');

            $speaker = Speaker::create([
                'user_id' => $user->id,
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'bio_short' => $data['bio_short'],
                'bio_long' => $data['bio_long'],
                'city' => $data['city'],
                'country' => 'Venezuela',
                'phone' => '+58 4' . rand(12, 26) . ' ' . rand(100, 999) . ' ' . rand(1000, 9999),
                'linkedin_url' => $data['linkedin_url'],
                'website_url' => null,
                'video_url' => $data['video_url'],
                'modality' => $data['modality'],
                'fee_range' => $data['fee_range'],
                'experience_years' => $data['experience_years'],
                'is_featured' => $data['is_featured'],
                'is_verified' => $data['is_verified'],
                'status' => SpeakerStatus::Active,
                'published_at' => now()->subDays(rand(1, 60)),
            ]);

            // Asignar categorias
            $categoryIds = Category::whereIn('slug', $data['categories'])->pluck('id');
            $speaker->categories()->attach($categoryIds);

            // Asignar temas
            $topicIds = Topic::whereIn('slug', $data['topics'])->pluck('id');
            $speaker->topics()->attach($topicIds);

            // Asignar idiomas (todos hablan espanol, algunos ingles)
            $langIds = [$spanish->id];
            if (rand(0, 1)) {
                $langIds[] = $english->id;
            }
            $speaker->languages()->attach($langIds);

            // Crear membresia activa
            Membership::create([
                'speaker_id' => $speaker->id,
                'starts_at' => now()->subMonths(rand(1, 6)),
                'expires_at' => now()->addMonths(rand(3, 12)),
                'amount_paid' => 99.00,
                'currency' => 'USD',
                'payment_method' => 'stripe',
                'stripe_payment_id' => 'pi_demo_' . Str::random(10),
                'status' => MembershipStatus::Active,
            ]);

            // Descargar y asignar foto
            try {
                $speaker->addMediaFromUrl($data['photo_url'])
                    ->toMediaCollection('photo');
                $this->command->info("Foto descargada para: {$data['first_name']} {$data['last_name']}");
            } catch (\Exception $e) {
                $this->command->warn("No se pudo descargar foto para {$data['first_name']}: {$e->getMessage()}");
            }
        }

        $this->command->info('12 speakers de ejemplo creados exitosamente.');
    }
}
