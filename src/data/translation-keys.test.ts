import assert from 'node:assert/strict'
import { test } from 'node:test'

import en from '../locales/en.json' with { type: 'json' }
import ptBR from '../locales/pt-BR.json' with { type: 'json' }
import { experience } from './experience.ts'
import { sections } from './sections.ts'
import { hardSkills, softSkills } from './skills.ts'

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
    'skills.section',
    'skills.hard-skills.section',
    'skills.soft-skills.section',
    ...softSkills.map((skill) => `skills.soft-skills.${skill}`),
    'interests.section',
    ...[1, 2, 3, 4, 5, 6].map((n) => `interests.paragraph${n}`),
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
