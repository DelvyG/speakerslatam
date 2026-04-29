"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage } from "@/lib/queries";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Ingresa un correo valido"),
  subject: z.string().min(2, "El asunto es obligatorio"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const SUBJECTS = [
  "Informacion general",
  "Quiero registrarme como conferencista",
  "Busco un conferencista para mi evento",
  "Alianza o patrocinio",
  "Soporte tecnico",
  "Otro",
];

const selectClassName =
  "h-10 w-full rounded-lg border border-input bg-white px-2.5 py-1 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      setStatus("idle");
      const result = await submitContactMessage(data);
      setStatus("success");
      setServerMessage(
        result.message || "Tu mensaje fue enviado. Te responderemos pronto."
      );
      reset();
    } catch {
      setStatus("error");
      setServerMessage(
        "Hubo un error al enviar tu mensaje. Intenta de nuevo."
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
          Mensaje enviado
        </h3>
        <p className="max-w-md text-muted-foreground">{serverMessage}</p>
        <Button
          className="mt-2 bg-accent text-white hover:bg-accent/90 cursor-pointer"
          onClick={() => setStatus("idle")}
        >
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_20px_40px_rgba(10,37,64,0.08)] md:p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name + Email */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Nombre completo *
            </label>
            <Input
              {...register("name")}
              placeholder="Tu nombre"
              className="h-10 bg-white"
            />
            {errors.name && (
              <p className="text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">
              Correo electronico *
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="tu@correo.com"
              className="h-10 bg-white"
            />
            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            Asunto *
          </label>
          <select {...register("subject")} className={selectClassName}>
            <option value="">Selecciona un asunto</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.subject && (
            <p className="text-xs text-destructive">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-foreground">
            Mensaje *
          </label>
          <Textarea
            {...register("message")}
            placeholder="Cuentanos en que podemos ayudarte..."
            rows={5}
            className="bg-white"
          />
          {errors.message && (
            <p className="text-xs text-destructive">
              {errors.message.message}
            </p>
          )}
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
          className="w-full bg-accent text-white hover:bg-accent/90 cursor-pointer h-12 text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar mensaje"
          )}
        </Button>
      </form>
    </div>
  );
}
