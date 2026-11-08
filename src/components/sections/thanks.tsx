import type { TFunction } from 'i18next'

import { Section } from '@/components/section'

const paragraphs = [1, 2, 3] as const

export function Thanks({ t }: { t: TFunction }) {
  return (
    <Section id="thanks" divider={false}>
      <h2 className="mb-12">{t('thanks.section')}</h2>
      {paragraphs.map((n) => (
        <p key={n} className="text-gray-600">
          {t(`thanks.paragraph${n}`)}
        </p>
      ))}
      <div className="mt-[200px]">
        <img
          src="/img/logos/logo-kalvaitir-end.png"
          alt="Kalvaitir logo"
          className="mx-auto mb-[30px] block size-[100px] max-w-full"
        />
        <div className="text-center">
          <span className="text-primary">{t('thanks.copyright')}</span>
          <br />
          <span className="text-gray-400">{t('thanks.rights')}</span>
        </div>
      </div>
    </Section>
  )
}
