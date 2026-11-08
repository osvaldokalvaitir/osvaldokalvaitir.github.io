import type { TFunction } from 'i18next'

import { CurriculumList } from '@/components/curriculum-list'
import { ResumeItem } from '@/components/resume-item'
import { Section } from '@/components/section'
import { Collapse } from '@/components/ui/collapse'
import { courses } from '@/data/courses'

export function Courses({ t }: { t: TFunction }) {
  return (
    <Section id="courses">
      <h2 className="mb-12">{t('courses.section')}</h2>
      {courses.map((item) => {
        const key = `courses.${item.id}`
        const school = <h3 className="mb-2">{t(`${key}.school`)}</h3>
        return (
          <ResumeItem
            key={item.id}
            logo={item.logo}
            logoAlt={item.logoAlt}
            period={t(`${key}.period`)}
          >
            {item.url ? (
              <a href={item.url} target="_blank" rel="noreferrer">
                {school}
              </a>
            ) : (
              school
            )}
            {item.allCourses ? (
              <Collapse label={t(`${key}.all-courses.section`)}>
                <CurriculumList
                  t={t}
                  prefix={`${key}.all-courses`}
                  entries={item.allCourses}
                  trailingBreak={item.trailingBreak}
                />
              </Collapse>
            ) : (
              <div className="text-gray-600">{t(`${key}.description`)}</div>
            )}
            <p className="text-[0.8rem] text-gray-700">
              {t(`${key}.total-workload`)}
            </p>
          </ResumeItem>
        )
      })}
    </Section>
  )
}
