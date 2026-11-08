'use client'

type MenuToggleProps = {
  open: boolean
  controls: string
  onToggle: () => void
}

/** Bootstrap 4 `.navbar-dark .navbar-toggler`, shown below 992 px. */
export function MenuToggle({ open, controls, onToggle }: MenuToggleProps) {
  return (
    <button
      type="button"
      aria-controls={controls}
      aria-expanded={open}
      aria-label="Toggle navigation"
      onClick={onToggle}
      className="cursor-pointer rounded-[0.25rem] border border-white/10 bg-transparent px-3 py-1 text-[1.25rem] leading-none text-white/50 focus:outline-[#48d368] lg:hidden"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 30 30"
        className="inline-block size-[1.5em] align-middle"
      >
        <path
          stroke="rgba(255, 255, 255, 0.5)"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="2"
          d="M4 7h22M4 15h22M4 23h22"
        />
      </svg>
    </button>
  )
}
