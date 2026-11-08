import type { TFunction } from 'i18next'

import { ResumeItem } from '@/components/resume-item'
import { Section } from '@/components/section'
import { experience } from '@/data/experience'

export function Experience({ t }: { t: TFunction }) {
  return (
    <Section id="experience" align="start">
      <h2 className="mb-12">{t('experience.section')}</h2>
      {experience.map((item) => (
        <ResumeItem
          key={item.id}
          logo={item.logo}
          logoAlt={item.logoAlt}
          period={t(`experience.${item.id}.period`)}
        >
          <h3 className="mb-0">{t(`experience.${item.id}.office`)}</h3>
          <a href={item.url} target="_blank" rel="noreferrer">
            <div className="mb-2 subheading">
              {t(`experience.${item.id}.company`)}
            </div>
          </a>
          <p className="text-gray-600">
            {t(`experience.${item.id}.functions`)}
          </p>
        </ResumeItem>
      ))}
    </Section>
  )
}
