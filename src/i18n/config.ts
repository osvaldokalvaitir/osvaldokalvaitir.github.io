export type Locale = 'pt-br' | 'en'

export const locales: readonly Locale[] = ['pt-br', 'en']

export const defaultLocale: Locale = 'pt-br'

export type LocaleParams = { params: Promise<{ locale: string }> }

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function toI18nLang(locale: Locale): 'pt-BR' | 'en' {
  return locale === 'pt-br' ? 'pt-BR' : 'en'
}

export function localeHref(locale: Locale, hash = ''): string {
  return `/${locale}/${hash}`
}

/**
 * Href of the language switcher: keeps the section the visitor is in (scroll
 * spy), falling back to the current hash, then to the locale root.
 */
export function languageHref(
  locale: Locale,
  activeId: string | null,
  hash = '',
): string {
  return localeHref(locale, activeId ? `#${activeId}` : hash)
}

/** Translation namespaces read by client components (`useTranslation`). */
export const clientNamespaces = ['sidebar'] as const

/**
 * Subset of a locale's translations shipped to the client: only the given
 * top-level namespaces, so the client bundle does not carry every string.
 */
export function pickNamespaces<T extends object, K extends keyof T>(
  translation: T,
  namespaces: readonly K[],
): Pick<T, K> {
  const subset = {} as Pick<T, K>
  for (const namespace of namespaces) subset[namespace] = translation[namespace]
  return subset
}
