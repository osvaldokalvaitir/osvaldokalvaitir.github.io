import i18next, { type TFunction } from 'i18next'

import en from '../locales/en.json'
import ptBR from '../locales/pt-BR.json'
import { type Locale, toI18nLang } from './config'

export const resources = {
  'pt-BR': { translation: ptBR },
  en: { translation: en },
}

export function createI18n(locale: Locale) {
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

export function getT(locale: Locale): TFunction {
  return createI18n(locale).t
}
