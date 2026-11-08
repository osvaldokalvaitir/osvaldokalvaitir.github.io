import {
  faEnvelope,
  faFacebookF,
  faGithub,
  faInstagram,
  faLinkedinIn,
  faRocket,
} from '../components/icons/brand-icons.ts'
import type { SocialLink } from './types.ts'

export const social: readonly SocialLink[] = [
  {
    href: 'mailto:osvaldokalvaitir@outlook.com',
    label: 'E-mail',
    icon: faEnvelope,
  },
  {
    href: 'https://www.linkedin.com/in/osvaldokalvaitir/',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  {
    href: 'https://github.com/osvaldokalvaitir',
    label: 'GitHub',
    icon: faGithub,
  },
  {
    href: 'https://app.rocketseat.com.br/me/osvaldokalvaitir',
    label: 'Rocketseat',
    icon: faRocket,
  },
  {
    href: 'https://www.facebook.com/osvaldokalvaitir',
    label: 'Facebook',
    icon: faFacebookF,
  },
  {
    href: 'https://www.instagram.com/osvaldokalvaitir/',
    label: 'Instagram',
    icon: faInstagram,
  },
]
