"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import BlogPostCard from "@/components/blog/BlogPostCard";
import { getBlogPosts, getBlogCategories } from "@/lib/queries";
import type { BlogPost, BlogCategory } from "@/types";

export default function BlogPage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>(
    searchParams.get("categoria") || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getBlogCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getBlogPosts({
      page,
      category: activeCategory || undefined,
      search: searchQuery || undefined,
    })
      .then((res) => {
        setPosts(res.data);
        setTotalPages(res.meta.last_page);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, activeCategory, searchQuery]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Noticias, articulos y recursos del mundo de las conferencias en LATAM
        </p>
      </div>

      {/* Search + Categories */}
      <div className="mt-8 space-y-4">
        <form onSubmit={handleSearch} className="mx-auto max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar articulos..."
              className="h-10 pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </form>

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => { setActiveCategory(""); setPage(1); }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                !activeCategory
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.slug); setPage(1); }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  activeCategory === cat.slug
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Posts grid */}
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground">
            No se encontraron articulos.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex size-10 items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    p === page
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
