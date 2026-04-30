<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Marca
            ['key' => 'site_name', 'value' => 'SpeakerLATAM', 'type' => 'text', 'group' => 'brand'],
            ['key' => 'site_tagline', 'value' => 'Directorio de Conferencistas de America Latina', 'type' => 'text', 'group' => 'brand'],
            ['key' => 'logo_url', 'value' => '/branding/logo-horizontal.png', 'type' => 'text', 'group' => 'brand'],
            ['key' => 'logo_login_url', 'value' => '/branding/logo-completo.png', 'type' => 'text', 'group' => 'brand'],
            ['key' => 'favicon_url', 'value' => '/branding/favicon.png', 'type' => 'text', 'group' => 'brand'],

            // SEO
            ['key' => 'seo_title', 'value' => 'SpeakerLATAM - Directorio de Conferencistas de America Latina', 'type' => 'text', 'group' => 'seo'],
            ['key' => 'seo_description', 'value' => 'Encuentra y contrata a los mejores conferencistas, speakers y panelistas de America Latina. Directorio con mas de 500 profesionales en liderazgo, innovacion, tecnologia, ventas y mas.', 'type' => 'textarea', 'group' => 'seo'],
            ['key' => 'seo_keywords', 'value' => 'conferencistas, speakers, America Latina, conferencias, eventos, panelistas, keynote, capacitacion, LATAM', 'type' => 'textarea', 'group' => 'seo'],
            ['key' => 'seo_og_image', 'value' => '/branding/logo-completo.png', 'type' => 'text', 'group' => 'seo'],

            // Hero home
            ['key' => 'hero_image_url', 'value' => '/branding/hero-home.jpg', 'type' => 'text', 'group' => 'hero'],
            ['key' => 'hero_image_opacity', 'value' => '15', 'type' => 'text', 'group' => 'hero'],
            ['key' => 'hero_image_position', 'value' => '50', 'type' => 'text', 'group' => 'hero'],

            // Code injection
            ['key' => 'code_head', 'value' => '', 'type' => 'code', 'group' => 'code'],
            ['key' => 'code_body_start', 'value' => '', 'type' => 'code', 'group' => 'code'],
            ['key' => 'code_body_end', 'value' => '', 'type' => 'code', 'group' => 'code'],

            // Social
            ['key' => 'social_instagram', 'value' => '', 'type' => 'text', 'group' => 'social'],
            ['key' => 'social_linkedin', 'value' => '', 'type' => 'text', 'group' => 'social'],
            ['key' => 'social_twitter', 'value' => '', 'type' => 'text', 'group' => 'social'],
            ['key' => 'social_youtube', 'value' => '', 'type' => 'text', 'group' => 'social'],
            ['key' => 'contact_email', 'value' => 'contacto@speakerslatam.net', 'type' => 'text', 'group' => 'social'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
