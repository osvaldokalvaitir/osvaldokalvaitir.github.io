import type { TFunction } from 'i18next'
import { Fragment } from 'react'

import { ResumeItem } from '@/components/resume-item'
import { Section } from '@/components/section'
import { speeches } from '@/data/speeches'

export function Speeches({ t }: { t: TFunction }) {
  return (
    <Section id="speeches">
      <h2 className="mb-12">{t('speeches.section')}</h2>
      {speeches.map((item) => {
        const key = `speeches.${item.id}`
        return (
          <ResumeItem
            key={item.id}
            logo={item.logo}
            logoAlt={item.logoAlt}
            period={item.periods.map((period, index) => (
              <Fragment key={period}>
                {index > 0 && <br />}
                {t(`${key}.${period}`)}
              </Fragment>
            ))}
          >
            <h3 className="mb-0">{t(`${key}.event`)}</h3>
            <a href={item.url} target="_blank" rel="noreferrer">
              <div className="mb-2 subheading">{t(`${key}.description`)}</div>
            </a>
            {item.speeches.map((speech) => (
              <div key={speech} className="text-gray-600">
                {t(`${key}.${speech}`)}
              </div>
            ))}
            <p className="text-[0.8rem] text-gray-700">
              {t(`${key}.total-workload`)}
            </p>
          </ResumeItem>
        )
      })}
    </Section>
  )
}
