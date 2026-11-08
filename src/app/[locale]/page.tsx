import type { LocaleParams } from '@/i18n/config'

export default async function Page({ params }: LocaleParams) {
  const { locale } = await params

  return <p>{locale}</p>
}
