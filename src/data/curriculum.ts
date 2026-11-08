import type { CurriculumEntry } from './types.ts'

/** A heading with its `<key>-description` text below it. */
export function entry(
  key: string,
  level: CurriculumEntry['level'] = 1,
  textLevel?: CurriculumEntry['textLevel'],
): CurriculumEntry {
  return {
    key,
    level,
    description: `${key}-description`,
    ...(textLevel ? { textLevel } : {}),
  }
}

/** A group heading without text. */
export function heading(
  key: string,
  level: CurriculumEntry['level'] = 1,
): CurriculumEntry {
  return { key, level }
}
