"use client";

import { useEffect } from "react";
import { useSiteSettings, getBackendUrl } from "@/lib/site-settings";

export default function SiteHead() {
  const settings = useSiteSettings();
  const faviconUrl = getBackendUrl(settings.favicon_url);

  useEffect(() => {
    if (!faviconUrl) return;

    // Update existing favicon link or create one
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = faviconUrl;

    // Apple touch icon
    let apple = document.querySelector<HTMLLinkElement>(
      "link[rel='apple-touch-icon']"
    );
    if (!apple) {
      apple = document.createElement("link");
      apple.rel = "apple-touch-icon";
      document.head.appendChild(apple);
    }
    apple.href = faviconUrl;
  }, [faviconUrl]);

  useEffect(() => {
    if (!settings.code_head) return;

    const container = document.createElement("div");
    container.innerHTML = settings.code_head;

    // Move scripts and meta tags to head
    Array.from(container.children).forEach((el) => {
      document.head.appendChild(el.cloneNode(true));
    });
  }, [settings.code_head]);

  return null;
}
