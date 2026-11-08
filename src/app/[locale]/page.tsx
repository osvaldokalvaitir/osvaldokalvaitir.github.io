import { notFound } from 'next/navigation'

import { About } from '@/components/sections/about'
import { Experience } from '@/components/sections/experience'
import { Interests } from '@/components/sections/interests'
import { Skills } from '@/components/sections/skills'
import { Start } from '@/components/sections/start'
import { Thanks } from '@/components/sections/thanks'
import { isLocale, type LocaleParams } from '@/i18n/config'
import { getT } from '@/i18n/get-t'

export default async function Page({ params }: LocaleParams) {
  const { locale } = await params

  if (!isLocale(locale)) notFound()

  const t = getT(locale)

  // Section order: start, about, experience, education, skills, interests,
  // courses, speeches, thanks (the missing ones are added by later tasks).
  return (
    <>
      <Start />
      <About t={t} />
      <Experience t={t} />
      <Skills t={t} />
      <Interests t={t} />
      <Thanks t={t} />
    </>
  )
}
