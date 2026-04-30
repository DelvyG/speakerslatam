import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Globe,
  Link2,
  BadgeCheck,
  Star,
  Languages,
  Monitor,
  Users,
  Calendar,
  DollarSign,
  ExternalLink,
  Play,
  Mail,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getSpeaker, getSpeakers } from '@/lib/queries';
import type { Speaker } from '@/types';
import SpeakerCard from '@/components/ui/SpeakerCard';

// ── Types ────────────────────────────────────────────────────────────
interface PageProps {
  params: Promise<{ slug: string }>;
}

// ── Page ─────────────────────────────────────────────────────────────
export default async function SpeakerProfilePage({ params }: PageProps) {
  const { slug } = await params;

  let speaker: Speaker;
  try {
    speaker = await getSpeaker(slug);
  } catch {
    notFound();
  }

  // Fetch related speakers from the same category for the "related" section
  const primaryCategory = speaker.categories[0];
  let relatedSpeakers: Speaker[] = [];
  if (primaryCategory) {
    try {
      const res = await getSpeakers({
        category: primaryCategory.slug,
        per_page: 4,
      });
      relatedSpeakers = res.data.filter((s) => s.id !== speaker.id).slice(0, 3);
    } catch {
      // Silently ignore - related speakers are non-critical
    }
  }

  const modalityLabel: Record<string, string> = {
    presencial: 'Presencial',
    virtual: 'Virtual',
    both: 'Presencial y Virtual',
  };

  return (
    <div className="pb-16">
      {/* ── Cover Banner ────────────────────────────────────────────── */}
      <section className="relative h-[250px] w-full overflow-hidden md:h-[340px]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[oklch(0.25_0.08_255)]">
          {speaker.cover_url ? (
            <img
              src={speaker.cover_url}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-80"
              style={{ objectPosition: `center ${speaker.cover_position ?? 50}%` }}
            />
          ) : speaker.photo_url ? (
            <img
              src={speaker.photo_url}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-20 blur-sm"
            />
          ) : null}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      </section>

      {/* ── Profile Info ─────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end -mt-16 md:-mt-20">
          {/* Profile photo */}
          <div className="relative z-10 shrink-0">
            <div className="size-32 overflow-hidden rounded-2xl border-4 border-white bg-muted shadow-xl md:size-40">
              {speaker.photo_url ? (
                <img
                  src={speaker.photo_url}
                  alt={speaker.full_name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-primary/10 text-4xl font-bold text-primary">
                  {speaker.first_name?.[0]}{speaker.last_name?.[0]}
                </div>
              )}
            </div>
          </div>

          {/* Name & badges */}
          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {speaker.is_featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
                  <Star className="size-3" />
                  Destacado
                </span>
              )}
              {speaker.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <BadgeCheck className="size-3" />
                  Verificado
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
              {speaker.full_name}
            </h1>
            {speaker.bio_short && (
              <p className="mt-1 max-w-2xl text-base text-muted-foreground md:text-lg">
                {speaker.bio_short}
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 text-accent" />
                {speaker.city}, {speaker.country}
              </div>
              {speaker.languages && speaker.languages.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Languages className="size-4 text-accent" />
                  {speaker.languages.map((l) => l.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Floating CTA (mobile) ─────────────────────────────────────── */}
      <div className="fixed bottom-6 left-6 right-6 z-40 md:hidden">
        <Button className="w-full gap-2 bg-accent py-6 text-base text-white hover:bg-accent/90 shadow-lg">
          <Mail className="size-5" />
          Solicitar para mi evento
        </Button>
      </div>

      {/* ── Content Grid ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* ── Left Column: Main Content ─────────────────────────────── */}
          <div className="lg:col-span-8">
            {/* Bio */}
            {speaker.bio_long && (
              <div className="mb-12">
                <h3 className="mb-4 text-2xl font-bold text-primary">
                  Sobre {speaker.first_name}
                </h3>
                <div className="space-y-4 text-base leading-relaxed text-muted-foreground whitespace-pre-line">
                  {speaker.bio_long}
                </div>
              </div>
            )}

            {/* Topics / Areas of expertise */}
            {speaker.topics.length > 0 && (
              <div className="mb-12">
                <h4 className="mb-4 text-xl font-bold text-primary">
                  Areas de Experiencia
                </h4>
                <div className="flex flex-wrap gap-3">
                  {speaker.topics.map((topic) => (
                    <span
                      key={topic.id}
                      className="rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-medium text-primary"
                    >
                      {topic.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {speaker.categories.length > 0 && (
              <div className="mb-12">
                <h4 className="mb-4 text-xl font-bold text-primary">
                  Categorias
                </h4>
                <div className="flex flex-wrap gap-2">
                  {speaker.categories.map((cat) => (
                    <Link key={cat.id} href={`/directorio?category=${cat.slug}`}>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer px-3 py-1 text-xs"
                      >
                        {cat.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Video embed */}
            {speaker.video_url && (
              <div className="mb-12">
                <h4 className="mb-4 text-xl font-bold text-primary">
                  Video Destacado
                </h4>
                <VideoEmbed url={speaker.video_url} name={speaker.full_name} />
              </div>
            )}

            {/* Gallery */}
            {speaker.gallery_urls && speaker.gallery_urls.length > 0 && (
              <div className="mb-12">
                <h4 className="mb-4 text-xl font-bold text-primary">
                  Galeria
                </h4>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {speaker.gallery_urls.map((url, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl"
                    >
                      <img
                        src={url}
                        alt={`${speaker.full_name} - foto ${i + 1}`}
                        className="absolute inset-0 size-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column: Sidebar ─────────────────────────────────── */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                {/* CTA */}
                <Button className="mb-8 w-full gap-2 bg-accent py-6 text-base text-white hover:bg-accent/90">
                  <Mail className="size-5" />
                  Solicitar para mi evento
                </Button>

                {/* Info rows */}
                <div className="space-y-5">
                  <SidebarHeading>Informacion</SidebarHeading>

                  <InfoRow icon={MapPin} label="Ubicacion">
                    {speaker.city}, {speaker.country}
                  </InfoRow>

                  {speaker.languages && speaker.languages.length > 0 && (
                    <InfoRow icon={Languages} label="Idiomas">
                      {speaker.languages.map((l) => l.name).join(', ')}
                    </InfoRow>
                  )}

                  <InfoRow icon={Monitor} label="Modalidad">
                    {modalityLabel[speaker.modality] ?? speaker.modality}
                  </InfoRow>

                  {speaker.fee_range && (
                    <InfoRow icon={DollarSign} label="Rango de tarifa">
                      {speaker.fee_range}
                    </InfoRow>
                  )}

                  {speaker.experience_years != null && (
                    <InfoRow icon={Calendar} label="Experiencia">
                      {speaker.experience_years}{' '}
                      {speaker.experience_years === 1 ? 'ano' : 'anos'}
                    </InfoRow>
                  )}
                </div>

                {/* External links */}
                {(speaker.linkedin_url || speaker.website_url) && (
                  <div className="mt-8 border-t border-border pt-6">
                    <SidebarHeading>Enlaces</SidebarHeading>
                    <div className="mt-4 space-y-3">
                      {speaker.linkedin_url && (
                        <a
                          href={speaker.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
                        >
                          <Link2 className="size-4" />
                          LinkedIn
                          <ExternalLink className="ml-auto size-3" />
                        </a>
                      )}
                      {speaker.website_url && (
                        <a
                          href={speaker.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
                        >
                          <Globe className="size-4" />
                          Sitio web
                          <ExternalLink className="ml-auto size-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Concierge CTA */}
                <div className="mt-8 rounded-lg bg-muted p-4 text-center">
                  <Users className="mx-auto mb-2 size-6 text-primary/60" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    No estas seguro de cual speaker elegir? Nuestro equipo de
                    concierge te ayuda a encontrar la opcion ideal.
                  </p>
                  <Link
                    href="/empresas"
                    className="mt-3 inline-block text-xs font-semibold text-accent hover:underline"
                  >
                    Solicitar asesoria gratuita
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Speakers ──────────────────────────────────────────── */}
      {relatedSpeakers.length > 0 && (
        <section className="border-t bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary md:text-3xl">
                  Conferencistas Relacionados
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Otros expertos en{' '}
                  {primaryCategory?.name ?? 'esta categoria'} que podrian
                  interesarte.
                </p>
              </div>
              <Link
                href={`/directorio?category=${primaryCategory?.slug ?? ''}`}
                className="hidden items-center gap-1 text-sm font-semibold text-accent hover:underline md:flex"
              >
                Ver todos
                <ExternalLink className="size-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedSpeakers.map((s) => (
                <SpeakerCard key={s.id} speaker={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// ── Metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const speaker = await getSpeaker(slug);
    return {
      title: `${speaker.full_name} - Conferencista | SpeakerLATAM`,
      description:
        speaker.bio_short ||
        `Perfil de ${speaker.full_name}, conferencista profesional en ${speaker.city}, ${speaker.country}.`,
      openGraph: {
        title: `${speaker.full_name} - Conferencista`,
        description: speaker.bio_short,
        images: speaker.photo_url ? [speaker.photo_url] : undefined,
      },
    };
  } catch {
    return {
      title: 'Speaker no encontrado | SpeakerLATAM',
    };
  }
}

/* ── Helper Components ────────────────────────────────────────────── */

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </h5>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-accent" />
      <div>
        <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-sm text-foreground">{children}</span>
      </div>
    </div>
  );
}

function VideoEmbed({ url, name }: { url: string; name: string }) {
  // Convert common video URLs to embeddable format
  const getEmbedUrl = (videoUrl: string): string | null => {
    // YouTube
    const ytMatch = videoUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    // Vimeo
    const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    return null;
  };

  const embedUrl = getEmbedUrl(url);

  if (embedUrl) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl shadow-md">
        <iframe
          src={embedUrl}
          title={`Video de ${name}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      </div>
    );
  }

  // Fallback: link to video
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-primary/5 shadow-md transition-colors hover:bg-primary/10"
    >
      <div className="flex size-20 items-center justify-center rounded-full bg-accent text-white shadow-xl transition-transform group-hover:scale-110">
        <Play className="size-8" />
      </div>
      <span className="absolute bottom-6 left-6 text-sm font-semibold text-primary">
        Ver video
      </span>
    </a>
  );
}
