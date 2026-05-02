import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, Eye, ArrowLeft, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function getPost(slug: string) {
  const res = await fetch(`${API_URL}/blog/posts/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Articulo no encontrado" };
  }

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || "";
  const ogTitle = post.og_title || post.title;
  const ogDescription = post.og_description || post.excerpt || "";
  const ogImage = post.og_image_url || post.featured_image_hero_url;

  return {
    title: `${title} | Blog - SpeakerLATAM`,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author_name],
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
      locale: "es_LA",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("es-LA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="size-4" />
        Volver al blog
      </Link>

      {/* Categories */}
      {post.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((cat: { id: number; name: string; slug: string }) => (
            <Link key={cat.id} href={`/blog?categoria=${cat.slug}`}>
              <Badge variant="secondary" className="text-xs hover:bg-accent hover:text-white transition-colors">
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-primary sm:text-4xl leading-tight">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {/* Author */}
        <div className="flex items-center gap-2">
          {post.speaker?.photo_url ? (
            <img
              src={post.speaker.photo_url}
              alt={post.speaker.name}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
              <User className="size-4 text-primary" />
            </div>
          )}
          <span className="font-medium">
            {post.speaker ? (
              <Link
                href={`/directorio/${post.speaker.slug}`}
                className="hover:text-accent transition-colors"
              >
                {post.speaker.name}
              </Link>
            ) : (
              post.author_name
            )}
          </span>
        </div>

        {formattedDate && (
          <span className="flex items-center gap-1">
            <Calendar className="size-4" />
            {formattedDate}
          </span>
        )}
        {post.reading_time_minutes && (
          <span className="flex items-center gap-1">
            <Clock className="size-4" />
            {post.reading_time_minutes} min de lectura
          </span>
        )}
        {post.views_count > 0 && (
          <span className="flex items-center gap-1">
            <Eye className="size-4" />
            {post.views_count} vistas
          </span>
        )}
      </div>

      {/* Featured image */}
      {post.featured_image_hero_url && (
        <div className="mt-8 overflow-hidden rounded-xl">
          <img
            src={post.featured_image_hero_url}
            alt={post.title}
            className="w-full object-cover"
            style={{ maxHeight: 500 }}
          />
        </div>
      )}

      {/* Body */}
      {post.body && (
        <div
          className="prose prose-lg prose-primary mt-10 max-w-none
            prose-headings:text-primary prose-headings:font-bold
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-accent prose-blockquote:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      )}

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt || "",
            image: post.featured_image_hero_url || undefined,
            datePublished: post.published_at,
            dateModified: post.updated_at || post.published_at,
            author: {
              "@type": "Person",
              name: post.speaker?.name || post.author_name,
            },
            publisher: {
              "@type": "Organization",
              name: "SpeakerLATAM",
            },
          }),
        }}
      />
    </article>
  );
}
