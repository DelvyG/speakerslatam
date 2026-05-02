"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/lib/queries";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await subscribeNewsletter({ email });
      setStatus("success");
      setMessage(res.message || "Suscripcion exitosa. Gracias por unirte!");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
        const errs = axiosErr.response?.data?.errors;
        if (errs) {
          setMessage(Object.values(errs).flat().join(" "));
        } else {
          setMessage(axiosErr.response?.data?.message || "Error al suscribirse.");
        }
      } else {
        setMessage("Error al suscribirse. Intenta de nuevo.");
      }
    }
  }

  if (status === "success") {
    return (
      <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-700">
        <CheckCircle className="size-5 shrink-0" />
        {message}
      </div>
    );
  }

  return (
    <>
      <form
        className="mt-6 flex flex-col gap-3 sm:flex-row"
        onSubmit={handleSubmit}
      >
        <Input
          type="email"
          placeholder="Tu correo electronico"
          className="h-10 flex-1 bg-white"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="h-10 bg-accent text-white hover:bg-accent/90 cursor-pointer"
        >
          {status === "loading" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Suscribirme"
          )}
        </Button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-center text-xs text-destructive">{message}</p>
      )}
    </>
  );
}
