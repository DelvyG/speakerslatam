"use client";

import { useSiteSettings } from "@/lib/site-settings";

export function BodyStartCode() {
  const settings = useSiteSettings();
  if (!settings.code_body_start) return null;
  return (
    <div
      dangerouslySetInnerHTML={{ __html: settings.code_body_start }}
      suppressHydrationWarning
    />
  );
}

export function BodyEndCode() {
  const settings = useSiteSettings();
  if (!settings.code_body_end) return null;
  return (
    <div
      dangerouslySetInnerHTML={{ __html: settings.code_body_end }}
      suppressHydrationWarning
    />
  );
}
