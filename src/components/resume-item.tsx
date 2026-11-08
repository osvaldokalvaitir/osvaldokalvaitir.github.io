import type { ReactNode } from 'react'

type ResumeItemProps = {
  logo: string
  logoAlt: string
  period: ReactNode
  children: ReactNode
}

export function ResumeItem({
  logo,
  logoAlt,
  period,
  children,
}: ResumeItemProps) {
  return (
    <div className="mb-12 flex flex-col justify-between md:flex-row">
      <div className="flex flex-row">
        <img
          src={logo}
          alt={logoAlt}
          className="mb-2 size-[70px] max-w-full rounded-full border border-gray-300 bg-white p-1"
        />
        <div className="ml-5">{children}</div>
      </div>
      <div className="md:min-w-72 md:text-right">
        <span className="text-primary">{period}</span>
      </div>
    </div>
  )
}
