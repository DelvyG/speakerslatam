'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, startHeartbeat, stopHeartbeat } from '@/lib/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
    startHeartbeat(pathname);

    return () => {
      stopHeartbeat();
    };
  }, [pathname]);

  return null;
}
