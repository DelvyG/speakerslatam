# SpeakerLATAM - Visión del Proyecto

## Qué es
Plataforma de directorio profesional que conecta conferencistas, facilitadores 
y expertos de Latinoamérica con empresas que necesitan capacitar a sus equipos.

## Modelo de negocio (3 capas)

### Capa 1: Membresía anual del speaker
- Pago único anual: $99 USD (Venezuela, fase inicial)
- Incluye: perfil público en directorio, área privada, acceso a convocatorias, 
  inclusión en newsletter mensual a empresas
- Sin niveles ni planes. Una sola decisión: pagar y entrar.

### Capa 2: Add-ons dentro de la plataforma
Servicios opcionales que el speaker contrata desde su dashboard:
- Perfil Destacado: $19/mes o $199/año
- Producción de Contenido: $120-$250 one-time
- Capacitación Speaker Pro: $99-$199 por programa
- Promoción Dirigida: $49-$99 por campaña
- Verificación Premium: $49 one-time
- Eventos Speaker LATAM: revenue share

### Capa 3: Servicios para empresas
- Acceso al directorio: gratuito
- Servicio Concierge: 20-30% comisión sobre contratos cerrados
- Retainer de Capacitación: $500-$2,000/mes
- Eventos a la medida: cotización por evento

## Mercado inicial
Venezuela. Posterior expansión a Colombia, México, Perú con tarifas 
internacionales ($149-$199/año membresía).

## Roles del sistema
1. **Visitante público**: navega directorio sin registro
2. **Empresa**: solicita servicio concierge sin registro obligatorio
3. **Speaker**: paga membresía, gestiona perfil, contrata add-ons
4. **Admin**: gestiona todo el sistema vía Filament

## Casos de uso principales
1. Speaker se registra → paga membresía → completa onboarding → admin valida → 
   perfil publicado en directorio
2. Empresa navega directorio → contacta speaker directamente o solicita concierge
3. Empresa solicita concierge → admin recibe lead en Kommo → curados 3 opciones → 
   propuesta a empresa → cierre y comisión
4. Speaker desde dashboard contrata add-on → pago Stripe → activación automática
