export type SectionOffset = { id: string; top: number }

export type ActiveSectionInput = {
  /** `window.scrollY` */
  scrollTop: number
  /** Total scrollable height of the document. */
  scrollHeight: number
  /** `window.innerHeight` */
  viewportHeight: number
  /** Absolute top of each section. */
  offsets: readonly SectionOffset[]
  /** Bootstrap ScrollSpy `offset` option (default 10). */
  offset?: number
}

/**
 * Bootstrap 4 ScrollSpy `_process`: the active section is the last one whose
 * top is at or above `scrollTop + offset`; at the end of the page the last
 * section wins; above the first section nothing is active.
 */
export function computeActiveSection({
  scrollTop,
  scrollHeight,
  viewportHeight,
  offsets,
  offset = 10,
}: ActiveSectionInput): string | null {
  if (offsets.length === 0) return null

  const sorted = [...offsets].sort((a, b) => a.top - b.top)
  const position = scrollTop + offset
  const maxScroll = offset + scrollHeight - viewportHeight

  if (position >= maxScroll) return sorted[sorted.length - 1].id
  if (position < sorted[0].top) return null

  let active = sorted[0].id
  for (const { id, top } of sorted) {
    if (position >= top) active = id
  }
  return active
}

/** jQuery Easing `easeInOutExpo`, normalized to t ∈ [0, 1]. */
export function easeInOutExpo(t: number): number {
  if (t === 0) return 0
  if (t === 1) return 1
  return t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2
}
