'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import axios from 'axios';
import { Eye, EyeOff, Users, TrendingUp, Zap, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { register as registerUser } from '@/lib/queries';
import { setToken } from '@/lib/auth';
import { useSiteSettings, getBackendUrl } from '@/lib/site-settings';

const registerSchema = z
  .object({
    name: z.string().min(1, 'El nombre es obligatorio').min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.string().min(1, 'El correo es obligatorio').email('Ingresa un correo valido'),
    password: z
      .string()
      .min(1, 'La contrasena es obligatoria')
      .min(8, 'La contrasena debe tener al menos 8 caracteres'),
    password_confirmation: z.string().min(1, 'Confirma tu contrasena'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contrasenas no coinciden',
    path: ['password_confirmation'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const STEPS = [
  { label: 'Crear Cuenta', active: true },
  { label: 'Completar Perfil', active: false },
  { label: 'Membresia', active: false },
];

const BENEFITS = [
  {
    icon: Users,
    title: 'Audiencia Premium',
    description:
      'Conecta con empresas y organizadores de eventos que buscan conferencistas de alto nivel en Latinoamerica.',
  },
  {
    icon: TrendingUp,
    title: 'Crecimiento Profesional',
    description:
      'Aumenta tu visibilidad, recibe mas solicitudes y posicionate como referente en tu area de expertise.',
  },
  {
    icon: Zap,
    title: 'Gestion Sin Friccion',
    description:
      'Perfil profesional, calendario, cotizaciones y comunicacion con clientes en una sola plataforma.',
  },
];

export default function RegistroPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const settings = useSiteSettings();
  const logoLoginUrl = getBackendUrl(settings.logo_login_url);
  const logoUrl = getBackendUrl(settings.logo_url);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError('');
    try {
      const { token } = await registerUser(values);
      setToken(token);
      router.push('/dashboard/perfil');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const messages = Object.values(errors).flat().join(' ');
        setServerError(messages);
      } else if (axios.isAxiosError(err) && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('Error al crear la cuenta. Intenta de nuevo.');
      }
    }
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-5">
      {/* Left panel - benefits (desktop only) */}
      <div className="hidden lg:flex lg:col-span-2 flex-col justify-center bg-gradient-to-br from-primary via-primary to-[oklch(0.25_0.08_255)] px-10 xl:px-14 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative">
          <Link href="/" className="mb-12 inline-block">
            {logoLoginUrl ? (
              <Image
                src={logoLoginUrl}
                alt={settings.site_name || 'SpeakerLATAM'}
                width={300}
                height={125}
                className="h-20 w-auto brightness-0 invert"
              />
            ) : (
              <span className="text-2xl font-bold text-white">SpeakerLATAM</span>
            )}
          </Link>

          <h2 className="text-2xl font-bold text-white leading-tight">
            Unete al directorio de conferencistas mas grande de LATAM
          </h2>

          <div className="mt-10 space-y-8">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <benefit.icon className="size-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="lg:col-span-3 flex flex-col px-6 py-10 sm:px-12 lg:px-16 xl:px-24">
        {/* Mobile logo */}
        <div className="lg:hidden mb-6">
          <Link href="/" className="inline-block">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={settings.site_name || 'SpeakerLATAM'}
                width={180}
                height={48}
                className="h-10 w-auto"
              />
            ) : (
              <span className="text-xl font-bold text-primary">SpeakerLATAM</span>
            )}
          </Link>
        </div>

        {/* Step indicators */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {STEPS.map((step, idx) => (
              <div key={step.label} className="flex items-center gap-2">
                {idx > 0 && (
                  <div className="h-px w-6 bg-border shrink-0 sm:w-10" />
                )}
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                      step.active
                        ? 'bg-accent text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.active ? <Check className="size-3.5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      step.active ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">
            Crea tu cuenta
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Comienza registrando tus datos basicos. Luego completaras tu perfil de conferencista.
          </p>

          {serverError && (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {serverError}
              {serverError.toLowerCase().includes('correo') && (
                <p className="mt-2">
                  Ya tienes cuenta?{' '}
                  <Link href="/login" className="font-semibold underline">
                    Inicia sesion aqui
                  </Link>
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Nombre Completo
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Juan Perez"
                autoComplete="name"
                aria-invalid={!!errors.name}
                className="h-10"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Correo electronico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className="h-10"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Contrasena
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimo 8 caracteres"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  className="h-10 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Password confirmation */}
            <div className="space-y-1.5">
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-foreground">
                Confirmar contrasena
              </label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repite tu contrasena"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password_confirmation}
                  className="h-10 pr-10"
                  {...register('password_confirmation')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-xs text-destructive">{errors.password_confirmation.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-accent text-white hover:bg-accent/90 cursor-pointer"
            >
              {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-accent hover:text-accent/80">
              Inicia sesion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
