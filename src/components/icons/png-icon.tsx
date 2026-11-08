import { cn } from '@/lib/utils'

type PngIconProps = { name: string; className?: string }

/** 45×45 sprite from `/img/icons/<name>.png`: gray on top, colored below. */
export function PngIcon({ name, className }: PngIconProps) {
  return (
    <span
      className={cn(
        'inline-block size-[45px] bg-[position:0_0] bg-no-repeat hover:bg-[position:0_-45px]',
        className,
      )}
      style={{ backgroundImage: `url(/img/icons/${name}.png)` }}
    />
  )
}
