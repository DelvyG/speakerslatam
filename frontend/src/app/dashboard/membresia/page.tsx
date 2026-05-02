"use client";

import { useEffect, useState, useRef } from "react";
import {
  CheckCircle,
  Loader2,
  AlertCircle,
  CreditCard,
  Upload,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

interface Plan {
  id: number;
  name: string;
  slug: string;
  price: string;
  currency: string;
  duration_days: number;
  features: string[];
}

interface PaymentAccountData {
  id: number;
  name: string;
  type: string;
  details: string;
  instructions: string;
}

interface MyMembership {
  id: number;
  plan_name: string;
  amount_paid: string;
  status: string;
  status_label: string;
  starts_at: string;
  expires_at: string;
  payment_platform: string;
  has_proof: boolean;
}

const selectClassName =
  "h-10 w-full rounded-lg border border-input bg-white px-2.5 py-1 text-base font-sans outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm";

export default function MembresiaPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [accounts, setAccounts] = useState<PaymentAccountData[]>([]);
  const [membership, setMembership] = useState<MyMembership | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [paymentPlatform, setPaymentPlatform] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      api.get<{ data: Plan[] }>("/membership/plans"),
      api.get<{ data: PaymentAccountData[] }>("/membership/payment-accounts"),
      api.get<{ data: MyMembership | null }>("/membership/my"),
    ])
      .then(([plansRes, accRes, memRes]) => {
        setPlans(plansRes.data.data);
        setAccounts(accRes.data.data);
        setMembership(memRes.data.data);
        if (plansRes.data.data.length > 0) {
          setSelectedPlan(plansRes.data.data[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPlan || !paymentPlatform || !paymentReference || !paymentDate || !proofFile) {
      setErrorMsg("Completa todos los campos y sube el comprobante.");
      setStatus("error");
      return;
    }

    setSubmitting(true);
    setStatus("idle");
    try {
      const formData = new FormData();
      formData.append("plan_id", String(selectedPlan));
      formData.append("payment_platform", paymentPlatform);
      formData.append("payment_reference", paymentReference);
      formData.append("payment_date", paymentDate);
      formData.append("proof", proofFile);

      await api.post("/membership/pay", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      if (typeof err === "object" && err !== null && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setErrorMsg(axiosErr.response?.data?.message || "Error al enviar el pago.");
      } else {
        setErrorMsg("Error al enviar el pago.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Already has membership
  if (membership) {
    const isActive = membership.status === "active";
    const isPending = membership.status === "pending";

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary">Mi Membresia</h1>

        <div className={`rounded-xl border p-6 shadow-sm ${
          isActive ? "border-green-200 bg-green-50" : isPending ? "border-amber-200 bg-amber-50" : "border-border bg-white"
        }`}>
          <div className="flex items-start gap-4">
            <div className={`flex size-12 items-center justify-center rounded-xl ${
              isActive ? "bg-green-100" : isPending ? "bg-amber-100" : "bg-muted"
            }`}>
              {isActive ? <CheckCircle className="size-6 text-green-600" /> :
               isPending ? <Clock className="size-6 text-amber-600" /> :
               <AlertCircle className="size-6 text-muted-foreground" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-primary">
                {membership.plan_name || "Membresia"}
              </h2>
              <p className={`text-sm font-semibold ${
                isActive ? "text-green-700" : isPending ? "text-amber-700" : "text-muted-foreground"
              }`}>
                {membership.status_label}
              </p>
              {isActive && membership.expires_at && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Vigente hasta: {new Date(membership.expires_at).toLocaleDateString("es-LA")}
                </p>
              )}
              {isPending && (
                <p className="mt-2 text-sm text-amber-700">
                  Tu comprobante de pago esta siendo revisado. Te notificaremos cuando sea aprobado.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment submitted successfully
  if (status === "success") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary">Mi Membresia</h1>
        <div className="flex flex-col items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="size-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-primary">Comprobante enviado</h3>
          <p className="max-w-md text-muted-foreground">
            Tu comprobante de pago fue recibido. Validaremos tu pago y activaremos
            tu membresia lo antes posible.
          </p>
        </div>
      </div>
    );
  }

  const activePlan = plans.find((p) => p.id === selectedPlan);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Membresia</h1>
        <p className="mt-1 text-muted-foreground">
          Activa tu membresia para aparecer en el directorio.
        </p>
      </div>

      {/* Plan card */}
      {activePlan && (
        <div className="rounded-xl border-2 border-accent bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary">{activePlan.name}</h2>
              <p className="text-sm text-muted-foreground">
                {activePlan.duration_days} dias de acceso
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-accent">
                ${activePlan.price}
              </p>
              <p className="text-sm text-muted-foreground">{activePlan.currency}/año</p>
            </div>
          </div>
          {activePlan.features && activePlan.features.length > 0 && (
            <ul className="mt-5 space-y-2">
              {activePlan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Star className="size-4 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Payment accounts */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-primary">
          <CreditCard className="mr-2 inline size-5" />
          Metodos de pago disponibles
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map((acc) => (
            <div key={acc.id} className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-bold text-primary">{acc.name}</h3>
              <p className="mt-1 whitespace-pre-line text-sm text-foreground">{acc.details}</p>
              {acc.instructions && (
                <p className="mt-2 text-xs text-muted-foreground">{acc.instructions}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment form */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-primary">
          <Upload className="mr-2 inline size-5" />
          Enviar comprobante de pago
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Plataforma de pago *</label>
            <select
              className={selectClassName}
              value={paymentPlatform}
              onChange={(e) => setPaymentPlatform(e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.name}>{acc.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Numero de referencia *</label>
            <Input
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="Ej. 123456789"
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Fecha del pago *</label>
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Comprobante (imagen) *</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setProofFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer h-10 overflow-hidden"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="size-4 shrink-0" />
              <span className="truncate">
                {proofFile ? proofFile.name : "Subir comprobante"}
              </span>
            </Button>
          </div>
        </div>

        {status === "error" && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="mt-6">
          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="w-full bg-accent text-white hover:bg-accent/90 cursor-pointer h-12 text-base"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar comprobante de pago"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
