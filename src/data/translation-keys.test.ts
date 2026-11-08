import assert from 'node:assert/strict'
import { test } from 'node:test'

import en from '../locales/en.json' with { type: 'json' }
import ptBR from '../locales/pt-BR.json' with { type: 'json' }
import { courses } from './courses.ts'
import { education } from './education.ts'
import { experience } from './experience.ts'
import { sections } from './sections.ts'
import { hardSkills, softSkills } from './skills.ts'
import { speeches } from './speeches.ts'
import type { CurriculumEntry } from './types.ts'

type Tree = { [key: string]: unknown }

function get(tree: Tree, key: string): unknown {
  return key
    .split('.')
    .reduce<unknown>(
      (node, part) =>
        node !== null && typeof node === 'object'
          ? (node as Tree)[part]
          : undefined,
      tree,
    )
}

function entryKeys(prefix: string, entries: readonly CurriculumEntry[]) {
  return entries.flatMap((entry) => [
    `${prefix}.${entry.key}`,
    ...(entry.description ? [`${prefix}.${entry.description}`] : []),
  ])
}

/** Every translation key referenced by the data modules and sections. */
export function collectKeys(): string[] {
  return [
    ...sections.map((section) => section.labelKey),
    'about.name',
    'about.surname',
    'about.profession',
    'about.address',
    'about.description',
    'about.description-2',
    'experience.section',
    ...experience.flatMap((item) =>
      ['office', 'company', 'functions', 'period'].map(
        (field) => `experience.${item.id}.${field}`,
      ),
    ),
    'education.section',
    ...education.flatMap((item) => [
      ...['name', 'graduation', 'description', 'total-workload', 'period'].map(
        (field) => `education.${item.id}.${field}`,
      ),
      `education.${item.id}.curriculum.section`,
      `education.${item.id}.curriculum.close`,
      ...entryKeys(`education.${item.id}.curriculum`, item.curriculum),
    ]),
    'skills.section',
    'skills.hard-skills.section',
    'skills.soft-skills.section',
    ...softSkills.map((skill) => `skills.soft-skills.${skill}`),
    'interests.section',
    ...[1, 2, 3, 4, 5, 6].map((n) => `interests.paragraph${n}`),
    'courses.section',
    ...courses.flatMap((item) => [
      ...['school', 'total-workload', 'period'].map(
        (field) => `courses.${item.id}.${field}`,
      ),
      ...(item.allCourses
        ? [
            `courses.${item.id}.all-courses.section`,
            ...entryKeys(`courses.${item.id}.all-courses`, item.allCourses),
          ]
        : [`courses.${item.id}.description`]),
    ]),
    'speeches.section',
    ...speeches.flatMap((item) =>
      [
        'event',
        'description',
        'total-workload',
        ...item.speeches,
        ...item.periods,
      ].map((field) => `speeches.${item.id}.${field}`),
    ),
    'thanks.section',
    'thanks.paragraph1',
    'thanks.paragraph2',
    'thanks.paragraph3',
    'thanks.copyright',
    'thanks.rights',
  ]
}

const resources: [string, Tree][] = [
  ['pt-BR', ptBR],
  ['en', en],
]

for (const [lang, tree] of resources) {
  test(`every referenced key exists in ${lang}`, () => {
    for (const key of collectKeys()) {
      const value = get(tree, key)
      assert.ok(
        typeof value === 'string' && value.length > 0,
        `missing translation key "${key}" in ${lang}`,
      )
    }
  })
}

test('sections are in page order', () => {
  assert.deepEqual(
    sections.map((section) => section.id),
    [
      'start',
      'about',
      'experience',
      'education',
      'skills',
      'interests',
      'courses',
      'speeches',
      'thanks',
    ],
  )
})

test('hard skills match the original list', () => {
  assert.equal(hardSkills.length, 77)
  assert.equal(new Set(hardSkills.map((s) => s.name)).size, 77)
  assert.equal(hardSkills[0].name, 'JavaScript')
  assert.equal(hardSkills.at(-1)?.name, 'Microsoft Teams')
  assert.equal(softSkills.length, 16)
})

test('education, courses and speeches match the original lists', () => {
  assert.deepEqual(
    education.map((item) => [item.id, item.curriculum.length]),
    [
      ['university', 15],
      ['college', 3],
    ],
  )
  assert.deepEqual(
    courses.map((item) => [item.id, item.allCourses?.length ?? 0]),
    [
      ['rocketseat', 43],
      ['universidade-global', 0],
      ['treinaweb', 6],
      ['portal-rm-factory', 0],
      ['intra', 0],
      ['iped', 0],
      ['faculdade-eduvale', 0],
      ['cebrac', 3],
      ['advance-cci', 0],
      ['interhouse', 0],
    ],
  )
  assert.deepEqual(
    speeches.map((item) => [item.id, item.speeches.length, item.periods]),
    [
      ['fdd-16', 6, ['period']],
      ['fdd-11', 6, ['period']],
      ['delphi-tour', 1, ['period']],
      ['mdl-sap-consulting', 1, ['period']],
      ['fdd-8', 5, ['period']],
      ['conince-4', 3, ['period']],
      ['it-week-2', 4, ['period']],
      ['conince-3', 4, ['period']],
      ['it-week-1', 5, ['period', 'period-2']],
      ['conince-2', 0, ['period']],
      ['enread-9', 1, ['period']],
    ],
  )
})

test('every course list has its own entries (CEBRAC bug fix)', () => {
  const cebrac = courses.find((item) => item.id === 'cebrac')
  assert.deepEqual(
    cebrac?.allCourses?.map((entry) => entry.key),
    [
      'personal-development',
      'administrative-development',
      'technological-development',
    ],
  )
})
