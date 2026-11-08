'use client'

import { useCallback, useEffect, useRef } from 'react'

import { easeInOutExpo } from '@/lib/scroll'

const DURATION = 1000

/**
 * jQuery `$('html, body').animate({ scrollTop }, 1000, 'easeInOutExpo')` to
 * the absolute top of a section (`null` scrolls to the top of the page).
 * The hash is updated with `history.replaceState`; with
 * `prefers-reduced-motion: reduce` the page jumps straight to the target.
 */
export function useSmoothScroll(): (id: string | null) => void {
  const frame = useRef<number | null>(null)

  const cancel = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
  }, [])

  useEffect(() => cancel, [cancel])

  return useCallback(
    (id: string | null) => {
      const element = id === null ? null : document.getElementById(id)
      if (id !== null && !element) return

      const target = element
        ? element.getBoundingClientRect().top + window.scrollY
        : 0
      const { pathname, search } = window.location
      window.history.replaceState(
        null,
        '',
        id === null ? `${pathname}${search}` : `#${id}`,
      )

      cancel()

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo({ top: target, behavior: 'instant' })
        return
      }

      const start = window.scrollY
      const distance = target - start
      const startTime = performance.now()

      const step = (now: number) => {
        const progress = Math.min((now - startTime) / DURATION, 1)
        window.scrollTo({
          top: start + distance * easeInOutExpo(progress),
          behavior: 'instant',
        })
        frame.current = progress < 1 ? requestAnimationFrame(step) : null
      }

      frame.current = requestAnimationFrame(step)
    },
    [cancel],
  )
}
