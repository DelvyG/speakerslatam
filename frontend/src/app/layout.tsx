import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import SiteHead from "@/components/SiteHead";
import { BodyStartCode, BodyEndCode } from "@/components/CodeInjection";
import { QueryProvider } from "@/lib/providers";
import { SiteSettingsProvider } from "@/lib/site-settings";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpeakerLATAM - Directorio de Conferencistas de America Latina",
  description:
    "Encuentra y contrata a los mejores conferencistas, speakers y panelistas de America Latina. Directorio con mas de 500 profesionales en liderazgo, innovacion, tecnologia, ventas y mas.",
  keywords: [
    "conferencistas",
    "speakers",
    "America Latina",
    "conferencias",
    "eventos",
    "panelistas",
    "keynote",
  ],
  openGraph: {
    title: "SpeakerLATAM - Directorio de Conferencistas de America Latina",
    description:
      "Encuentra y contrata a los mejores conferencistas de America Latina.",
    type: "website",
    locale: "es_LA",
  },
  icons: {
    icon: "/storage/branding/favicon.png",
    apple: "/storage/branding/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <QueryProvider>
          <AuthProvider>
            <SiteSettingsProvider>
              <SiteHead />
              <BodyStartCode />
              <AnalyticsTracker />
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <BodyEndCode />
            </SiteSettingsProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
