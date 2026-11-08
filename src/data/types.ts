export type IconDef = { viewBox: string; path: string }

export type SocialLink = { href: string; label: string; icon: IconDef }

/** Translation keys: `experience.<id>.office|company|functions|period`. */
export type ExperienceItem = {
  id: string
  logo: string
  logoAlt: string
  url: string
}

/** `png` is a sprite in `/img/icons/` (file name without extension). */
export type HardSkill = { name: string } & ({ icon: IconDef } | { png: string })

/**
 * One line of a curriculum (modal) or course list (collapse). `level` maps to
 * `.subheading`, `.subheading2` and `.subheading3`; `description` is the key
 * of the text below it, indented by `textLevel` (defaults to `level`).
 */
export type CurriculumEntry = {
  key: string
  level: 1 | 2 | 3
  description?: string
  textLevel?: 1 | 2 | 3
}

/**
 * Translation keys: `education.<id>.name|graduation|description|
 * total-workload|period` and `education.<id>.curriculum.*`.
 * `trailingBreak` keeps the `<br>` the original markup had after the last entry.
 */
export type EducationItem = {
  id: 'university' | 'college'
  logo: string
  logoAlt: string
  url: string
  curriculum: readonly CurriculumEntry[]
  trailingBreak?: boolean
}

/**
 * Translation keys: `courses.<id>.school|total-workload|period`, plus
 * `courses.<id>.all-courses.*` when `allCourses` is set, or
 * `courses.<id>.description` otherwise.
 */
export type CourseItem = {
  id: string
  logo: string
  logoAlt: string
  url?: string
  allCourses?: readonly CurriculumEntry[]
  trailingBreak?: boolean
}

/**
 * Translation keys: `speeches.<id>.event|description|total-workload`, plus one
 * key per entry of `speeches` (`speech`, `speech-1`…) and `periods`.
 */
export type SpeechItem = {
  id: string
  logo: string
  logoAlt: string
  url: string
  speeches: readonly string[]
  periods: readonly string[]
}
