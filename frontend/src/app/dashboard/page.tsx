"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserCircle,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { getSpeakerProfile } from "@/lib/queries";
import api from "@/lib/api";
import type { Speaker } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [membership, setMembership] = useState<{ status: string; status_label: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getSpeakerProfile(),
      api.get<{ data: { status: string; status_label: string } | null }>("/membership/my"),
    ])
      .then(([sp, memRes]) => {
        setSpeaker(sp);
        setMembership(memRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const isProfileComplete =
    !!speaker?.bio_short &&
    !!speaker?.city &&
    (speaker?.categories?.length ?? 0) > 0 &&
    (speaker?.languages?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-primary">
          Bienvenido, {user?.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona tu perfil de conferencista desde aqui.
        </p>
      </div>

      {/* Profile completion alert */}
      {!isProfileComplete && (
        <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div>
            <h3 className="text-sm font-bold text-amber-800">
              Completa tu perfil
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              Tu perfil esta incompleto. Completa tu informacion para aparecer
              en el directorio y que las empresas puedan encontrarte.
            </p>
            <Link href="/dashboard/perfil" className="mt-3 inline-block">
              <Button
                size="sm"
                className="bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
              >
                <Edit className="size-4" />
                Completar perfil
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Membership alert */}
      {isProfileComplete && !membership && (
        <div className="flex items-start gap-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <CreditCard className="mt-0.5 size-5 shrink-0 text-blue-600" />
          <div>
            <h3 className="text-sm font-bold text-blue-800">
              Activa tu membresia
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Para aparecer en el directorio necesitas una membresia activa.
              Realiza tu pago y sube el comprobante.
            </p>
            <Link href="/dashboard/membresia" className="mt-3 inline-block">
              <Button
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                <CreditCard className="size-4" />
                Ver planes y pagar
              </Button>
            </Link>
          </div>
        </div>
      )}

      {membership?.status === "pending" && (
        <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <CreditCard className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div>
            <h3 className="text-sm font-bold text-amber-800">
              Pago en revision
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              Tu comprobante de pago esta siendo verificado. Te notificaremos cuando sea aprobado.
            </p>
          </div>
        </div>
      )}

      {/* Status cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Profile status */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 items-center justify-center rounded-lg ${
                isProfileComplete ? "bg-green-100" : "bg-amber-100"
              }`}
            >
              {isProfileComplete ? (
                <CheckCircle className="size-5 text-green-600" />
              ) : (
                <AlertTriangle className="size-5 text-amber-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Estado del perfil
              </p>
              <p className="text-lg font-bold text-primary">
                {isProfileComplete ? "Completo" : "Incompleto"}
              </p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/5">
              <UserCircle className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Categorias
              </p>
              <p className="text-lg font-bold text-primary">
                {speaker?.categories?.length ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10">
              <Eye className="size-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Visibilidad
              </p>
              <p className="text-lg font-bold text-primary">
                {speaker?.slug ? "Publicado" : "No publicado"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-primary">Acciones rapidas</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/dashboard/perfil">
            <Button
              variant="outline"
              className="cursor-pointer"
            >
              <Edit className="size-4" />
              Editar perfil
            </Button>
          </Link>
          {speaker?.slug && isProfileComplete && (
            <Link href={`/directorio/${speaker.slug}`} target="_blank">
              <Button
                variant="outline"
                className="cursor-pointer"
              >
                <Eye className="size-4" />
                Ver mi perfil publico
              </Button>
            </Link>
          )}
          {!isProfileComplete && (
            <p className="text-sm text-muted-foreground">
              Completa tu perfil para que sea visible en el directorio.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
