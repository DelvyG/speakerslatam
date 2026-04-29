'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SpeakerCard from '@/components/ui/SpeakerCard';
import {
  useSpeakers,
  useFeaturedSpeakers,
  useCategories,
  useLanguages,
} from '@/lib/hooks';
import type { SpeakerFilters } from '@/lib/queries';

const COUNTRIES = [
  'Mexico',
  'Colombia',
  'Argentina',
  'Chile',
  'Peru',
  'Brasil',
  'Ecuador',
  'Uruguay',
  'Venezuela',
  'Costa Rica',
  'Panama',
  'Republica Dominicana',
];

const MODALITIES = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'both', label: 'Ambas' },
] as const;

export default function DirectorioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Read filter state from URL ──────────────────────────────────────
  const filters: SpeakerFilters = useMemo(() => {
    const p: SpeakerFilters = {};
    const page = searchParams.get('page');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const country = searchParams.get('country');
    const modality = searchParams.get('modality') as SpeakerFilters['modality'];
    const language = searchParams.get('language');

    if (page) p.page = Number(page);
    if (search) p.search = search;
    if (category) p.category = category;
    if (country) p.country = country;
    if (modality) p.modality = modality;
    if (language) p.language = language;
    p.per_page = 12;
    return p;
  }, [searchParams]);

  // ── Queries ─────────────────────────────────────────────────────────
  const { data: speakersData, isLoading } = useSpeakers(filters);
  const { data: featuredSpeakers } = useFeaturedSpeakers();
  const { data: categories } = useCategories();
  const { data: languages } = useLanguages();

  const speakers = speakersData?.data ?? [];
  const meta = speakersData?.meta;

  // ── URL helpers ─────────────────────────────────────────────────────
  const setFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 when changing filters (except page itself)
      if (key !== 'page') {
        params.delete('page');
      }
      router.push(`/directorio?${params.toString()}`);
    },
    [searchParams, router],
  );

  const clearFilters = useCallback(() => {
    router.push('/directorio');
  }, [router]);

  const currentPage = meta?.current_page ?? 1;
  const lastPage = meta?.last_page ?? 1;

  const hasActiveFilters =
    searchParams.has('search') ||
    searchParams.has('category') ||
    searchParams.has('country') ||
    searchParams.has('modality') ||
    searchParams.has('language');

  // ── Search handler ──────────────────────────────────────────────────
  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const q = formData.get('search') as string;
      setFilter('search', q || null);
    },
    [setFilter],
  );

  // ── Pagination ──────────────────────────────────────────────────────
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    if (lastPage <= 7) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < lastPage - 2) pages.push('ellipsis');
      pages.push(lastPage);
    }
    return pages;
  }, [currentPage, lastPage]);

  return (
    <div className="pb-16">
      {/* ── Search Header ─────────────────────────────────────────────── */}
      <header className="py-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4 md:text-5xl">
          Directorio de Speakers
        </h1>
        <form
          onSubmit={handleSearch}
          className="relative mx-auto mt-8 max-w-3xl"
        >
          <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            defaultValue={filters.search ?? ''}
            placeholder="Encuentra al speaker perfecto..."
            className="h-14 w-full rounded-xl pl-14 pr-32 text-base shadow-sm"
          />
          <Button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground hover:bg-accent/90 px-6 rounded-lg"
          >
            Buscar
          </Button>
        </form>
      </header>

      {/* ── Featured Speakers ─────────────────────────────────────────── */}
      {featuredSpeakers && featuredSpeakers.length > 0 && !hasActiveFilters && (
        <section className="mx-auto max-w-7xl px-6 mb-16">
          <h2 className="text-2xl font-bold text-primary mb-8 md:text-3xl">
            Speakers Destacados
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featuredSpeakers.slice(0, 3).map((speaker) => (
              <SpeakerCard key={speaker.id} speaker={speaker} />
            ))}
          </div>
        </section>
      )}

      {/* ── Main Content: Sidebar + Grid ──────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 flex flex-col gap-6 lg:flex-row">
        {/* ── Sidebar Filters ─────────────────────────────────────────── */}
        <aside className="w-full flex-shrink-0 lg:w-72">
          <div className="rounded-xl bg-muted/50 p-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-primary" />
                <h4 className="text-lg font-semibold text-primary">Filtros</h4>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                >
                  <X className="size-3" />
                  Limpiar
                </button>
              )}
            </div>

            {/* Category filter */}
            <FilterSection label="Categoria">
              <div className="flex flex-wrap gap-2">
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setFilter(
                        'category',
                        filters.category === cat.slug ? null : cat.slug,
                      )
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      filters.category === cat.slug
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-background text-foreground hover:border-accent/50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Country filter */}
            <FilterSection label="Pais">
              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
                {COUNTRIES.map((c) => (
                  <button
                    key={c}
                    onClick={() =>
                      setFilter(
                        'country',
                        filters.country === c ? null : c,
                      )
                    }
                    className={`rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                      filters.country === c
                        ? 'bg-accent/10 text-accent'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Language filter */}
            <FilterSection label="Idioma">
              <div className="flex flex-wrap gap-2">
                {languages?.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() =>
                      setFilter(
                        'language',
                        filters.language === lang.code ? null : lang.code,
                      )
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      filters.language === lang.code
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-background text-foreground hover:border-accent/50'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Modality filter */}
            <FilterSection label="Modalidad">
              <div className="grid grid-cols-3 gap-2">
                {MODALITIES.map((mod) => (
                  <button
                    key={mod.value}
                    onClick={() =>
                      setFilter(
                        'modality',
                        filters.modality === mod.value ? null : mod.value,
                      )
                    }
                    className={`rounded-lg py-2 text-xs font-medium transition-colors ${
                      filters.modality === mod.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-foreground ring-1 ring-border hover:ring-primary/40'
                    }`}
                  >
                    {mod.label}
                  </button>
                ))}
              </div>
            </FilterSection>
          </div>
        </aside>

        {/* ── Speakers Grid ───────────────────────────────────────────── */}
        <div className="flex-1">
          {/* Active filters summary */}
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {meta?.total ?? 0} resultado{(meta?.total ?? 0) !== 1 ? 's' : ''}
              </span>
              {filters.search && (
                <Badge variant="outline" className="gap-1">
                  &quot;{filters.search}&quot;
                  <button onClick={() => setFilter('search', null)}>
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              {filters.category && (
                <Badge variant="outline" className="gap-1">
                  {filters.category}
                  <button onClick={() => setFilter('category', null)}>
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              {filters.country && (
                <Badge variant="outline" className="gap-1">
                  {filters.country}
                  <button onClick={() => setFilter('country', null)}>
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              {filters.modality && (
                <Badge variant="outline" className="gap-1">
                  {filters.modality}
                  <button onClick={() => setFilter('modality', null)}>
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
              {filters.language && (
                <Badge variant="outline" className="gap-1">
                  {filters.language}
                  <button onClick={() => setFilter('language', null)}>
                    <X className="size-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-xl bg-muted"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && speakers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search className="mb-4 size-12 text-muted-foreground/40" />
              <h3 className="text-lg font-semibold text-primary">
                No se encontraron speakers
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Intenta ajustar los filtros de busqueda o explora otras
                categorias.
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          )}

          {/* Speaker cards grid */}
          {!isLoading && speakers.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {speakers.map((speaker) => (
                <SpeakerCard key={speaker.id} speaker={speaker} />
              ))}
            </div>
          )}

          {/* ── Pagination ────────────────────────────────────────────── */}
          {lastPage > 1 && (
            <nav className="mt-12 flex items-center justify-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setFilter('page', String(currentPage - 1))}
                className="flex size-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronLeft className="size-4" />
              </button>

              {pageNumbers.map((p, i) =>
                p === 'ellipsis' ? (
                  <span key={`e-${i}`} className="px-2 text-muted-foreground">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setFilter('page', String(p))}
                    className={`flex size-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      p === currentPage
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border hover:bg-muted'
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                disabled={currentPage >= lastPage}
                onClick={() => setFilter('page', String(currentPage + 1))}
                className="flex size-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Small helper component ─────────────────────────────────────────── */

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
