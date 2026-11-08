import type { TFunction } from 'i18next'

import { Section } from '@/components/section'

const paragraphs = [1, 2, 3, 4, 5, 6] as const

export function Interests({ t }: { t: TFunction }) {
  return (
    <Section id="interests">
      <h2 className="mb-12">{t('interests.section')}</h2>
      {paragraphs.map((n) => (
        <p key={n} className="text-gray-600">
          {t(`interests.paragraph${n}`)}
        </p>
      ))}
    </Section>
  )
}
