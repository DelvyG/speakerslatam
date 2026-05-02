'use client';

import { useEffect, useState } from 'react';
import { getFeaturedSpeakers } from '@/lib/queries';
import SpeakerCard from '@/components/ui/SpeakerCard';
import type { Speaker } from '@/types';

export default function FeaturedSpeakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedSpeakers()
      .then(setSpeakers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-72 animate-pulse rounded-xl bg-muted ring-1 ring-border"
          />
        ))}
      </div>
    );
  }

  if (speakers.length === 0) return null;

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {speakers.slice(0, 4).map((speaker) => (
        <SpeakerCard key={speaker.id} speaker={speaker} />
      ))}
    </div>
  );
}
