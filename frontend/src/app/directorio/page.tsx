import { Suspense } from 'react';
import type { Metadata } from 'next';
import DirectorioContent from './DirectorioContent';

export const metadata: Metadata = {
  title: 'Directorio de Speakers | SpeakerLATAM',
  description: 'Encuentra al conferencista ideal para tu evento. Filtra por categoria, pais, idioma y modalidad.',
};

function DirectorioFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-10 w-64 animate-pulse rounded bg-muted mb-8" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

export default function DirectorioPage() {
  return (
    <Suspense fallback={<DirectorioFallback />}>
      <DirectorioContent />
    </Suspense>
  );
}
