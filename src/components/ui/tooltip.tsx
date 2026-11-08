'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import {
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

/** Dispatched when a tooltip opens on touch, so the others close. */
const TOUCH_OPEN_EVENT = 'kalvaitir:tooltip-touch-open'

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

/**
 * Bootstrap 4 tooltip (`data-placement="bottom"`) on top of Radix.
 *
 * Radix ignores touch, so a tap toggles the tooltip here (Bootstrap showed it
 * on tap); tapping elsewhere closes it (Radix outside-pointer dismiss) and
 * only one is open at a time. Mouse hover and keyboard focus are Radix's.
 */
export function Tooltip({ content, children }: TooltipProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const touchedRef = useRef(false)

  useEffect(() => {
    if (!open) return
    function handleTouchOpen(event: Event) {
      if ((event as CustomEvent<string>).detail !== id) setOpen(false)
    }
    document.addEventListener(TOUCH_OPEN_EVENT, handleTouchOpen)
    return () => document.removeEventListener(TOUCH_OPEN_EVENT, handleTouchOpen)
  }, [open, id])

  function handlePointerDown(event: PointerEvent) {
    touchedRef.current = event.pointerType === 'touch'
    if (!touchedRef.current) return
    if (!open) {
      document.dispatchEvent(new CustomEvent(TOUCH_OPEN_EVENT, { detail: id }))
    }
    setOpen(!open)
  }

  return (
    <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
      <TooltipPrimitive.Trigger
        asChild
        aria-label={content}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        // A touch pointer "leaves" when lifted and the tap ends in a click;
        // Radix closes on both, so skip it to keep the tapped tooltip open.
        onPointerLeave={(event) => {
          if (event.pointerType === 'touch') event.preventDefault()
        }}
        onClick={(event) => {
          if (touchedRef.current) event.preventDefault()
        }}
      >
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
