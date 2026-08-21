import type { Metadata } from "next";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

type PublicMetadataInput = {
  title: string;
  description?: string;
  path?: string;
};

export function buildPublicMetadata({
  title,
  description = siteDescription,
  path = "/",
}: PublicMetadataInput): Metadata {
  return {
    title,
    description,
    ...(siteUrl
      ? {
          alternates: {
            canonical: path,
          },
          openGraph: {
            type: "website",
            locale: "ru_RU",
            siteName,
            title,
            description,
            url: new URL(path, `${siteUrl}/`).toString(),
          },
        }
      : {
          openGraph: {
            type: "website",
            locale: "ru_RU",
            siteName,
            title,
            description,
          },
        }),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const privatePageMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};
