import '@/styles/globals.css'

import type { ReactNode } from 'react'

export const dynamicParams = false

export function generateStaticParams() {
  return [{ locale: 'pt-br' }, { locale: 'en' }]
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <html lang={locale === 'pt-br' ? 'pt-BR' : 'en'}>
      <body>{children}</body>
    </html>
  )
}
