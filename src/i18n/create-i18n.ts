import i18next, { type Resource } from 'i18next'

import { type Locale, toI18nLang } from './config'

/** Synchronous i18next instance (no backend) for the given resources. */
export function createI18n(locale: Locale, resources: Resource) {
  const instance = i18next.createInstance()
  instance.init({
    resources,
    lng: toI18nLang(locale),
    fallbackLng: 'pt-BR',
    initAsync: false,
    interpolation: { escapeValue: false },
  })
  return instance
}
