'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { type ReactNode, useRef } from 'react'

import { Button } from './button'

type CurriculumDialogProps = {
  title: string
  closeLabel: string
  trigger: string
  children: ReactNode
}

/**
 * Bootstrap 4 `.modal.fade` + `.modal-dialog-centered.modal-lg` on top of
 * Radix Dialog. The overlay is also the scroll container (like `.modal`), so a
 * dialog taller than the viewport scrolls inside it.
 */
export function CurriculumDialog({
  title,
  closeLabel,
  trigger,
  children,
}: CurriculumDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <Button variant="dark">{trigger}</Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[1050] overflow-x-hidden overflow-y-auto bg-black/50 outline-0 duration-150 ease-linear data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none">
          <div className="pointer-events-none relative m-2 flex min-h-[calc(100%-1rem)] w-auto items-center sm:mx-auto sm:my-7 sm:min-h-[calc(100%-3.5rem)] sm:max-w-[500px] lg:max-w-[800px]">
            <DialogPrimitive.Content
              ref={contentRef}
              aria-describedby={undefined}
              // Bootstrap focuses the modal itself, not its first button.
              onOpenAutoFocus={(event) => {
                event.preventDefault()
                contentRef.current?.focus()
              }}
              className="pointer-events-auto relative flex w-full flex-col rounded-[0.3rem] border border-black/20 bg-gray-900 bg-clip-padding outline-0 duration-300 ease-out data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-[50px] data-[state=open]:animate-in data-[state=open]:slide-in-from-top-[50px] motion-reduce:animate-none"
            >
              <div className="flex items-start justify-between rounded-t-[calc(0.3rem-1px)] border-b border-gray-300 p-4">
                <DialogPrimitive.Title asChild>
                  <h3 className="mb-0 leading-normal">{title}</h3>
                </DialogPrimitive.Title>
                <DialogPrimitive.Close
                  aria-label={closeLabel}
                  className="-my-4 -mr-4 ml-auto cursor-pointer border-0 bg-transparent p-4 text-[1.5rem] leading-none font-bold text-black opacity-50 [text-shadow:0_1px_0_#fff] hover:opacity-75 focus:opacity-75"
                >
                  <span aria-hidden="true">&times;</span>
                </DialogPrimitive.Close>
              </div>
              <div className="relative flex-auto p-4">{children}</div>
              <div className="flex flex-wrap items-center justify-end rounded-b-[calc(0.3rem-1px)] border-t border-gray-300 p-3 *:m-1">
                <DialogPrimitive.Close asChild>
                  <Button variant="secondary">{closeLabel}</Button>
                </DialogPrimitive.Close>
              </div>
            </DialogPrimitive.Content>
          </div>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
