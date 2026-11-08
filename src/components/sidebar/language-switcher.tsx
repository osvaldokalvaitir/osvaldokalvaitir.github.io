'use client'

import { Fragment, type MouseEvent } from 'react'

import { languageHref, type Locale, locales, toI18nLang } from '@/i18n/config'

const flags: Record<Locale, { src: string; alt: string }> = {
  'pt-br': { src: '/img/flags/br.png', alt: 'Português' },
  en: { src: '/img/flags/us.png', alt: 'English' },
}

type LanguageSwitcherProps = {
  locale: Locale
  /** Section the visitor is in (scroll spy), kept in the other language. */
  active: string | null
}

/**
 * Flag links (Bootstrap 4 `.btn` look). The href carries the active section,
 * so the other language opens at the same place (also on middle-click or
 * "copy link"); without one, the current hash is read at click time.
 */
export function LanguageSwitcher({ locale, active }: LanguageSwitcherProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>, target: Locale) {
    if (target === locale) {
      event.preventDefault()
      return
    }
    event.currentTarget.href = languageHref(
      target,
      active,
      window.location.hash,
    )
  }

  return (
    <div>
      {locales.map((target, index) => (
        <Fragment key={target}>
          {index > 0 && ' '}
          <a
            href={languageHref(target, active)}
            hrefLang={toI18nLang(target)}
            aria-current={target === locale ? 'page' : undefined}
            onClick={(event) => handleClick(event, target)}
            className="inline-block rounded-[0.25rem] border border-transparent px-3 py-1.5 align-middle leading-normal no-underline transition-shadow duration-150 ease-in-out select-none focus:shadow-[0_0_0_0.2rem_rgba(0,123,255,0.25)] focus:outline-0 motion-reduce:transition-none"
          >
            <img
              src={flags[target].src}
              alt={flags[target].alt}
              width={40}
              height={28}
              className="h-7 w-10 rounded-[0.25rem]"
            />
          </a>
        </Fragment>
      ))}
    </div>
  )
}
