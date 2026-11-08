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
