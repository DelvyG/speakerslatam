"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { useSiteSettings, getBackendUrl } from "@/lib/site-settings";

const NAV_LINKS = [
  { href: "/directorio", label: "Directorio" },
  { href: "/para-empresas", label: "Para Empresas" },
  { href: "/academy", label: "Academy" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const settings = useSiteSettings();
  const logoUrl = getBackendUrl(settings.logo_url);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={settings.site_name || "SpeakerLATAM"}
              width={180}
              height={48}
              className="h-9 w-auto"
              priority
            />
          ) : (
            <>
              <span className="text-xl font-bold tracking-tight text-primary">
                Speaker
              </span>
              <span className="text-xl font-bold tracking-tight text-accent">
                LATAM
              </span>
            </>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Iniciar Sesion
          </Link>
          <Link href="/registro">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer">
              Registrate
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              className="inline-flex size-10 items-center justify-center rounded-md text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetHeader className="border-b px-4 py-4">
                <SheetTitle>
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={settings.site_name || "SpeakerLATAM"}
                      width={140}
                      height={38}
                      className="h-8 w-auto"
                    />
                  ) : (
                    <>
                      <span className="font-bold text-primary">Speaker</span>
                      <span className="font-bold text-accent">LATAM</span>
                    </>
                  )}
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                {NAV_LINKS.map((link) => (
                  <SheetClose key={link.href} render={<Link href={link.href} />}>
                    <span className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
                      {link.label}
                    </span>
                  </SheetClose>
                ))}
                <div className="my-2 h-px bg-border" />
                <SheetClose render={<Link href="/login" />}>
                  <span className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
                    Iniciar Sesion
                  </span>
                </SheetClose>
                <Link
                  href="/registro"
                  className="mt-2 block w-full rounded-md bg-accent px-3 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  Registrate
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
