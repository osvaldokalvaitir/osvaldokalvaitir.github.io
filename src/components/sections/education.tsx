import type { TFunction } from 'i18next'

import { CurriculumList } from '@/components/curriculum-list'
import { ResumeItem } from '@/components/resume-item'
import { Section } from '@/components/section'
import { CurriculumDialog } from '@/components/ui/dialog'
import { education } from '@/data/education'

export function Education({ t }: { t: TFunction }) {
  return (
    <Section id="education">
      <h2 className="mb-12">{t('education.section')}</h2>
      {education.map((item) => {
        const key = `education.${item.id}`
        return (
          <ResumeItem
            key={item.id}
            logo={item.logo}
            logoAlt={item.logoAlt}
            period={t(`${key}.period`)}
          >
            <a href={item.url} target="_blank" rel="noreferrer">
              <h3 className="mb-0">{t(`${key}.name`)}</h3>
            </a>
            <div className="mb-2 subheading">{t(`${key}.graduation`)}</div>
            <div className="text-gray-600">{t(`${key}.description`)}</div>
            <p className="text-[0.8rem] text-gray-700">
              {t(`${key}.total-workload`)}
            </p>
            <CurriculumDialog
              title={t(`${key}.curriculum.section`)}
              closeLabel={t(`${key}.curriculum.close`)}
              trigger={t(`${key}.curriculum.section`)}
            >
              <CurriculumList
                t={t}
                prefix={`${key}.curriculum`}
                entries={item.curriculum}
                trailingBreak={item.trailingBreak}
              />
            </CurriculumDialog>
          </ResumeItem>
        )
      })}
    </Section>
  )
}
