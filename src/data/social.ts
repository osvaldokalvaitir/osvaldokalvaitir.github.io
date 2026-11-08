import {
  envelope,
  facebookF,
  github,
  instagram,
  linkedinIn,
  rocket,
} from '../components/icons/brand-icons.ts'
import type { SocialLink } from './types.ts'

export const social: readonly SocialLink[] = [
  {
    href: 'mailto:osvaldokalvaitir@outlook.com',
    label: 'E-mail',
    icon: envelope,
  },
  {
    href: 'https://www.linkedin.com/in/osvaldokalvaitir/',
    label: 'LinkedIn',
    icon: linkedinIn,
  },
  {
    href: 'https://github.com/osvaldokalvaitir',
    label: 'GitHub',
    icon: github,
  },
  {
    href: 'https://app.rocketseat.com.br/me/osvaldokalvaitir',
    label: 'Rocketseat',
    icon: rocket,
  },
  {
    href: 'https://www.facebook.com/osvaldokalvaitir',
    label: 'Facebook',
    icon: facebookF,
  },
  {
    href: 'https://www.instagram.com/osvaldokalvaitir/',
    label: 'Instagram',
    icon: instagram,
  },
]
