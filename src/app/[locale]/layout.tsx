import '@/styles/globals.css'

import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { isLocale, type LocaleParams, locales, toI18nLang } from '@/i18n/config'

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: '#28A745',
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params

  return {
    title: 'Osvaldo Kalvaitir Filho',
    description: 'Personal website',
    authors: [{ name: 'Osvaldo Kalvaitir Filho' }],
    manifest: '/manifest.json',
    alternates: {
      canonical: `/${locale}/`,
      languages: { 'pt-BR': '/pt-br/', en: '/en/' },
    },
    icons: {
      icon: '/img/favicon.ico',
      shortcut: '/img/logos/logo-kalvaitir-end.png',
    },
    appleWebApp: {
      capable: true,
      title: 'Kalvaitir',
      statusBarStyle: 'black-translucent',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleParams & { children: ReactNode }) {
  const { locale } = await params

  if (!isLocale(locale)) notFound()

  return (
    <html lang={toI18nLang(locale)}>
      <body>{children}</body>
    </html>
  )
}
