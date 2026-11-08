'use client'

import { type ReactNode, useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'

import type { Locale } from './config'
import { createI18n } from './get-t'

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const instance = useMemo(() => createI18n(locale), [locale])

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>
}
