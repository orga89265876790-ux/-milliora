export const siteName = "MilliOra";
export const siteDescription =
  "MilliOra — веб-приложение для самоанализа, наблюдения за изменениями, психологических практик и формирования цифрового портрета личности.";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = configuredSiteUrl
  ? configuredSiteUrl.replace(/\/+$/, "")
  : undefined;

export function absoluteUrl(path = "/") {
  if (!siteUrl) return undefined;
  return new URL(path, `${siteUrl}/`).toString();
}
