"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Send,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSpeakerBlogPosts, deleteBlogPost, submitBlogPostForReview } from "@/lib/queries";
import type { BlogPost } from "@/types";

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  draft: { label: "Borrador", icon: FileText, color: "text-gray-600 bg-gray-100" },
  pending_review: { label: "En revision", icon: Clock, color: "text-amber-600 bg-amber-100" },
  published: { label: "Publicado", icon: CheckCircle, color: "text-green-600 bg-green-100" },
  rejected: { label: "Rechazado", icon: XCircle, color: "text-red-600 bg-red-100" },
  scheduled: { label: "Programado", icon: Clock, color: "text-blue-600 bg-blue-100" },
};

export default function SpeakerBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await getSpeakerBlogPosts();
      setPosts(res.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(uuid: string) {
    if (!confirm("Estas seguro de eliminar este articulo?")) return;
    setActionLoading(uuid);
    try {
      await deleteBlogPost(uuid);
      setPosts(posts.filter((p) => p.uuid !== uuid));
      setMessage({ type: "success", text: "Articulo eliminado." });
    } catch {
      setMessage({ type: "error", text: "Error al eliminar el articulo." });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSubmitForReview(uuid: string) {
    setActionLoading(uuid);
    try {
      await submitBlogPostForReview(uuid);
      await loadPosts();
      setMessage({ type: "success", text: "Articulo enviado a revision." });
    } catch {
      setMessage({ type: "error", text: "Error al enviar. Verifica que tenga titulo y contenido." });
    } finally {
      setActionLoading(null);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Mis Articulos</h1>
          <p className="mt-1 text-muted-foreground">
            Crea y gestiona tus articulos de blog.
          </p>
        </div>
        <Link href="/dashboard/blog/nuevo">
          <Button className="bg-accent text-white hover:bg-accent/90 cursor-pointer">
            <Plus className="size-4" />
            Nuevo articulo
          </Button>
        </Link>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="ml-auto text-xs underline cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 py-16">
          <FileText className="size-12 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-primary">
              No tienes articulos aun
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Comparte tu conocimiento escribiendo tu primer articulo.
            </p>
          </div>
          <Link href="/dashboard/blog/nuevo">
            <Button className="bg-accent text-white hover:bg-accent/90 cursor-pointer">
              <Plus className="size-4" />
              Escribir mi primer articulo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const statusCfg = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft;
            const StatusIcon = statusCfg.icon;
            const isEditable = post.status === "draft" || post.status === "rejected";

            return (
              <div
                key={post.uuid}
                className="flex items-center gap-4 rounded-xl border border-border bg-white p-4 shadow-sm"
              >
                {/* Thumbnail */}
                <div className="hidden sm:block size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {post.featured_image_url ? (
                    <img
                      src={post.featured_image_url}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <FileText className="size-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary truncate">{post.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${statusCfg.color}`}>
                      <StatusIcon className="size-3" />
                      {statusCfg.label}
                    </span>
                    {post.published_at && (
                      <span>
                        {new Date(post.published_at).toLocaleDateString("es-LA")}
                      </span>
                    )}
                    {post.views_count > 0 && (
                      <span className="flex items-center gap-1">
                        <Eye className="size-3" />
                        {post.views_count}
                      </span>
                    )}
                  </div>
                  {post.status === "rejected" && post.rejection_reason && (
                    <p className="mt-1 text-xs text-destructive line-clamp-1">
                      Rechazado: {post.rejection_reason}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {isEditable && (
                    <Link href={`/dashboard/blog/${post.uuid}/editar`}>
                      <Button variant="ghost" size="sm" className="cursor-pointer">
                        <Edit className="size-4" />
                      </Button>
                    </Link>
                  )}
                  {post.status === "draft" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer text-accent"
                      onClick={() => handleSubmitForReview(post.uuid)}
                      disabled={actionLoading === post.uuid}
                    >
                      {actionLoading === post.uuid ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                    </Button>
                  )}
                  {post.status === "published" && (
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="cursor-pointer">
                        <Eye className="size-4" />
                      </Button>
                    </Link>
                  )}
                  {isEditable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer text-destructive"
                      onClick={() => handleDelete(post.uuid)}
                      disabled={actionLoading === post.uuid}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
