'use client'

import { type MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { type SectionId, sections } from '@/data/sections'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { useSmoothScroll } from '@/hooks/use-smooth-scroll'
import type { Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

import { LanguageSwitcher } from './language-switcher'
import { MenuToggle } from './menu-toggle'

const sectionIds = sections.map(({ id }) => id)
const menuId = 'navbarSupportedContent'

/**
 * `#sideNav`: fixed sidebar from 992 px, collapsible top navbar below it.
 */
export function Sidebar({ locale }: { locale: Locale }) {
  const { t } = useTranslation()
  const active = useScrollSpy(sectionIds)
  const scrollTo = useSmoothScroll()
  const [open, setOpen] = useState(false)

  function handleNavigate(
    event: MouseEvent<HTMLAnchorElement>,
    id: SectionId | null,
  ) {
    event.preventDefault()
    scrollTo(id)
    setOpen(false)
  }

  const showLogo = active !== null && active !== 'start'

  return (
    <nav
      id="sideNav"
      className="fixed inset-x-0 top-0 z-[1030] flex flex-wrap items-center justify-between bg-primary px-4 py-2 lg:h-screen lg:w-sidebar lg:flex-col lg:flex-nowrap lg:justify-start lg:text-center"
    >
      <LanguageSwitcher locale={locale} active={active} />

      <a
        href="#top"
        onClick={(event) => handleNavigate(event, null)}
        className="mr-4 inline-block py-[0.3125rem] text-[1.25rem] whitespace-nowrap text-white no-underline lg:mx-auto lg:mt-auto lg:mb-0 lg:flex lg:p-2"
      >
        <span className="block lg:hidden">{t('sidebar.name')}</span>
        <span className="hidden lg:block">
          <img
            src="/img/profile.png"
            alt="Profile image"
            className="mx-auto mb-2 block h-auto max-h-40 max-w-40 rounded-full border-[0.5rem] border-[rgba(52,58,64,0.2)]"
          />
        </span>
      </a>

      <MenuToggle
        open={open}
        controls={menuId}
        onToggle={() => setOpen((value) => !value)}
      />

      {/* Bootstrap `.collapse`: height animation (.35s ease) below 992 px. */}
      <div
        id={menuId}
        className={cn(
          'grid grow basis-full transition-[grid-template-rows,visibility] duration-[350ms] ease-[ease] motion-reduce:transition-none',
          open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]',
          'lg:visible lg:mb-auto lg:flex lg:w-full lg:grow-0 lg:basis-auto lg:items-start lg:transition-none',
        )}
      >
        <div className="min-h-0 overflow-hidden lg:w-full lg:overflow-visible">
          <ul className="flex flex-col">
            {sections.map(({ id, labelKey }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? 'location' : undefined}
                  onClick={(event) => handleNavigate(event, id)}
                  className={cn(
                    'block py-2 tracking-[0.05rem] no-underline lg:px-2',
                    active === id
                      ? 'font-extrabold text-white'
                      : 'font-normal text-gray-800 hover:text-gray-300',
                  )}
                >
                  {t(labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="block h-[100px] w-full [@media(max-width:992px)]:hidden">
        <img
          src="/img/logos/logo-kalvaitir-sidebar.png"
          alt="Kalvaitir logo"
          width={500}
          height={200}
          className={cn('h-auto max-w-full', showLogo ? 'block' : 'hidden')}
        />
      </div>
    </nav>
  )
}
