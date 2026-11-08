'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ReactElement, ReactNode } from 'react'

/**
 * Bootstrap defaults: tooltips open without delay and close as soon as the
 * pointer leaves the trigger (the tooltip itself is not hoverable).
 */
export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={0}
      skipDelayDuration={0}
      disableHoverableContent
    >
      {children}
    </TooltipPrimitive.Provider>
  )
}

type TooltipProps = { content: string; children: ReactElement }

/** Bootstrap 4 tooltip (`data-placement="bottom"`) on top of Radix. */
export function Tooltip({ content, children }: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild aria-label={content}>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="bottom"
          sideOffset={0}
          // Popper.js preventOverflow padding used by Bootstrap 4
          collisionPadding={5}
          className="z-[1070] max-w-[200px] animate-in rounded-[0.25rem] bg-black px-2 py-1 text-center font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,'Noto_Sans','Liberation_Sans',sans-serif,'Apple_Color_Emoji','Segoe_UI_Emoji','Segoe_UI_Symbol','Noto_Color_Emoji'] text-[0.875rem] leading-normal font-normal break-words text-white opacity-90 duration-150 ease-linear fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        >
          {content}
          <TooltipPrimitive.Arrow
            width={12.8}
            height={6.4}
            className="fill-black"
          />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
