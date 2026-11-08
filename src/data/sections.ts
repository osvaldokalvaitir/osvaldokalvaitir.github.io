export type SectionId =
  | 'start'
  | 'about'
  | 'experience'
  | 'education'
  | 'skills'
  | 'interests'
  | 'courses'
  | 'speeches'
  | 'thanks'

const ids: readonly SectionId[] = [
  'start',
  'about',
  'experience',
  'education',
  'skills',
  'interests',
  'courses',
  'speeches',
  'thanks',
]

export const sections: readonly { id: SectionId; labelKey: string }[] = ids.map(
  (id) => ({ id, labelKey: `sidebar.${id}` }),
)
