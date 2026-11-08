import assert from 'node:assert/strict'
import { test } from 'node:test'

import { computeActiveSection, easeInOutExpo } from './scroll.ts'

const offsets = [
  { id: 'start', top: 0 },
  { id: 'about', top: 900 },
  { id: 'thanks', top: 5000 },
]
const base = { scrollHeight: 6000, viewportHeight: 900, offsets }

test('computeActiveSection activates the last section above scrollTop + 10', () => {
  assert.equal(computeActiveSection({ ...base, scrollTop: 0 }), 'start')
  assert.equal(computeActiveSection({ ...base, scrollTop: 889 }), 'start')
  assert.equal(computeActiveSection({ ...base, scrollTop: 890 }), 'about')
  assert.equal(computeActiveSection({ ...base, scrollTop: 2500 }), 'about')
})

test('computeActiveSection activates the last section at the end of the page', () => {
  assert.equal(computeActiveSection({ ...base, scrollTop: 5100 }), 'thanks')
})

test('computeActiveSection returns null above the first section', () => {
  assert.equal(
    computeActiveSection({
      ...base,
      offsets: [{ id: 'start', top: 54 }, ...offsets.slice(1)],
      scrollTop: 0,
    }),
    null,
  )
})

test('computeActiveSection honors a custom offset and unsorted input', () => {
  assert.equal(
    computeActiveSection({
      ...base,
      offsets: [...offsets].reverse(),
      scrollTop: 880,
      offset: 20,
    }),
    'about',
  )
  assert.equal(
    computeActiveSection({ ...base, offsets: [], scrollTop: 0 }),
    null,
  )
})

test('easeInOutExpo', () => {
  assert.equal(easeInOutExpo(0), 0)
  assert.equal(easeInOutExpo(1), 1)
  assert.equal(easeInOutExpo(0.5), 0.5)
  assert.ok(easeInOutExpo(0.25) < 0.25 && easeInOutExpo(0.75) > 0.75)
})
