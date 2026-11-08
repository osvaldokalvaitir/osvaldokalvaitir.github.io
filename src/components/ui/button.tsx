import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

/** Bootstrap 4 `.btn` base. */
const base =
  'inline-block cursor-pointer rounded-[0.25rem] border border-transparent bg-transparent px-3 py-1.5 text-center align-middle text-base leading-normal font-normal select-none transition-[color,background-color,border-color,box-shadow] duration-150 ease-in-out focus:outline-0 motion-reduce:transition-none'

const variants = {
  /** `button.btn.dark` from the original resume.css */
  dark: 'mr-[15px] mb-[15px] border-primary text-gray-400 hover:bg-primary hover:text-gray-900 focus:shadow-[2px_2px_#28a745]',
  /** Bootstrap 4 `.btn-secondary` */
  secondary:
    'border-[#6c757d] bg-[#6c757d] text-white hover:border-[#545b62] hover:bg-[#5a6268] focus:border-[#545b62] focus:bg-[#5a6268] focus:shadow-[0_0_0_0.2rem_rgba(130,138,145,0.5)] active:border-[#4e555b] active:bg-[#545b62]',
} as const

type ButtonProps = ComponentProps<'button'> & {
  variant: keyof typeof variants
}

export function Button({ variant, className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(base, variants[variant], className)}
      {...props}
    />
  )
}
