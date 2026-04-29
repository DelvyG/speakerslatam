import type { Metadata } from "next";
import Link from "next/link";
import {
  Armchair,
  Users,
  CheckCircle,
  Presentation,
  Wrench,
  Sparkles,
  ArrowRight,
  Zap,
  FileText,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CompanyLeadForm from "@/components/ui/CompanyLeadForm";

export const metadata: Metadata = {
  title: "Para Empresas - SpeakerLATAM",
  description:
    "Encuentra el speaker perfecto para tu proximo evento corporativo. Servicio de concierge personalizado para empresas en America Latina.",
};

const SERVICES = [
  {
    icon: Presentation,
    title: "Keynotes",
    description:
      "Conferencias magistrales de 45 a 60 minutos disenadas para inspirar, provocar el cambio y movilizar a la audiencia.",
  },
  {
    icon: Wrench,
    title: "Workshops",
    description:
      "Sesiones de trabajo inmersivas de media jornada o dia completo para el desarrollo de habilidades especificas.",
  },
  {
    icon: Sparkles,
    title: "Curaduria",
    description:
      "Analisis personalizado de su evento para seleccionar el talento que mejor se alinea con sus objetivos estrategicos.",
  },
];

const TRUST_LOGOS = [
  "TechCorp",
  "Bancolombia",
  "Grupo Alfa",
  "Ecopetrol",
  "Mercado Libre",
  "Globant",
];

export default function ParaEmpresasPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.25_0.08_255)]">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute -right-40 -top-40 size-[500px] rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <span className="mb-5 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              Soluciones Corporativas
            </span>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Encuentra el speaker perfecto para tu proximo evento corporativo
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Conectamos a las organizaciones lideres de Latinoamerica con las
              mentes mas brillantes en liderazgo, tecnologia e innovacion.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#solicitar">
                <Button
                  size="lg"
                  className="w-full bg-accent text-white hover:bg-accent/90 sm:w-auto cursor-pointer h-12 px-8"
                >
                  Solicitar propuesta
                </Button>
              </a>
              <a href="#solicitar">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10 sm:w-auto cursor-pointer h-12 px-8"
                >
                  <CalendarDays className="size-4" />
                  Agendar llamada con un asesor
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Intent Selection ─────────────────────────────────────── */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Option 1 - Organizar un Evento */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-white p-8 shadow-[0_20px_40px_rgba(10,37,64,0.08)] transition-all hover:-translate-y-1">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/5">
                  <Armchair className="size-7 text-primary" />
                </div>
                <ArrowRight className="size-5 text-muted-foreground transition-colors group-hover:text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary">
                Organizar un Evento
              </h3>
              <p className="mt-3 text-muted-foreground">
                Elevamos el impacto de tus convenciones, lanzamientos y congresos
                anuales con conferencistas de alto nivel.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <CheckCircle className="size-4 shrink-0 text-accent" />
                  Curaduria de talento internacional
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <CheckCircle className="size-4 shrink-0 text-accent" />
                  Logistica tecnica y produccion
                </li>
              </ul>
            </div>

            {/* Option 2 - Capacitar a mi Equipo */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-white p-8 shadow-[0_20px_40px_rgba(10,37,64,0.08)] transition-all hover:-translate-y-1">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex size-16 items-center justify-center rounded-full bg-accent/10">
                  <Users className="size-7 text-accent" />
                </div>
                <ArrowRight className="size-5 text-muted-foreground transition-colors group-hover:text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-primary">
                Capacitar a mi Equipo
              </h3>
              <p className="mt-3 text-muted-foreground">
                Programas de formacion continua, workshops practicos y mentorias
                para mandos medios y directivos.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <CheckCircle className="size-4 shrink-0 text-accent" />
                  Metodologias de aprendizaje activo
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <CheckCircle className="size-4 shrink-0 text-accent" />
                  Medicion de impacto y KPIs
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────── */}
      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              Nuestros Servicios
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {SERVICES.map((service) => (
              <div key={service.title} className="text-center">
                <div className="mx-auto mb-5 inline-flex size-16 items-center justify-center rounded-2xl border border-border bg-white shadow-sm">
                  <service.icon className="size-7 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-primary">
                  {service.title}
                </h4>
                <p className="mt-3 text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust / Logos ────────────────────────────────────────── */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary sm:text-3xl">
                Confian en nosotros
              </h2>
              <p className="mt-2 text-muted-foreground">
                Mas de 500 empresas han transformado su cultura con
                SpeakerLATAM.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white">
              <ShieldCheck className="size-4" />
              NDA Ready & Corporate Standard
            </div>
          </div>

          {/* Logo placeholder grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {TRUST_LOGOS.map((name) => (
              <div
                key={name}
                className="flex h-14 items-center justify-center rounded-lg bg-muted/60 px-4 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
              >
                <span className="text-sm font-semibold tracking-tight text-muted-foreground">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lead Form ────────────────────────────────────────────── */}
      <section
        id="solicitar"
        className="scroll-mt-20 bg-muted py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left column - copy */}
            <div>
              <h2 className="text-3xl font-bold leading-tight text-primary sm:text-4xl">
                Solicita una propuesta personalizada
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Cuentanos sobre tu evento o programa de capacitacion. Uno de
                nuestros curadores senior se pondra en contacto en menos de 24
                horas.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <Zap className="mt-0.5 size-5 shrink-0 text-accent" />
                  <div>
                    <h5 className="text-sm font-semibold text-primary">
                      Respuesta rapida
                    </h5>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Sabemos que el tiempo es clave. Recibe opciones
                      disponibles hoy mismo.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <FileText className="mt-0.5 size-5 shrink-0 text-accent" />
                  <div>
                    <h5 className="text-sm font-semibold text-primary">
                      Contratacion directa
                    </h5>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Gestion transparente de contratos y facturacion regional.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - form */}
            <CompanyLeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
