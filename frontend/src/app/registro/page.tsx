'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import axios from 'axios';
import {
  Eye,
  EyeOff,
  Users,
  TrendingUp,
  Zap,
  Check,
  Loader2,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { register as registerUser, getCategories, getLanguages, updateSpeakerProfile } from '@/lib/queries';
import { setToken } from '@/lib/auth';
import { useSiteSettings, getBackendUrl } from '@/lib/site-settings';
import api from '@/lib/api';
import type { Category, Language, Speaker } from '@/types';

// ── Step 1 schema ────────────────────────────────────────────────────

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

// ── Step 2 schema ────────────────────────────────────────────────────

const profileSchema = z.object({
  bio_short: z.string().min(10, 'La biografia debe tener al menos 10 caracteres').max(300),
  country: z.string().min(2, 'Selecciona un pais'),
  city: z.string().min(2, 'Selecciona una ciudad'),
  modality: z.enum(['presencial', 'virtual', 'both']),
  category_ids: z.array(z.number()).min(1, 'Selecciona al menos una categoria'),
  language_ids: z.array(z.number()).min(1, 'Selecciona al menos un idioma'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface GeoState { id: number; name: string; }
interface GeoCity { id: number; name: string; }

// ── Constants ────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Crear Cuenta' },
  { label: 'Completar Perfil' },
  { label: 'Membresia' },
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

const selectClassName =
  "h-10 w-full rounded-lg border border-input bg-white px-2.5 py-1 text-base font-sans outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_8px_center] bg-no-repeat pr-8";

// ── Main component ───────────────────────────────────────────────────

export default function RegistroPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [serverError, setServerError] = useState('');
  const settings = useSiteSettings();
  const logoLoginUrl = getBackendUrl(settings.logo_login_url);
  const logoUrl = getBackendUrl(settings.logo_url);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-5">
      {/* Left panel - benefits (desktop only) */}
      <div className="hidden lg:flex lg:col-span-2 flex-col justify-center bg-gradient-to-br from-primary via-primary to-[oklch(0.25_0.08_255)] px-10 xl:px-14 relative overflow-hidden">
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
                  <div className={`h-px w-6 shrink-0 sm:w-10 ${idx <= currentStep ? 'bg-accent' : 'bg-border'}`} />
                )}
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                      idx < currentStep
                        ? 'bg-accent text-white'
                        : idx === currentStep
                        ? 'bg-accent text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {idx < currentStep ? <Check className="size-3.5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      idx <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="mx-auto w-full max-w-md">
          {serverError && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
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

          {currentStep === 0 && (
            <Step1CreateAccount
              onSuccess={() => {
                setServerError('');
                setCurrentStep(1);
              }}
              onError={setServerError}
            />
          )}

          {currentStep === 1 && (
            <Step2CompleteProfile
              onSuccess={() => {
                setServerError('');
                setCurrentStep(2);
              }}
              onError={setServerError}
            />
          )}

          {currentStep === 2 && <Step3Membership />}
        </div>
      </div>
    </div>
  );
}

// ── Step 1: Create Account ───────────────────────────────────────────

function Step1CreateAccount({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    onError('');
    try {
      const { token } = await registerUser(values);
      setToken(token);
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const errs = err.response.data.errors;
        const messages = Object.values(errs).flat().join(' ');
        onError(messages);
      } else if (axios.isAxiosError(err) && err.response?.data?.message) {
        onError(err.response.data.message);
      } else {
        onError('Error al crear la cuenta. Intenta de nuevo.');
      }
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-primary sm:text-3xl">
        Crea tu cuenta
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Comienza registrando tus datos basicos. Luego completaras tu perfil de conferencista.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 bg-accent text-white hover:bg-accent/90 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            <>
              Crear cuenta
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ya tienes cuenta?{' '}
        <Link href="/login" className="font-medium text-accent hover:text-accent/80">
          Inicia sesion
        </Link>
      </p>
    </>
  );
}

// ── Step 2: Complete Profile ─────────────────────────────────────────

function Step2CompleteProfile({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [geoStates, setGeoStates] = useState<GeoState[]>([]);
  const [geoCities, setGeoCities] = useState<GeoCity[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      country: 'Venezuela',
      modality: 'presencial',
      category_ids: [],
      language_ids: [],
    },
  });

  const selectedCategoryIds = watch('category_ids') || [];
  const selectedLanguageIds = watch('language_ids') || [];

  useEffect(() => {
    Promise.all([
      getCategories(),
      getLanguages(),
      api.get<{ data: string[] }>('/geo/countries').then((r) => r.data.data),
    ])
      .then(async ([cats, langs, ctrs]) => {
        setCategories(cats);
        setLanguages(langs);
        setCountries(ctrs);
        // Load states for default country
        const stRes = await api.get<{ data: GeoState[] }>('/geo/states', { params: { country: 'Venezuela' } });
        setGeoStates(stRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function loadStates(country: string) {
    if (!country) { setGeoStates([]); setGeoCities([]); return; }
    const res = await api.get<{ data: GeoState[] }>('/geo/states', { params: { country } });
    setGeoStates(res.data.data);
    setGeoCities([]);
    setSelectedState('');
    setValue('city', '');
  }

  async function loadCities(stateId: string) {
    if (!stateId) { setGeoCities([]); return; }
    setSelectedState(stateId);
    const res = await api.get<{ data: GeoCity[] }>('/geo/cities', { params: { state_id: stateId } });
    setGeoCities(res.data.data);
    setValue('city', '');
  }

  function toggleArrayValue(
    field: 'category_ids' | 'language_ids',
    id: number,
    current: number[],
  ) {
    const next = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    setValue(field, next, { shouldValidate: true });
  }

  async function onSubmit(data: ProfileFormValues) {
    onError('');
    try {
      await updateSpeakerProfile(data as Partial<Speaker>);
      onSuccess();
    } catch {
      onError('Error al guardar el perfil. Intenta de nuevo.');
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-primary sm:text-3xl">
        Completa tu perfil
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cuantanos sobre ti para que las empresas puedan encontrarte.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Biografia corta * (max 300 caracteres)</label>
          <Textarea
            {...register('bio_short')}
            rows={3}
            placeholder="Describe brevemente tu experiencia y especialidad como conferencista..."
          />
          {errors.bio_short && (
            <p className="text-xs text-destructive">{errors.bio_short.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Pais *</label>
            <select
              {...register('country')}
              className={selectClassName}
              onChange={(e) => {
                register('country').onChange(e);
                loadStates(e.target.value);
              }}
            >
              <option value="">Seleccionar pais...</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.country && (
              <p className="text-xs text-destructive">{errors.country.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Estado / Provincia</label>
            <select
              className={selectClassName}
              value={selectedState}
              onChange={(e) => loadCities(e.target.value)}
            >
              <option value="">Seleccionar estado...</option>
              {geoStates.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-semibold">Ciudad *</label>
            <select
              className={selectClassName}
              value={watch('city') || ''}
              onChange={(e) => setValue('city', e.target.value, { shouldValidate: true })}
            >
              <option value="">Seleccionar ciudad...</option>
              {geoCities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            {errors.city && (
              <p className="text-xs text-destructive">{errors.city.message}</p>
            )}
          </div>
        </div>

        {/* Modality */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Modalidad *</label>
          <select {...register('modality')} className={selectClassName}>
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
            <option value="both">Ambas (Presencial y Virtual)</option>
          </select>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Categorias * (selecciona al menos una)</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const selected = selectedCategoryIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleArrayValue('category_ids', cat.id, selectedCategoryIds)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                    selected
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {selected && <span className="mr-1">&#10003;</span>}
                  {cat.name}
                </button>
              );
            })}
          </div>
          {errors.category_ids && (
            <p className="text-xs text-destructive">{errors.category_ids.message}</p>
          )}
        </div>

        {/* Languages */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">Idiomas * (selecciona al menos uno)</label>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => {
              const selected = selectedLanguageIds.includes(lang.id);
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => toggleArrayValue('language_ids', lang.id, selectedLanguageIds)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                    selected
                      ? 'bg-primary text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {selected && <span className="mr-1">&#10003;</span>}
                  {lang.name}
                </button>
              );
            })}
          </div>
          {errors.language_ids && (
            <p className="text-xs text-destructive">{errors.language_ids.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 bg-accent text-white hover:bg-accent/90 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Guardando perfil...
            </>
          ) : (
            <>
              Guardar y continuar
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
    </>
  );
}

// ── Step 3: Membership ───────────────────────────────────────────────

function Step3Membership() {
  const router = useRouter();

  return (
    <>
      <div className="text-center">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-green-100">
          <Check className="size-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">
          Perfil creado exitosamente
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Tu cuenta y perfil de conferencista estan listos. El ultimo paso es activar tu membresia
          para aparecer en el directorio.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <Button
          onClick={() => router.push('/dashboard/membresia')}
          className="w-full h-12 bg-accent text-white hover:bg-accent/90 cursor-pointer text-base"
        >
          Activar membresia
          <ChevronRight className="size-5" />
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="w-full h-10 cursor-pointer"
        >
          Ir al panel de control
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Puedes completar la membresia mas tarde desde tu panel de control.
      </p>
    </>
  );
}
