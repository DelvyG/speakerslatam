"use client";

import Link from "next/link";
import { Search, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings, getBackendUrl } from "@/lib/site-settings";

export default function HomeHero() {
  const settings = useSiteSettings();
  const heroImage = getBackendUrl(settings.hero_image_url);
  const opacity = Number(settings.hero_image_opacity ?? 15) / 100;
  const position = Number(settings.hero_image_position ?? 50);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.25_0.08_255)] py-20 sm:py-28 lg:py-36">
      {/* Background image */}
      {heroImage && (
        <img
          src={heroImage}
          alt=""
          className="pointer-events-none absolute inset-0 size-full object-cover"
          style={{
            opacity,
            objectPosition: `center ${position}%`,
          }}
        />
      )}

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-40 -top-40 size-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Los mejores conferencistas de Latinoamerica, en un solo lugar
          </h1>
          <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
            Descubre speakers expertos en liderazgo, innovacion, tecnologia,
            ventas y mas. Conecta con el conferencista ideal para tu proximo
            evento.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/directorio">
              <Button
                size="lg"
                className="w-full bg-accent text-white hover:bg-accent/90 sm:w-auto cursor-pointer"
              >
                <Search className="size-4" />
                Buscar conferencista
              </Button>
            </Link>
            <Link href="/registro">
              <Button
                size="lg"
                className="w-full bg-white text-primary font-semibold hover:bg-white/90 sm:w-auto cursor-pointer"
              >
                <Mic className="size-4" />
                Soy conferencista
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
