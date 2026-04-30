"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getSpeakerProfile,
  updateSpeakerProfile,
  getCategories,
  getTopics,
  getLanguages,
} from "@/lib/queries";
import api from "@/lib/api";
import type { Speaker, Category, Topic, Language } from "@/types";

const profileSchema = z.object({
  first_name: z.string().min(2, "El nombre es obligatorio"),
  last_name: z.string().min(2, "El apellido es obligatorio"),
  bio_short: z.string().min(10, "La biografia corta debe tener al menos 10 caracteres").max(300),
  bio_long: z.string().optional(),
  city: z.string().min(2, "La ciudad es obligatoria"),
  country: z.string().min(2, "El pais es obligatorio"),
  phone: z.string().optional(),
  linkedin_url: z.string().optional(),
  website_url: z.string().optional(),
  video_url: z.string().optional(),
  modality: z.enum(["presencial", "virtual", "both"]),
  fee_range: z.string().optional(),
  experience_years: z.coerce.number().min(0).max(50).optional(),
  category_ids: z.array(z.number()).min(1, "Selecciona al menos una categoria"),
  topic_ids: z.array(z.number()).optional(),
  language_ids: z.array(z.number()).min(1, "Selecciona al menos un idioma"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const COUNTRIES = [
  "Venezuela", "Mexico", "Colombia", "Argentina", "Chile",
  "Peru", "Ecuador", "Bolivia", "Uruguay", "Paraguay",
  "Costa Rica", "Panama", "Guatemala", "Honduras", "El Salvador",
  "Nicaragua", "Republica Dominicana", "Cuba", "Puerto Rico", "Brasil",
];

const FEE_RANGES = [
  "Menos de $500",
  "$500 - $1,500",
  "$1,500 - $3,000",
  "$3,000 - $5,000",
  "$5,000 - $10,000",
  "Mas de $10,000",
];

const selectClassName =
  "h-10 w-full rounded-lg border border-input bg-white px-2.5 py-1 text-base font-sans outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_8px_center] bg-no-repeat pr-8";

export default function EditProfilePage() {
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
  });

  const selectedCategoryIds = watch("category_ids") || [];
  const selectedTopicIds = watch("topic_ids") || [];
  const selectedLanguageIds = watch("language_ids") || [];

  useEffect(() => {
    Promise.all([
      getSpeakerProfile(),
      getCategories(),
      getTopics(),
      getLanguages(),
    ])
      .then(([sp, cats, tops, langs]) => {
        setSpeaker(sp);
        setCategories(cats);
        setTopics(tops);
        setLanguages(langs);
        setPhotoUrl(sp.photo_url || "");

        // Fill form
        setValue("first_name", sp.first_name || "");
        setValue("last_name", sp.last_name || "");
        setValue("bio_short", sp.bio_short || "");
        setValue("bio_long", sp.bio_long || "");
        setValue("city", sp.city || "");
        setValue("country", sp.country || "Venezuela");
        setValue("phone", sp.phone || "");
        setValue("linkedin_url", sp.linkedin_url || "");
        setValue("website_url", sp.website_url || "");
        setValue("video_url", sp.video_url || "");
        setValue("modality", sp.modality || "presencial");
        setValue("fee_range", sp.fee_range || "");
        setValue("experience_years", sp.experience_years || 0);
        setValue("category_ids", sp.categories?.map((c) => c.id) || []);
        setValue("topic_ids", sp.topics?.map((t) => t.id) || []);
        setValue("language_ids", sp.languages?.map((l) => l.id) || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [setValue]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      setStatus("idle");
      await updateSpeakerProfile(data as Partial<Speaker>);
      setStatus("success");
      setServerMessage("Perfil actualizado exitosamente.");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setServerMessage("Error al actualizar el perfil. Revisa los campos.");
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const { data } = await api.post("/speaker/profile/photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPhotoUrl(data.photo_url);
    } catch {
      // silently fail
    } finally {
      setPhotoUploading(false);
    }
  }

  function toggleArrayValue(
    field: "category_ids" | "topic_ids" | "language_ids",
    id: number,
    current: number[]
  ) {
    const next = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    setValue(field, next, { shouldValidate: true });
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Mi Perfil</h1>
        <p className="mt-1 text-muted-foreground">
          Completa tu informacion para aparecer en el directorio.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Photo */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-primary">Foto de perfil</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="size-24 overflow-hidden rounded-full bg-muted">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt="Foto de perfil"
                    width={96}
                    height={96}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <Camera className="size-8" />
                  </div>
                )}
              </div>
              {photoUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                  <Loader2 className="size-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="size-4" />
                {photoUrl ? "Cambiar foto" : "Subir foto"}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                JPEG, PNG o WebP. Maximo 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-primary">Datos basicos</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Nombre *</label>
              <Input {...register("first_name")} className="h-10" />
              {errors.first_name && (
                <p className="text-xs text-destructive">{errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Apellido *</label>
              <Input {...register("last_name")} className="h-10" />
              {errors.last_name && (
                <p className="text-xs text-destructive">{errors.last_name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Ciudad *</label>
              <Input {...register("city")} placeholder="Ej. Caracas" className="h-10" />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Pais *</label>
              <select {...register("country")} className={selectClassName}>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Telefono</label>
              <Input {...register("phone")} type="tel" placeholder="+58 412 1234567" className="h-10" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Anos de experiencia</label>
              <Input {...register("experience_years")} type="number" min={0} max={50} className="h-10" />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-primary">Biografia</h2>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Biografia corta * (max 300 caracteres)</label>
              <Textarea
                {...register("bio_short")}
                rows={3}
                placeholder="Describe brevemente tu experiencia y especialidad como conferencista..."
              />
              {errors.bio_short && (
                <p className="text-xs text-destructive">{errors.bio_short.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Biografia extendida</label>
              <Textarea
                {...register("bio_long")}
                rows={6}
                placeholder="Cuenta tu historia completa, logros, metodologia, clientes destacados..."
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-primary">Categorias *</h2>
          <p className="mb-4 text-sm text-muted-foreground">Selecciona las areas en las que te especializas.</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const selected = selectedCategoryIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleArrayValue("category_ids", cat.id, selectedCategoryIds)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    selected
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {selected && <span className="mr-1">✓</span>}
                  {cat.name}
                </button>
              );
            })}
          </div>
          {errors.category_ids && (
            <p className="mt-2 text-xs text-destructive">{errors.category_ids.message}</p>
          )}
        </div>

        {/* Topics */}
        {topics.length > 0 && (
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-bold text-primary">Temas</h2>
            <p className="mb-4 text-sm text-muted-foreground">Selecciona los temas especificos que dominas.</p>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => {
                const selected = selectedTopicIds.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => toggleArrayValue("topic_ids", topic.id, selectedTopicIds)}
                    className={`rounded-full px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                      selected
                        ? "bg-accent text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {topic.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Languages */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-primary">Idiomas *</h2>
          <p className="mb-4 text-sm text-muted-foreground">En que idiomas puedes dar conferencias?</p>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => {
              const selected = selectedLanguageIds.includes(lang.id);
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => toggleArrayValue("language_ids", lang.id, selectedLanguageIds)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    selected
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {selected && <span className="mr-1">✓</span>}
                  {lang.name}
                </button>
              );
            })}
          </div>
          {errors.language_ids && (
            <p className="mt-2 text-xs text-destructive">{errors.language_ids.message}</p>
          )}
        </div>

        {/* Professional */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-primary">Informacion profesional</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Modalidad *</label>
              <select {...register("modality")} className={selectClassName}>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="both">Ambas (Presencial y Virtual)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Rango de honorarios</label>
              <select {...register("fee_range")} className={selectClassName}>
                <option value="">Seleccionar...</option>
                {FEE_RANGES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-primary">Redes y enlaces</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">LinkedIn</label>
              <Input
                {...register("linkedin_url")}
                type="url"
                placeholder="https://linkedin.com/in/tu-perfil"
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Sitio web</label>
              <Input
                {...register("website_url")}
                type="url"
                placeholder="https://tu-sitio.com"
                className="h-10"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold">Video de presentacion (YouTube, Vimeo)</label>
              <Input
                {...register("video_url")}
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                className="h-10"
              />
            </div>
          </div>
        </div>

        {/* Status messages */}
        {status === "success" && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle className="size-4 shrink-0" />
            {serverMessage}
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {serverMessage}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="bg-accent text-white hover:bg-accent/90 cursor-pointer h-12 px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
