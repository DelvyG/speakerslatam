"use client";

import Link from "next/link";
import LegalModal from "@/components/ui/LegalModal";

export default function FooterLegal() {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
        Soporte
      </h3>
      <ul className="space-y-2.5">
        <li>
          <Link
            href="/contacto"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            Contacto
          </Link>
        </li>
        <li>
          <LegalModal slug="terminos">
            Terminos y Condiciones
          </LegalModal>
        </li>
        <li>
          <LegalModal slug="privacidad">
            Politica de Privacidad
          </LegalModal>
        </li>
      </ul>
    </div>
  );
}
