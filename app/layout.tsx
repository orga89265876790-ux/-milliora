import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

const defaultTitle =
  "MilliOra — самоанализ, цифровой портрет личности и история изменений";

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  creator: siteName,
  publisher: siteName,
  category: "lifestyle",
  keywords: [
    "самоанализ",
    "самопознание",
    "цифровой портрет личности",
    "психологические тесты",
    "личный гороскоп",
    "хорар",
    "сонник",
    "анализ почерка",
    "нумерология",
    "колесо баланса",
  ],
  ...(siteUrl
    ? {
        alternates: {
          canonical: "/",
        },
      }
    : {}),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName,
    title: defaultTitle,
    description: siteDescription,
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.YANDEX_VERIFICATION || undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f7ff",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: siteName,
      alternateName: "МиллиОра",
      description: siteDescription,
      inLanguage: "ru-RU",
      ...(siteUrl ? { url: siteUrl } : {}),
    },
    {
      "@type": "WebApplication",
      name: siteName,
      description: siteDescription,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      inLanguage: "ru-RU",
      ...(siteUrl ? { url: siteUrl } : {}),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
