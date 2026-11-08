import type { TFunction } from 'i18next'
import { Fragment } from 'react'

import type { CurriculumEntry } from '@/data/types'
import { cn } from '@/lib/utils'

/** `.subheading`, `.subheading2`, `.subheading3` from the original CSS. */
const headingClass = {
  1: 'subheading',
  2: 'ml-5 font-heading text-[1.5rem] text-gray-600',
  3: 'ml-10 font-heading text-[1.2rem] text-gray-600',
} as const

/** `.text`, `.text.text2`, `.text.text3` */
const textClass = { 1: '', 2: 'ml-5', 3: 'ml-10' } as const

type CurriculumListProps = {
  t: TFunction
  /** Translation key prefix, e.g. `education.university.curriculum`. */
  prefix: string
  entries: readonly CurriculumEntry[]
  /** The original markup also had a `<br>` after the last text. */
  trailingBreak?: boolean
}

export function CurriculumList({
  t,
  prefix,
  entries,
  trailingBreak = false,
}: CurriculumListProps) {
  return entries.map((entry, index) => (
    <Fragment key={entry.key}>
      <div className={headingClass[entry.level]}>
        {t(`${prefix}.${entry.key}`)}
      </div>
      {entry.description && (
        <>
          <div
            className={cn(
              'text-gray-600',
              textClass[entry.textLevel ?? entry.level],
            )}
          >
            {t(`${prefix}.${entry.description}`)}
          </div>
          {(trailingBreak || index < entries.length - 1) && <br />}
        </>
      )}
    </Fragment>
  ))
}
