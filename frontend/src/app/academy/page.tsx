import type { Metadata } from "next";
import Link from "next/link";
import {
  Play,
  Clock,
  ArrowRight,
  FileDown,
  FileText,
  Star,
  Mic,
  TrendingUp,
  Palette,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Academy - SpeakerLATAM",
  description:
    "Conviertete en un conferencista de elite. Cursos, masterclasses y herramientas para dominar el escenario y construir tu marca personal.",
};

const COURSES = [
  {
    title: "Storytelling para Speakers",
    description: "Aprende a estructurar historias que cautiven y emocionen.",
    level: "Intermedio",
    duration: "8h 20min",
    instructor: "Mario Vargas",
    price: "$49.99",
    levelColor: "bg-primary/80",
  },
  {
    title: "Primeros pasos en el Escenario",
    description: "Supera el panico escenico con tecnicas profesionales.",
    level: "Gratis",
    duration: "2h 45min",
    instructor: "Diana Flores",
    price: "GRATIS",
    levelColor: "bg-accent/80",
  },
  {
    title: "Ventas de Alto Impacto",
    description: "Como vender tus conferencias a grandes corporativos.",
    level: "Avanzado",
    duration: "12h 00min",
    instructor: "Carlos Martinez",
    price: "$129.00",
    levelColor: "bg-primary/80",
  },
  {
    title: "Diseno de Visuales TED",
    description: "Presentaciones que apoyan tu discurso, no lo distraen.",
    level: "Intermedio",
    duration: "5h 45min",
    instructor: "Ana Belen",
    price: "$34.50",
    levelColor: "bg-primary/80",
  },
];

const RESOURCES = [
  {
    icon: FileDown,
    title: "Template: Professional Speaker Kit",
    description:
      "Un PDF editable con la estructura ganadora para presentarte a organizadores de eventos y marcas.",
    cta: "Descargar Ahora",
    accent: "accent",
  },
  {
    icon: FileText,
    title: "Modelo de Contrato de Speaker",
    description:
      "Protege tu propiedad intelectual y asegura tus pagos con este modelo de contrato legal estandar.",
    cta: "Descargar Ahora",
    accent: "primary",
  },
];

export default function AcademyPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            {/* Left text */}
            <div>
              <span className="mb-5 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                Speaker Academy
              </span>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl">
                Conviertete en un conferencista de elite
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                Domina el escenario, construye una marca personal influyente y
                conecta con las audiencias mas exigentes de Latinoamerica.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-accent text-white hover:bg-accent/90 cursor-pointer h-12 px-8"
                >
                  Explorar Cursos
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="cursor-pointer h-12 px-8"
                >
                  <Play className="size-4" />
                  Ver Demo
                </Button>
              </div>
            </div>

            {/* Right image placeholder */}
            <div className="relative">
              <div className="absolute inset-0 -rotate-3 scale-105 rounded-3xl bg-accent/10" />
              <div className="relative z-10 flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[oklch(0.25_0.08_255)] shadow-2xl">
                <div className="text-center text-white/60">
                  <Mic className="mx-auto size-16 opacity-40" />
                  <p className="mt-3 text-sm font-medium">Imagen del speaker</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Learning Paths (Bento) ───────────────────────────────── */}
      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              Rutas de Aprendizaje
            </h2>
            <p className="mt-2 text-muted-foreground">
              Programas curados para llevar tu carrera al siguiente nivel.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Large card - TEDx path */}
            <div className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-t from-primary via-primary/90 to-primary/50 p-8 md:col-span-2">
              {/* Decorative overlay pattern */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  De principiante a TEDx
                </h3>
                <p className="mt-3 max-w-md text-white/80">
                  El camino completo para estructurar tu charla mas poderosa y
                  llegar a los escenarios mas prestigiosos del mundo.
                </p>
                <Button
                  size="lg"
                  className="mt-6 bg-accent text-white hover:bg-accent/90 cursor-pointer"
                >
                  Iniciar Ruta
                </Button>
              </div>
            </div>

            {/* Smaller card - Personal Branding */}
            <div className="group relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-3xl bg-primary p-8">
              <div>
                <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-accent">
                  Especializacion
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Personal Branding
                </h3>
                <p className="mt-3 text-white/60">
                  Crea una identidad digital que atraiga a organizadores de
                  eventos.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
                  <TrendingUp className="size-5 text-white" />
                </div>
                <div className="text-white">
                  <p className="text-sm font-semibold">Por Elena Ruiz</p>
                  <p className="text-xs text-white/60">Estratega de Marca</p>
                </div>
              </div>
              {/* Decorative star */}
              <Star className="pointer-events-none absolute right-6 top-6 size-24 text-white opacity-[0.06]" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Course Explorer ──────────────────────────────────────── */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header with tabs */}
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-bold text-primary sm:text-3xl">
                Explora la Academia
              </h2>
              <div className="mt-5 flex gap-2">
                <span className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white">
                  Cursos
                </span>
                <span className="rounded-full bg-muted px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 cursor-pointer">
                  Masterclasses
                </span>
                <span className="rounded-full bg-muted px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 cursor-pointer">
                  Guias
                </span>
              </div>
            </div>
            <Link
              href="#"
              className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent"
            >
              Ver todos los cursos
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Course cards grid */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COURSES.map((course) => (
              <div
                key={course.title}
                className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_20px_40px_rgba(10,37,64,0.08)] transition-all hover:-translate-y-1"
              >
                {/* Image placeholder */}
                <div className="relative h-44 bg-gradient-to-br from-primary/10 to-muted">
                  <div className="flex h-full items-center justify-center">
                    <Palette className="size-10 text-muted-foreground/30" />
                  </div>
                  <span
                    className={`absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur ${course.levelColor}`}
                  >
                    {course.level}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <h4 className="text-base font-semibold text-primary">
                    {course.title}
                  </h4>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {course.description}
                  </p>

                  <div className="mt-auto pt-4">
                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="size-3.5" />
                      <span>{course.duration}</span>
                      <span className="mx-0.5 text-muted-foreground/50">
                        |
                      </span>
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <span
                        className={`font-bold ${
                          course.price === "GRATIS"
                            ? "text-accent"
                            : "text-primary"
                        }`}
                      >
                        {course.price}
                      </span>
                      <button className="flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80">
                        {course.price === "GRATIS" ? "Acceder" : "Inscribirme"}
                        <ArrowRight className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pro Tools / Resources ────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary via-primary to-[oklch(0.25_0.08_255)] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Herramientas Pro
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60 sm:text-lg">
              Descarga los recursos esenciales que utilizan los conferencistas
              profesionales para gestionar sus giras y contratos.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {RESOURCES.map((resource) => (
              <div
                key={resource.title}
                className="group flex items-start gap-5 rounded-2xl border border-white/10 bg-white/5 p-7 transition-all hover:bg-white/10"
              >
                <div
                  className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${
                    resource.accent === "accent"
                      ? "bg-accent/20"
                      : "bg-white/10"
                  }`}
                >
                  <resource.icon
                    className={`size-7 ${
                      resource.accent === "accent"
                        ? "text-accent"
                        : "text-white/80"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {resource.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {resource.description}
                  </p>
                  <button className="mt-5 flex items-center gap-2 text-sm font-medium text-accent transition-all group-hover:gap-3">
                    {resource.cta}
                    <FileDown className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
