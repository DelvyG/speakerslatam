import Link from "next/link";
import {
  Search,
  Mic,
  Users,
  Globe,
  Building2,
  ArrowRight,
  Lightbulb,
  Handshake,
  Sparkles,
  TrendingUp,
  Brain,
  Heart,
  Megaphone,
  Palette,
  Scale,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NewsletterForm from "@/components/ui/NewsletterForm";
import HomeHero from "@/components/HomeHero";

const STATS = [
  { value: "500+", label: "Conferencistas", icon: Mic },
  { value: "1,200+", label: "Eventos", icon: Users },
  { value: "15", label: "Paises", icon: Globe },
  { value: "300+", label: "Empresas", icon: Building2 },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    title: "Explora",
    description:
      "Busca entre cientos de conferencistas por tema, pais, idioma o modalidad. Filtra hasta encontrar al speaker ideal.",
  },
  {
    icon: Handshake,
    title: "Conecta",
    description:
      "Contacta directamente al conferencista o solicita una propuesta a traves de nuestro equipo de concierge.",
  },
  {
    icon: Sparkles,
    title: "Impacta",
    description:
      "Lleva tu evento al siguiente nivel con conferencistas que inspiran, educan y transforman audiencias.",
  },
];

const CATEGORIES = [
  { name: "Liderazgo", slug: "liderazgo", icon: Lightbulb },
  { name: "Innovacion", slug: "innovacion", icon: TrendingUp },
  { name: "Tecnologia", slug: "tecnologia", icon: Brain },
  { name: "Ventas", slug: "ventas", icon: Megaphone },
  { name: "Bienestar", slug: "bienestar", icon: Heart },
  { name: "Creatividad", slug: "creatividad", icon: Palette },
  { name: "Legal", slug: "legal", icon: Scale },
  { name: "Sostenibilidad", slug: "sostenibilidad", icon: Leaf },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HomeHero />

      {/* Stats bar */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-border lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 py-8"
              >
                <stat.icon className="mb-1 size-5 text-accent" />
                <span className="text-2xl font-bold text-primary sm:text-3xl">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              Como funciona
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Encontrar al conferencista perfecto es facil con SpeakerLATAM
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, idx) => (
              <div
                key={step.title}
                className="relative rounded-xl bg-white p-6 text-center ring-1 ring-border"
              >
                <div className="absolute -top-4 left-1/2 flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                  {idx + 1}
                </div>
                <div className="mx-auto mt-2 flex size-12 items-center justify-center rounded-lg bg-primary/5">
                  <step.icon className="size-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Speakers placeholder */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary sm:text-3xl">
                Conferencistas Destacados
              </h2>
              <p className="mt-2 text-muted-foreground">
                Speakers verificados y mejor valorados de la plataforma
              </p>
            </div>
            <Link
              href="/directorio?featured=true"
              className="hidden items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80 sm:flex"
            >
              Ver todos <ArrowRight className="size-4" />
            </Link>
          </div>
          {/* Placeholder grid - will be populated from API */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex h-72 animate-pulse items-center justify-center rounded-xl bg-muted ring-1 ring-border"
              >
                <p className="text-xs text-muted-foreground">
                  Speaker Card {i}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/directorio?featured=true"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent"
            >
              Ver todos los destacados <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              Encuentra por categoria
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Explora conferencistas especializados en el tema que necesitas
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/directorio?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-xl bg-white p-5 ring-1 ring-border transition-all hover:ring-accent hover:shadow-md"
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <cat.icon className="size-6 text-accent" />
                </div>
                <span className="text-sm font-medium text-primary">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* For Business CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[oklch(0.25_0.08_255)] p-8 sm:p-12 lg:p-16">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  SpeakerLATAM for Business
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/70">
                  Servicio de concierge personalizado para empresas. Te ayudamos
                  a encontrar, evaluar y contratar al conferencista perfecto para
                  tu evento corporativo.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-accent" />
                    Curaduria personalizada de speakers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-accent" />
                    Negociacion y logistica incluida
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-accent" />
                    Garantia de satisfaccion
                  </li>
                </ul>
              </div>
              <div className="flex justify-center lg:justify-end">
                <Link href="/para-empresas">
                  <Button
                    size="lg"
                    className="bg-accent text-white hover:bg-accent/90 cursor-pointer"
                  >
                    Conoce el servicio
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              Mantente al dia
            </h2>
            <p className="mt-3 text-muted-foreground">
              Recibe recomendaciones de conferencistas, tendencias en eventos y
              contenido exclusivo de SpeakerLATAM.
            </p>
            <NewsletterForm />
            <p className="mt-3 text-xs text-muted-foreground">
              Sin spam. Puedes darte de baja en cualquier momento.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
