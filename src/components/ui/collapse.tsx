'use client'

import { type ReactNode, useId, useState } from 'react'

import { cn } from '@/lib/utils'

type CollapseProps = { label: string; children: ReactNode }

/**
 * Bootstrap 4 `.collapse` toggled by a `.text.sublink` trigger. The height
 * transition (.35s ease, like `.collapsing`) animates `grid-template-rows`
 * from `0fr` to `1fr`; `invisible` hides the content from assistive
 * technology once it is closed.
 */
export function Collapse({ label, children }: CollapseProps) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="block w-full cursor-pointer text-left text-gray-600 hover:underline"
      >
        {label}
      </button>
      <div
        id={id}
        className={cn(
          'grid transition-[grid-template-rows,visibility] duration-[350ms] ease-[ease] motion-reduce:transition-none',
          open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]',
        )}
      >
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>
    </>
  )
}
