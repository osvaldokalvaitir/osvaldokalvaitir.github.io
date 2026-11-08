import type { TFunction } from 'i18next'
import { Fragment } from 'react'

import { faCheck } from '@/components/icons/brand-icons'
import { Icon } from '@/components/icons/icon'
import { PngIcon } from '@/components/icons/png-icon'
import { Section } from '@/components/section'
import { Tooltip } from '@/components/ui/tooltip'
import { hardSkills, softSkills } from '@/data/skills'

export function Skills({ t }: { t: TFunction }) {
  return (
    <Section id="skills">
      <h2 className="mb-12">{t('skills.section')}</h2>

      <h3 className="mb-4">{t('skills.hard-skills.section')}</h3>
      <div className="mb-12 flex flex-col justify-between md:flex-row">
        <div className="w-full">
          {/* The whitespace between the inline-block items is part of the
              original spacing, so it is rendered explicitly. */}
          <ul className="mb-4 text-[3rem] text-gray-700">
            {hardSkills.map((skill) => (
              <Fragment key={skill.name}>
                <Tooltip content={skill.name}>
                  <li className="inline-block not-last:mr-2">
                    {'icon' in skill ? (
                      <Icon def={skill.icon} className="hover:text-primary" />
                    ) : (
                      <div className="flex">
                        <PngIcon name={skill.png} className="mb-[18px]" />
                      </div>
                    )}
                  </li>
                </Tooltip>{' '}
              </Fragment>
            ))}
          </ul>
        </div>
      </div>

      <h3 className="mb-4">{t('skills.soft-skills.section')}</h3>
      <ul className="mb-0 ml-[2.5em]">
        {softSkills.map((skill) => (
          <li key={skill} className="relative mb-[15px] text-gray-600">
            <span className="absolute -left-[2em] w-[2em] text-center">
              <Icon def={faCheck} />
            </span>
            <span>{t(`skills.soft-skills.${skill}`)}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}
