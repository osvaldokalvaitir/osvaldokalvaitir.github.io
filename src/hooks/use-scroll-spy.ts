'use client'

import { useCallback, useSyncExternalStore } from 'react'

import { computeActiveSection } from '@/lib/scroll'

function subscribe(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true })
  window.addEventListener('resize', onChange)
  return () => {
    window.removeEventListener('scroll', onChange)
    window.removeEventListener('resize', onChange)
  }
}

const getServerSnapshot = () => null

/**
 * Bootstrap 4 ScrollSpy (offset 10) over the sections with the given ids.
 * Reads the layout on mount (deep links), on `scroll` and on `resize`.
 */
export function useScrollSpy(ids: readonly string[]): string | null {
  const getSnapshot = useCallback(() => {
    const offsets = ids.flatMap((id) => {
      const element = document.getElementById(id)
      if (!element) return []
      return [{ id, top: element.getBoundingClientRect().top + window.scrollY }]
    })

    return computeActiveSection({
      scrollTop: window.scrollY,
      scrollHeight: Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      ),
      viewportHeight: window.innerHeight,
      offsets,
    })
  }, [ids])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
