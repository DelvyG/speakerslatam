"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Save,
  Send,
  Camera,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  getSpeakerBlogPost,
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

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [postStatus, setPostStatus] = useState("");
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
    Promise.all([
      getSpeakerBlogPost(uuid),
      getBlogCategories(),
    ])
      .then(([post, cats]) => {
        setCategories(cats);
        setValue("title", post.title);
        setValue("excerpt", post.excerpt || "");
        setValue("body", post.body || "");
        setValue("category_ids", post.categories.map((c) => c.id));
        setFeaturedImageUrl(post.featured_image_url || "");
        setRejectionReason(post.rejection_reason || null);
        setPostStatus(post.status);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [uuid, setValue]);

  function toggleCategory(id: number) {
    const current = selectedCategoryIds;
    const next = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    setValue("category_ids", next);
  }

  async function onSave(data: PostFormValues) {
    setSaving(true);
    try {
      await updateBlogPost(uuid, data);
      router.push("/dashboard/blog");
    } catch {
      alert("Error al guardar.");
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitForReview(data: PostFormValues) {
    setSubmitting(true);
    try {
      await updateBlogPost(uuid, data);
      await submitBlogPostForReview(uuid);
      router.push("/dashboard/blog");
    } catch {
      alert("Error al enviar. Verifica titulo y contenido.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFeaturedImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const res = await uploadBlogFeaturedImage(uuid, file);
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

  const isEditable = postStatus === "draft" || postStatus === "rejected";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/blog">
          <Button variant="ghost" size="sm" className="cursor-pointer">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary">Editar articulo</h1>
        </div>
      </div>

      {rejectionReason && postStatus === "rejected" && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <div>
            <h3 className="text-sm font-bold text-destructive">Articulo rechazado</h3>
            <p className="mt-1 text-sm text-destructive/80">{rejectionReason}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Corrige los problemas indicados y vuelve a enviar a revision.
            </p>
          </div>
        </div>
      )}

      {!isEditable && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
          Este articulo esta en estado &quot;{postStatus}&quot; y no puede ser editado.
        </div>
      )}

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Titulo *</label>
              <Input
                {...register("title")}
                placeholder="Titulo de tu articulo..."
                className="h-12 text-lg font-semibold"
                disabled={!isEditable}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Extracto</label>
              <Textarea
                {...register("excerpt")}
                placeholder="Breve descripcion..."
                rows={2}
                disabled={!isEditable}
              />
            </div>
          </div>
        </div>

        {/* Featured image */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold">Imagen destacada</h2>
          {featuredImageUrl && (
            <div className="relative overflow-hidden rounded-lg" style={{ maxHeight: 200 }}>
              <img src={featuredImageUrl} alt="Destacada" className="w-full object-cover" />
            </div>
          )}
          {isEditable && (
            <>
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
                {imageUploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
                {featuredImageUrl ? "Cambiar imagen" : "Subir imagen"}
              </Button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <label className="text-sm font-semibold">Contenido *</label>
          <Textarea
            {...register("body")}
            placeholder="Contenido del articulo..."
            rows={15}
            className="mt-2 font-mono text-sm"
            disabled={!isEditable}
          />
          {errors.body && (
            <p className="mt-1 text-xs text-destructive">{errors.body.message}</p>
          )}
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <label className="text-sm font-semibold">Categorias</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((cat) => {
                const selected = selectedCategoryIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => isEditable && toggleCategory(cat.id)}
                    disabled={!isEditable}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                      selected
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    } ${!isEditable ? "opacity-60 cursor-not-allowed" : ""}`}
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
        {isEditable && (
          <div className="flex flex-wrap gap-3 justify-end">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleSubmit(onSave)}
              disabled={saving || submitting}
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Guardar borrador
            </Button>
            <Button
              className="bg-accent text-white hover:bg-accent/90 cursor-pointer"
              onClick={handleSubmit(onSubmitForReview)}
              disabled={saving || submitting}
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Enviar a revision
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
