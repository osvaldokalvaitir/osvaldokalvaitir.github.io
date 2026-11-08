import type { ResourceLanguage, TFunction } from 'i18next'

import en from '../locales/en.json'
import ptBR from '../locales/pt-BR.json'
import {
  clientNamespaces,
  type Locale,
  pickNamespaces,
  toI18nLang,
} from './config'
import { createI18n } from './create-i18n'

export const resources = {
  'pt-BR': { translation: ptBR },
  en: { translation: en },
}

export function getT(locale: Locale): TFunction {
  return createI18n(locale, resources).t
}

/** Serializable translations the client `I18nProvider` needs (server only). */
export function getClientMessages(locale: Locale): ResourceLanguage {
  return pickNamespaces(
    resources[toI18nLang(locale)].translation,
    clientNamespaces,
  )
}
