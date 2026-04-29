import Link from "next/link";
import {
  Lightbulb,
  TrendingUp,
  Brain,
  Megaphone,
  Heart,
  Palette,
  Scale,
  Leaf,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  liderazgo: Lightbulb,
  innovacion: TrendingUp,
  tecnologia: Brain,
  ventas: Megaphone,
  bienestar: Heart,
  creatividad: Palette,
  legal: Scale,
  sostenibilidad: Leaf,
};

interface CategoryCardProps {
  name: string;
  slug: string;
  icon?: string;
  topicsCount?: number;
}

export default function CategoryCard({
  name,
  slug,
  icon,
  topicsCount,
}: CategoryCardProps) {
  const Icon = (icon && ICON_MAP[icon]) || ICON_MAP[slug] || Users;

  return (
    <Link
      href={`/directorio?category=${slug}`}
      className="group flex flex-col items-center gap-3 rounded-xl bg-white p-5 ring-1 ring-border transition-all hover:ring-accent hover:shadow-md"
    >
      <div className="flex size-12 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/20">
        <Icon className="size-6 text-accent" />
      </div>
      <span className="text-sm font-medium text-primary">{name}</span>
      {typeof topicsCount === "number" && (
        <span className="text-xs text-muted-foreground">
          {topicsCount} {topicsCount === 1 ? "tema" : "temas"}
        </span>
      )}
    </Link>
  );
}
