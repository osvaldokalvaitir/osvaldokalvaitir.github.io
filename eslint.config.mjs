import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const baseDirectory = dirname(fileURLToPath(import.meta.url))

// The Rocketseat config is legacy (eslintrc) and ships its own plugins as
// nested dependencies, so plugins must be resolved relative to it.
const compat = new FlatCompat({
  baseDirectory,
  resolvePluginsRelativeTo: join(
    baseDirectory,
    'node_modules/@rocketseat/eslint-config',
  ),
})

const nextConfigs = [...nextCoreWebVitals, ...nextTypescript]
const nextPluginNames = new Set(
  nextConfigs.flatMap((config) => Object.keys(config.plugins ?? {})),
)

// Plugins already provided by eslint-config-next (flat) must not be redefined
// by the legacy Rocketseat config; only its rules are kept for them.
const rocketseatConfigs = compat
  .extends('@rocketseat/eslint-config/next')
  .map((config) => {
    const plugins = Object.fromEntries(
      Object.entries(config.plugins ?? {}).filter(
        ([name]) => !nextPluginNames.has(name),
      ),
    )
    // typescript-eslint v6 (bundled with Rocketseat) is replaced by the v8
    // set from eslint-config-next, so its parser and rules are dropped.
    const rules = Object.fromEntries(
      Object.entries(config.rules ?? {}).filter(
        ([name]) => !name.startsWith('@typescript-eslint/'),
      ),
    )
    const languageOptions = { ...config.languageOptions }
    delete languageOptions.parser
    return { ...config, plugins, rules, languageOptions }
  })

const eslintConfig = [
  { ignores: ['out/**', '.next/**', 'next-env.d.ts'] },
  ...rocketseatConfigs,
  ...nextConfigs,
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      // Static export with images.unoptimized: next/image adds nothing here.
      '@next/next/no-img-element': 'off',
    },
  },
]

export default eslintConfig
