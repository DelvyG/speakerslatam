"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";

export interface SiteSettings {
  site_name?: string;
  site_tagline?: string;
  logo_url?: string;
  logo_login_url?: string;
  favicon_url?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  seo_og_image?: string;
  code_head?: string;
  code_body_start?: string;
  code_body_end?: string;
  contact_email?: string;
  social_instagram?: string;
  social_linkedin?: string;
  social_twitter?: string;
  social_youtube?: string;
  [key: string]: string | undefined;
}

const SiteSettingsContext = createContext<SiteSettings>({});

export function SiteSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    api
      .get<{ data: SiteSettings }>("/settings")
      .then((res) => setSettings(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function getBackendUrl(path?: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://speakerslatam.net";
  return `${base}${path}`;
}
