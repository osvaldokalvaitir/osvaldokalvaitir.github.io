import assert from 'node:assert/strict'
import { test } from 'node:test'

import { isLocale, languageHref, localeHref, toI18nLang } from './config.ts'

test('isLocale', () => {
  assert.equal(isLocale('pt-br'), true)
  assert.equal(isLocale('en'), true)
  assert.equal(isLocale('pt-BR'), false)
  assert.equal(isLocale('fr'), false)
})

test('toI18nLang', () => {
  assert.equal(toI18nLang('pt-br'), 'pt-BR')
  assert.equal(toI18nLang('en'), 'en')
})

test('localeHref', () => {
  assert.equal(localeHref('en'), '/en/')
  assert.equal(localeHref('en', '#skills'), '/en/#skills')
  assert.equal(localeHref('pt-br', ''), '/pt-br/')
})

test('languageHref', () => {
  // the section the visitor is in wins over a stale hash
  assert.equal(languageHref('en', 'skills', '#about'), '/en/#skills')
  // no active section: fall back to the current hash
  assert.equal(languageHref('en', null, '#about'), '/en/#about')
  // neither: locale root
  assert.equal(languageHref('en', null, ''), '/en/')
  assert.equal(languageHref('pt-br', null), '/pt-br/')
})
