"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitCompanyLead } from "@/lib/queries";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

const companyLeadSchema = z.object({
  company_name: z.string().min(2, "El nombre de la empresa es obligatorio"),
  contact_name: z.string().min(2, "Tu nombre es obligatorio"),
  email: z.string().email("Ingresa un correo valido"),
  phone: z.string().optional(),
  sector: z.string().min(1, "Selecciona un sector"),
  city: z.string().min(2, "La ciudad es obligatoria"),
  event_type: z.string().min(1, "Selecciona un tipo de evento"),
  event_topic: z.string().min(2, "Indica el tema del evento"),
  budget_range: z.string().min(1, "Selecciona un rango de presupuesto"),
  event_date: z.string().optional(),
  modality: z.enum(["presencial", "virtual", "both"]),
  message: z.string().optional(),
});

type CompanyLeadFormValues = z.infer<typeof companyLeadSchema>;

const EVENT_TYPES = [
  { value: "convencion_anual", label: "Convencion Anual" },
  { value: "capacitacion_interna", label: "Capacitacion Interna" },
  { value: "lanzamiento_producto", label: "Lanzamiento de Producto" },
  { value: "summit_clevel", label: "C-Level Summit" },
  { value: "congreso", label: "Congreso / Foro" },
  { value: "team_building", label: "Team Building" },
  { value: "otro", label: "Otro" },
];

const BUDGET_RANGES = [
  { value: "flexible", label: "Rango Flexible" },
  { value: "5000_10000", label: "USD 5,000 - 10,000" },
  { value: "10000_25000", label: "USD 10,000 - 25,000" },
  { value: "25000_plus", label: "Mas de USD 25,000" },
];

const SECTORS = [
  { value: "tecnologia", label: "Tecnologia" },
  { value: "finanzas", label: "Finanzas / Banca" },
  { value: "salud", label: "Salud" },
  { value: "educacion", label: "Educacion" },
  { value: "retail", label: "Retail / Consumo" },
  { value: "manufactura", label: "Manufactura" },
  { value: "energia", label: "Energia" },
  { value: "gobierno", label: "Gobierno / ONG" },
  { value: "otro", label: "Otro" },
];

const MODALITIES = [
  { value: "presencial", label: "Presencial" },
  { value: "virtual", label: "Virtual" },
  { value: "both", label: "Hibrido" },
];

const selectClassName =
  "h-10 w-full rounded-lg border border-input bg-white px-2.5 py-1 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm";

export default function CompanyLeadForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyLeadFormValues>({
    resolver: zodResolver(companyLeadSchema),
    defaultValues: {
      company_name: "",
      contact_name: "",
      email: "",
      phone: "",
      sector: "",
      city: "",
      event_type: "",
      event_topic: "",
      budget_range: "",
      event_date: "",
      modality: "presencial",
      message: "",
    },
  });

  async function onSubmit(data: CompanyLeadFormValues) {
    try {
      setStatus("idle");
      const result = await submitCompanyLead(data);
      setStatus("success");
      setServerMessage(
        result.message || "Tu solicitud fue enviada. Te contactaremos pronto."
      );
      reset();
    } catch {
      setStatus("error");
      setServerMessage(
        "Hubo un error al enviar tu solicitud. Intenta de nuevo."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-10 text-center shadow-[0_20px_40px_rgba(10,37,64,0.08)]">
        <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="size-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-primary">
          Solicitud enviada
        </h3>
        <p className="max-w-md text-muted-foreground">{serverMessage}</p>
        <Button
          className="mt-2 bg-accent text-white hover:bg-accent/90 cursor-pointer"
          onClick={() => setStatus("idle")}
        >
          Enviar otra solicitud
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_20px_40px_rgba(10,37,64,0.08)] md:p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Row: Company + Contact */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Empresa *
            </label>
            <Input
              {...register("company_name")}
              placeholder="Ej. TechCorp LATAM"
              className="h-10 bg-white"
            />
            {errors.company_name && (
              <p className="text-xs text-destructive">
                {errors.company_name.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Nombre de contacto *
            </label>
            <Input
              {...register("contact_name")}
              placeholder="Tu nombre completo"
              className="h-10 bg-white"
            />
            {errors.contact_name && (
              <p className="text-xs text-destructive">
                {errors.contact_name.message}
              </p>
            )}
          </div>
        </div>

        {/* Row: Email + Phone */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Correo electronico *
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="correo@empresa.com"
              className="h-10 bg-white"
            />
            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Telefono
            </label>
            <Input
              {...register("phone")}
              type="tel"
              placeholder="+52 (55) 1234 5678"
              className="h-10 bg-white"
            />
          </div>
        </div>

        {/* Row: Sector + City */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Sector *
            </label>
            <select {...register("sector")} className={selectClassName}>
              <option value="">Selecciona un sector</option>
              {SECTORS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.sector && (
              <p className="text-xs text-destructive">
                {errors.sector.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Ciudad *
            </label>
            <Input
              {...register("city")}
              placeholder="Ej. Ciudad de Mexico"
              className="h-10 bg-white"
            />
            {errors.city && (
              <p className="text-xs text-destructive">
                {errors.city.message}
              </p>
            )}
          </div>
        </div>

        {/* Row: Event type + Topic */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Tipo de evento *
            </label>
            <select {...register("event_type")} className={selectClassName}>
              <option value="">Selecciona tipo de evento</option>
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {errors.event_type && (
              <p className="text-xs text-destructive">
                {errors.event_type.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Tema del evento *
            </label>
            <Input
              {...register("event_topic")}
              placeholder="Ej. Liderazgo e innovacion"
              className="h-10 bg-white"
            />
            {errors.event_topic && (
              <p className="text-xs text-destructive">
                {errors.event_topic.message}
              </p>
            )}
          </div>
        </div>

        {/* Row: Date + Budget + Modality */}
        <div className="grid gap-5 md:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Fecha estimada
            </label>
            <Input
              {...register("event_date")}
              type="date"
              className="h-10 bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Presupuesto (USD) *
            </label>
            <select {...register("budget_range")} className={selectClassName}>
              <option value="">Selecciona rango</option>
              {BUDGET_RANGES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            {errors.budget_range && (
              <p className="text-xs text-destructive">
                {errors.budget_range.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Modalidad *
            </label>
            <select {...register("modality")} className={selectClassName}>
              {MODALITIES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            Mensaje / Requerimientos
          </label>
          <Textarea
            {...register("message")}
            placeholder="Cuentanos un poco mas sobre el objetivo del evento, la audiencia esperada y cualquier requerimiento especial..."
            rows={4}
            className="bg-white"
          />
        </div>

        {/* Error banner */}
        {status === "error" && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {serverMessage}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer h-12 text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar solicitud"
          )}
        </Button>
      </form>
    </div>
  );
}
