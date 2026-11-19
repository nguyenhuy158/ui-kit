export const SUPPORTED_LOCALES = ["vi", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: Locale = "vi";
const DEFAULT_CURRENCY = "VND";

function isSupported(language: string): language is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(language);
}

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const tag of languages) {
    const language = tag?.split("-")[0]?.toLowerCase();
    if (language && isSupported(language)) return language;
  }
  return DEFAULT_LOCALE;
}

export function detectTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function applyLocale(locale: Locale = detectLocale()): Locale {
  document.documentElement.lang = locale;
  return locale;
}

export function currentLocale(): Locale {
  const lang =
    typeof document === "undefined" ? "" : document.documentElement.lang;
  return isSupported(lang) ? lang : detectLocale();
}

export function formatDateTime(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  },
): string {
  return new Intl.DateTimeFormat(currentLocale(), {
    timeZone: detectTimeZone(),
    ...options,
  }).format(new Date(value));
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(currentLocale(), options).format(value);
}

export function formatMoney(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
): string {
  return formatNumber(amount, { style: "currency", currency });
}
