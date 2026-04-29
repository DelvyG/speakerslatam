<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = [
            ['name' => 'Español', 'code' => 'es'],
            ['name' => 'Inglés', 'code' => 'en'],
            ['name' => 'Portugués', 'code' => 'pt'],
        ];

        foreach ($languages as $language) {
            Language::create($language);
        }
    }
}
