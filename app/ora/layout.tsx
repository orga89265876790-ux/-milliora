import type { Metadata } from "next";
import { privatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Ора — личная память и инструменты анализа",
  description:
    "Личная страница Оры в MilliOra: астрологический анализ, сновидения, имя, подпись, почерк, нумерология, матрица судьбы, таро и руны.",
  ...privatePageMetadata,
};

export default function OraLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
