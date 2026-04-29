import Link from "next/link";
import FooterLegal from "@/components/layout/FooterLegal";

const EXPLORE_LINKS = [
  { href: "/directorio", label: "Directorio" },
  { href: "/directorio?view=categorias", label: "Categorias" },
  { href: "/directorio?featured=true", label: "Conferencistas Destacados" },
];

const COMPANY_LINKS = [
  { href: "/para-empresas", label: "Servicio Concierge" },
  { href: "/para-empresas#propuesta", label: "Solicitar Propuesta" },
];

export default function Footer() {
  return (
    <footer className="bg-[oklch(0.20_0.04_255)] text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <div>
              <span className="text-xl font-bold text-white">Speaker</span>
              <span className="text-xl font-bold text-accent">LATAM</span>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              El directorio de conferencistas mas completo de America Latina.
              Conectamos empresas con los mejores speakers de la region.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Explorar
            </h3>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Empresa
            </h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <FooterLegal />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} SpeakerLATAM. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
