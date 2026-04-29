import Link from "next/link";
import { MapPin, BadgeCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Speaker } from "@/types";

interface SpeakerCardProps {
  speaker: Speaker;
}

export default function SpeakerCard({ speaker }: SpeakerCardProps) {
  const initials = `${speaker.first_name.charAt(0)}${speaker.last_name.charAt(0)}`.toUpperCase();

  return (
    <Link
      href={`/directorio/${speaker.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-border transition-all hover:ring-accent hover:shadow-lg"
    >
      {/* Photo / placeholder */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {speaker.photo_url ? (
          <img
            src={speaker.photo_url}
            alt={speaker.full_name}
            className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-primary/10">
            <span className="text-2xl font-bold text-primary/40">
              {initials}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {speaker.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-white">
              <Star className="size-3" />
              Destacado
            </span>
          )}
          {speaker.is_verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-primary backdrop-blur-sm">
              <BadgeCheck className="size-3" />
              Verificado
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold text-primary line-clamp-1">
          {speaker.full_name}
        </h3>

        {speaker.bio_short && (
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {speaker.bio_short}
          </p>
        )}

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">
            {speaker.city}, {speaker.country}
          </span>
        </div>

        {/* Categories */}
        {speaker.categories.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-2">
            {speaker.categories.slice(0, 2).map((cat) => (
              <Badge
                key={cat.id}
                variant="secondary"
                className="text-[10px]"
              >
                {cat.name}
              </Badge>
            ))}
            {speaker.categories.length > 2 && (
              <Badge variant="secondary" className="text-[10px]">
                +{speaker.categories.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
