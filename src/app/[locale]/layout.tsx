import '@/styles/globals.css'

import type { Metadata, Viewport } from 'next'
import {
  Mulish,
  Saira_Extra_Condensed as SairaExtraCondensed,
} from 'next/font/google'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { Sidebar } from '@/components/sidebar/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { isLocale, type LocaleParams, locales, toI18nLang } from '@/i18n/config'
import { getClientMessages } from '@/i18n/get-t'
import { I18nProvider } from '@/i18n/provider'
import { cn } from '@/lib/utils'

const mulish = Mulish({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '800'],
  style: ['normal', 'italic'],
  variable: '--font-mulish',
})

const saira = SairaExtraCondensed({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '700'],
  variable: '--font-saira',
})

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
    // Absolute URLs: search engines ignore relative hreflang/canonical links.
    metadataBase: new URL('https://kalvaitir.com'),
    title: 'Osvaldo Kalvaitir Filho',
    description: 'Personal website',
    authors: [{ name: 'Osvaldo Kalvaitir Filho' }],
    manifest: '/manifest.json',
    alternates: {
      canonical: `/${locale}/`,
      languages: { 'pt-BR': '/pt-br/', en: '/en/', 'x-default': '/pt-br/' },
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
    <html
      lang={toI18nLang(locale)}
      className={cn(mulish.variable, saira.variable)}
    >
      <body>
        <I18nProvider locale={locale} messages={getClientMessages(locale)}>
          <TooltipProvider>
            <Sidebar locale={locale} />
            <main>{children}</main>
          </TooltipProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
