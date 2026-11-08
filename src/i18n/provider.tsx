'use client'

import type { ResourceLanguage } from 'i18next'
import { type ReactNode, useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'

import { type Locale, toI18nLang } from './config'
import { createI18n } from './create-i18n'

/**
 * Client i18next instance. It only gets the active locale's client
 * translations (`getClientMessages`) from the server layout; switching
 * language loads the other locale's page with its own messages.
 */
export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale
  messages: ResourceLanguage
  children: ReactNode
}) {
  const instance = useMemo(
    () =>
      createI18n(locale, { [toI18nLang(locale)]: { translation: messages } }),
    [locale, messages],
  )

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>
}
