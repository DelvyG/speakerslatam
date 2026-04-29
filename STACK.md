# Stack Técnico - SpeakerLATAM

## Frontend (carpeta /frontend)
- Next.js 14+ con App Router
- TypeScript en modo estricto
- Tailwind CSS
- shadcn/ui para componentes base
- Lucide React para iconos
- React Hook Form + Zod para formularios y validación
- TanStack Query (React Query) para data fetching y cache
- Axios para llamadas HTTP a la API
- ISR (revalidate cada 60s) en directorio y perfiles públicos
- SSR en checkout y páginas autenticadas
- next-intl para internacionalización (preparado para multi-país)

## Backend (carpeta /backend)
- Laravel 11
- PHP 8.3
- MySQL 8
- Filament 3 para panel admin
- Laravel Sanctum para auth API
- Spatie Laravel Permission para roles
- Spatie Laravel MediaLibrary para gestión de imágenes/videos
- Stripe PHP SDK para pagos
- Laravel Notifications para emails (Brevo SMTP)
- Laravel Queue con database driver (Redis en producción)

## Integraciones externas
- Stripe: membresías anuales y add-ons
- Kommo CRM: webhook saliente al recibir lead empresa
- Brevo: SMTP para emails transaccionales
- AWS S3 o compatible: storage de medios en producción

## Infraestructura
- Desarrollo: local con Docker (Laravel Sail)
- Staging y producción: VPS Hetzner con Apache reverse proxy
- Frontend desplegado en Vercel
- Backend en VPS con dominio api.speakerlatam.com
- Base de datos MySQL en mismo VPS o RDS
