'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login } from '@/lib/queries';
import { setToken } from '@/lib/auth';
import { useSiteSettings, getBackendUrl } from '@/lib/site-settings';

const loginSchema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('Ingresa un correo valido'),
  password: z.string().min(1, 'La contrasena es obligatoria'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const settings = useSiteSettings();
  const logoLoginUrl = getBackendUrl(settings.logo_login_url);
  const logoUrl = getBackendUrl(settings.logo_url);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError('');
    try {
      const { token } = await login(values);
      setToken(token);
      router.push('/directorio');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al iniciar sesion. Intenta de nuevo.';
      setServerError(message);
    }
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left panel - branding (desktop only) */}
      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-primary via-primary to-[oklch(0.25_0.08_255)] px-12 xl:px-20 relative overflow-hidden">
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

          <h2 className="text-3xl font-bold text-white leading-tight">
            Bienvenido de vuelta
          </h2>
          <p className="mt-4 text-lg text-white/70 leading-relaxed max-w-md">
            Accede a tu cuenta para gestionar tu perfil de conferencista,
            conectar con empresas y hacer crecer tu carrera como speaker.
          </p>

          <div className="mt-10 space-y-4">
            {[
              'Gestiona tu perfil y disponibilidad',
              'Recibe solicitudes de eventos',
              'Accede a estadisticas de tu perfil',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex size-2 rounded-full bg-accent" />
                <span className="text-sm text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
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

        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">
            Iniciar sesion
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>

          {serverError && (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Contrasena
                </label>
                <Link href="#" className="text-xs font-medium text-accent hover:text-accent/80">
                  Olvidaste tu contrasena?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-accent text-white hover:bg-accent/90 cursor-pointer"
            >
              {isSubmitting ? 'Ingresando...' : 'Iniciar sesion'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            No tienes cuenta?{' '}
            <Link href="/registro" className="font-medium text-accent hover:text-accent/80">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
