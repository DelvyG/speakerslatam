import Link from "next/link";
import { Calendar, Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types";

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("es-LA", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-border transition-all hover:ring-accent hover:shadow-lg"
    >
      {/* Featured image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {post.featured_image_url ? (
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-primary/5">
            <span className="text-3xl font-bold text-primary/20">Blog</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.categories.slice(0, 2).map((cat) => (
              <Badge key={cat.id} variant="secondary" className="text-[10px]">
                {cat.name}
              </Badge>
            ))}
          </div>
        )}

        <h3 className="text-base font-bold text-primary line-clamp-2 group-hover:text-accent transition-colors">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto flex items-center gap-4 pt-3 text-xs text-muted-foreground">
          {formattedDate && (
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {formattedDate}
            </span>
          )}
          {post.reading_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {post.reading_time_minutes} min
            </span>
          )}
          {post.views_count > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="size-3" />
              {post.views_count}
            </span>
          )}
        </div>

        {/* Author */}
        {post.speaker ? (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            {post.speaker.photo_url ? (
              <img
                src={post.speaker.photo_url}
                alt={post.speaker.name}
                className="size-6 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {post.speaker.name.charAt(0)}
              </div>
            )}
            <span className="text-xs font-medium text-muted-foreground">
              {post.speaker.name}
            </span>
          </div>
        ) : post.author_name ? (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <div className="flex size-6 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">
              {post.author_name.charAt(0)}
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {post.author_name}
            </span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
