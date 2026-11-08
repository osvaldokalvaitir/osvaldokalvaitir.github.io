export type IconDef = { viewBox: string; path: string }

export type SocialLink = { href: string; label: string; icon: IconDef }

/** Translation keys: `experience.<id>.office|company|functions|period`. */
export type ExperienceItem = {
  id: string
  logo: string
  logoAlt: string
  url: string
}
