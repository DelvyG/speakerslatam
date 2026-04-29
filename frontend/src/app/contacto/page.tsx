import type { Metadata } from "next";
import {
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Users,
  Headphones,
} from "lucide-react";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contacto - SpeakerLATAM",
  description:
    "Ponte en contacto con SpeakerLATAM. Estamos aqui para ayudarte a encontrar el conferencista ideal o resolver cualquier duda.",
};

const INFO_ITEMS = [
  {
    icon: Mail,
    title: "Correo electronico",
    description: "Escribenos y te respondemos en menos de 24 horas.",
    detail: "contacto@speakerslatam.net",
  },
  {
    icon: MapPin,
    title: "Cobertura",
    description:
      "Operamos en toda America Latina con sede principal en Venezuela.",
    detail: "LATAM - Remoto",
  },
  {
    icon: Clock,
    title: "Horario de atencion",
    description: "Lunes a viernes, listos para atenderte.",
    detail: "9:00 AM - 6:00 PM (GMT-4)",
  },
];

const REASONS = [
  {
    icon: MessageCircle,
    title: "Consultas generales",
    description:
      "Tienes preguntas sobre nuestra plataforma, servicios o como funciona el directorio.",
  },
  {
    icon: Users,
    title: "Quiero ser conferencista",
    description:
      "Eres speaker profesional y quieres formar parte de nuestro directorio en LATAM.",
  },
  {
    icon: Headphones,
    title: "Soporte y ayuda",
    description:
      "Necesitas ayuda tecnica con tu cuenta, perfil o cualquier aspecto de la plataforma.",
  },
];

export default function ContactoPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[420px] items-center overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.25_0.08_255)]">
        {/* Decorative blurs */}
        <div className="pointer-events-none absolute -right-40 -top-40 size-[500px] rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-5 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              Contacto
            </span>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Hablemos sobre tu proximo gran evento
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
              Ya sea que busques un conferencista, quieras unirte a nuestro
              directorio o simplemente tengas una pregunta, estamos aqui para
              ayudarte.
            </p>
          </div>
        </div>
      </section>

      {/* ── Info cards ───────────────────────────────────────────── */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {INFO_ITEMS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-white p-6 text-center shadow-[0_20px_40px_rgba(10,37,64,0.08)] transition-all hover:-translate-y-1"
              >
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/5">
                  <item.icon className="size-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="mt-3 text-sm font-semibold text-accent">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reasons + Form ───────────────────────────────────────── */}
      <section className="scroll-mt-20 bg-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left column - reasons */}
            <div>
              <h2 className="text-3xl font-bold leading-tight text-primary sm:text-4xl">
                Enviar un mensaje
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Completa el formulario y nuestro equipo se pondra en contacto
                contigo lo antes posible.
              </p>

              <div className="mt-10 space-y-6">
                {REASONS.map((reason) => (
                  <div key={reason.title} className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                      <reason.icon className="size-5 text-accent" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-primary">
                        {reason.title}
                      </h5>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column - form */}
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
