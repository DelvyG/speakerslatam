"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/api";

interface LegalPage {
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

interface LegalModalProps {
  slug: string;
  children: React.ReactNode;
}

export default function LegalModal({ slug, children }: LegalModalProps) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(false);
    api
      .get<{ data: LegalPage }>(`/legal/${slug}`)
      .then((res) => setPage(res.data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [open, slug]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="text-sm text-white/60 transition-colors hover:text-white cursor-pointer"
      >
        {children}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity duration-200" />
        <Dialog.Popup className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <Dialog.Title className="text-lg font-bold text-primary">
                {loading ? "Cargando..." : page?.title || ""}
              </Dialog.Title>
              <Dialog.Close className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer">
                <X className="size-4" />
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              )}
              {error && (
                <div className="py-20 text-center text-muted-foreground">
                  No se pudo cargar el contenido. Intenta de nuevo.
                </div>
              )}
              {!loading && !error && page && (
                <div
                  className="prose prose-sm max-w-none prose-headings:text-primary prose-headings:font-bold prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-ul:space-y-1"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-3 text-right">
              <Dialog.Close className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary/90 cursor-pointer">
                Cerrar
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
