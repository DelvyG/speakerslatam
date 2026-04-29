<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Topic;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Liderazgo',
                'slug' => 'liderazgo',
                'icon' => 'trophy',
                'order' => 1,
                'topics' => [
                    'Liderazgo transformacional',
                    'Gestión de equipos',
                    'Toma de decisiones',
                    'Liderazgo femenino',
                ],
            ],
            [
                'name' => 'Innovación',
                'slug' => 'innovacion',
                'icon' => 'lightbulb',
                'order' => 2,
                'topics' => [
                    'Transformación digital',
                    'Design thinking',
                    'Cultura de innovación',
                    'Inteligencia artificial',
                ],
            ],
            [
                'name' => 'Marketing',
                'slug' => 'marketing',
                'icon' => 'megaphone',
                'order' => 3,
                'topics' => [
                    'Marketing digital',
                    'Branding personal',
                    'Redes sociales',
                    'Estrategia de contenido',
                ],
            ],
            [
                'name' => 'Ventas',
                'slug' => 'ventas',
                'icon' => 'trending-up',
                'order' => 4,
                'topics' => [
                    'Negociación',
                    'Ventas consultivas',
                    'Social selling',
                    'Cierre de ventas',
                ],
            ],
            [
                'name' => 'Tecnología',
                'slug' => 'tecnologia',
                'icon' => 'cpu',
                'order' => 5,
                'topics' => [
                    'IA aplicada a negocios',
                    'Ciberseguridad',
                    'Cloud computing',
                    'Blockchain',
                ],
            ],
            [
                'name' => 'Desarrollo Personal',
                'slug' => 'desarrollo-personal',
                'icon' => 'user',
                'order' => 6,
                'topics' => [
                    'Productividad',
                    'Inteligencia emocional',
                    'Mindfulness',
                    'Gestión del cambio',
                ],
            ],
            [
                'name' => 'Emprendimiento',
                'slug' => 'emprendimiento',
                'icon' => 'rocket',
                'order' => 7,
                'topics' => [
                    'Startups',
                    'Modelos de negocio',
                    'Financiamiento',
                    'Escalabilidad',
                ],
            ],
            [
                'name' => 'Recursos Humanos',
                'slug' => 'recursos-humanos',
                'icon' => 'users',
                'order' => 8,
                'topics' => [
                    'Cultura organizacional',
                    'Bienestar laboral',
                    'Employer branding',
                    'Gestión del talento',
                ],
            ],
        ];

        foreach ($categories as $categoryData) {
            $topics = $categoryData['topics'];
            unset($categoryData['topics']);

            $category = Category::create($categoryData);

            foreach ($topics as $topicName) {
                Topic::create([
                    'name' => $topicName,
                    'slug' => \Illuminate\Support\Str::slug($topicName),
                    'category_id' => $category->id,
                ]);
            }
        }
    }
}
