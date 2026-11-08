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
