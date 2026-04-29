"use client";

import { useSiteSettings, getBackendUrl } from "@/lib/site-settings";

export default function SiteHead() {
  const settings = useSiteSettings();

  const faviconUrl = getBackendUrl(settings.favicon_url);

  return (
    <>
      {faviconUrl && (
        <>
          <link rel="icon" href={faviconUrl} sizes="any" />
          <link rel="apple-touch-icon" href={faviconUrl} />
        </>
      )}
      {settings.code_head && (
        <script
          dangerouslySetInnerHTML={{ __html: settings.code_head }}
        />
      )}
    </>
  );
}
