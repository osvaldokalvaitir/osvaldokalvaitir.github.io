import type { TFunction } from 'i18next'
import { Fragment } from 'react'

import { Icon } from '@/components/icons/icon'
import { Section } from '@/components/section'
import { social } from '@/data/social'

export function About({ t }: { t: TFunction }) {
  return (
    <Section id="about">
      <h1 className="mb-0">
        <span>{t('about.name')}</span>{' '}
        <span className="text-primary">{t('about.surname')}</span>
      </h1>
      <div className="mb-12 subheading">
        <span>{t('about.profession')}</span> ·{' '}
        <a
          href="https://www.google.com/maps/place/Avaré,+SP"
          target="_blank"
          rel="noreferrer"
        >
          {t('about.address')}
        </a>
      </div>
      <p className="mb-4 text-[1.15rem] font-normal text-gray-300">
        {t('about.description')}
      </p>
      <p className="mb-12 text-[1.15rem] font-normal text-gray-300">
        {t('about.description-2')}
      </p>
      <div>
        {/* Whitespace between the inline-block links is part of the spacing. */}
        {social.map(({ href, label, icon }) => (
          <Fragment key={href}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="mr-4 mb-4 inline-block size-14 rounded-full bg-gray-700 text-center text-2xl leading-14 text-white! last:mr-0 hover:bg-primary"
            >
              <Icon def={icon} />
            </a>{' '}
          </Fragment>
        ))}
      </div>
    </Section>
  )
}
