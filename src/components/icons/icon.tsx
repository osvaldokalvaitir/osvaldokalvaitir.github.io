import type { IconDef } from '@/data/types'
import { cn } from '@/lib/utils'

type IconProps = { def: IconDef; className?: string }

/** Renders an icon like a Font Awesome glyph: 1em tall, current text color. */
export function Icon({ def, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={def.viewBox}
      aria-hidden="true"
      focusable="false"
      className={cn(
        'inline-block h-[1em] w-auto overflow-visible fill-current align-[-0.125em]',
        className,
      )}
    >
      <path d={def.path} />
    </svg>
  )
}
