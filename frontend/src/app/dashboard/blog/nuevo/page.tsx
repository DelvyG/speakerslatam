"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Save,
  Send,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createBlogPost,
  updateBlogPost,
  submitBlogPostForReview,
  getBlogCategories,
  uploadBlogFeaturedImage,
} from "@/lib/queries";
import type { BlogCategory } from "@/types";

const postSchema = z.object({
  title: z.string().min(5, "El titulo debe tener al menos 5 caracteres"),
  excerpt: z.string().max(500).optional(),
  body: z.string().min(20, "El contenido debe tener al menos 20 caracteres"),
  category_ids: z.array(z.number()).optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function NewBlogPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savedUuid, setSavedUuid] = useState<string | null>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema) as any,
    defaultValues: { category_ids: [] },
  });

  const selectedCategoryIds = watch("category_ids") || [];

  useEffect(() => {
    getBlogCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function toggleCategory(id: number) {
    const current = selectedCategoryIds;
    const next = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    setValue("category_ids", next);
  }

  async function onSaveDraft(data: PostFormValues) {
    setSaving(true);
    try {
      if (savedUuid) {
        await updateBlogPost(savedUuid, data);
      } else {
        const post = await createBlogPost(data);
        setSavedUuid(post.uuid);
      }
      router.push("/dashboard/blog");
    } catch {
      alert("Error al guardar el borrador.");
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitForReview(data: PostFormValues) {
    setSubmitting(true);
    try {
      let uuid = savedUuid;
      if (!uuid) {
        const post = await createBlogPost(data);
        uuid = post.uuid;
        setSavedUuid(uuid);
      } else {
        await updateBlogPost(uuid, data);
      }
      await submitBlogPostForReview(uuid);
      router.push("/dashboard/blog");
    } catch {
      alert("Error al enviar. Verifica que tenga titulo y contenido.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFeaturedImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !savedUuid) return;
    setImageUploading(true);
    try {
      const res = await uploadBlogFeaturedImage(savedUuid, file);
      setFeaturedImageUrl(res.url);
    } catch {
      alert("Error al subir la imagen.");
    } finally {
      setImageUploading(false);
    }
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
      <div className="flex items-center gap-4">
        <Link href="/dashboard/blog">
          <Button variant="ghost" size="sm" className="cursor-pointer">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary">Nuevo articulo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Escribe tu articulo. Sera revisado por el equipo antes de publicarse.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Titulo *</label>
              <Input
                {...register("title")}
                placeholder="Titulo de tu articulo..."
                className="h-12 text-lg font-semibold"
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Extracto (resumen corto)</label>
              <Textarea
                {...register("excerpt")}
                placeholder="Breve descripcion del articulo para listados y SEO..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Featured image (only after first save) */}
        {savedUuid && (
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold">Imagen destacada</h2>
            {featuredImageUrl ? (
              <div className="relative overflow-hidden rounded-lg" style={{ maxHeight: 200 }}>
                <img src={featuredImageUrl} alt="Destacada" className="w-full object-cover" />
              </div>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFeaturedImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-3 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              disabled={imageUploading}
            >
              {imageUploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Camera className="size-4" />
              )}
              {featuredImageUrl ? "Cambiar imagen" : "Subir imagen destacada"}
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <label className="text-sm font-semibold">Contenido *</label>
          <p className="mb-3 text-xs text-muted-foreground">
            Puedes usar HTML basico para formato (negrita, listas, enlaces, etc.)
          </p>
          <Textarea
            {...register("body")}
            placeholder="Escribe el contenido de tu articulo..."
            rows={15}
            className="font-mono text-sm"
          />
          {errors.body && (
            <p className="mt-1 text-xs text-destructive">{errors.body.message}</p>
          )}
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <label className="text-sm font-semibold">Categorias</label>
            <p className="mb-3 text-xs text-muted-foreground">
              Selecciona las categorias que apliquen a tu articulo.
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const selected = selectedCategoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                      selected
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {selected && <span className="mr-1">&#10003;</span>}
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-end">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleSubmit(onSaveDraft)}
            disabled={saving || submitting}
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Guardar borrador
          </Button>
          <Button
            className="bg-accent text-white hover:bg-accent/90 cursor-pointer"
            onClick={handleSubmit(onSubmitForReview)}
            disabled={saving || submitting}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Enviar a revision
          </Button>
        </div>
      </div>
    </div>
  );
}
