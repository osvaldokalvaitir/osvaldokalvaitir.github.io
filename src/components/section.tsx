import type { ReactNode } from 'react'

import type { SectionId } from '@/data/sections'
import { cn } from '@/lib/utils'

type SectionProps = {
  id: SectionId
  /** `center` centers the content vertically; `start` keeps it at the top. */
  align?: 'center' | 'start'
  divider?: boolean
  children: ReactNode
}

export function Section({
  id,
  align = 'center',
  divider = true,
  children,
}: SectionProps) {
  return (
    <>
      <section
        id={id}
        className={cn(
          'flex px-4 py-20 md:min-h-screen lg:p-12',
          align === 'center' ? 'items-center' : 'justify-center',
        )}
      >
        <div className="w-full">{children}</div>
      </section>
      {divider && <hr className="m-0" />}
    </>
  )
}
