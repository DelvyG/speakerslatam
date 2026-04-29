# Convenciones de Código - SpeakerLATAM

## Idioma
- Código (variables, funciones, clases): inglés
- UI visible al usuario: español neutro LATAM
- Comentarios: español
- Documentación: español
- Commits: inglés con conventional commits (feat:, fix:, refactor:, etc.)

## Backend Laravel
- Controllers en singular: SpeakerController, CompanyController
- Models en singular: Speaker, Company, Membership
- Migraciones siguen convención Laravel
- Form Requests para toda validación
- API Resources para todas las respuestas JSON
- Service classes para lógica compleja (carpeta App/Services)
- Nunca lógica de negocio en Controllers, solo coordinación
- Usar enums PHP 8 para estados (MembershipStatus, LeadStatus, etc.)

## Frontend Next.js
- Componentes en PascalCase: SpeakerCard, DirectoryFilters
- Hooks personalizados con prefijo use: useSpeakerSearch
- Carpeta /components para componentes reutilizables
- Carpeta /app sigue convención App Router
- Server components por default, "use client" solo cuando necesario
- Tipos en /types compartidos
- Fetcher centralizado en /lib/api.ts
- Validación con Zod schemas en /schemas

## Base de datos
- Tablas en plural y snake_case: speakers, company_leads, addon_purchases
- Foreign keys con _id: speaker_id, company_id
- Timestamps siempre: created_at, updated_at, deleted_at (soft delete cuando aplique)
- UUIDs públicos en URLs, ID auto-incremental interno

## Git
- Branch principal: main
- Branches feature: feature/sprint-1-setup-laravel
- Branches fix: fix/dashboard-spinner-loop
- Pull requests obligatorios para merges a main
- Commit messages en inglés: "feat: add speaker registration wizard"

## Testing
- Backend: PHPUnit para feature tests críticos (membresía, pagos)
- Frontend: Playwright para E2E críticos (registro, checkout)
- No buscar 100% coverage, sí cubrir flujos de dinero
