export type IconDef = { viewBox: string; path: string }

export type SocialLink = { href: string; label: string; icon: IconDef }

/** Translation keys: `experience.<id>.office|company|functions|period`. */
export type ExperienceItem = {
  id: string
  logo: string
  logoAlt: string
  url: string
}

/** `png` is a sprite in `/img/icons/` (file name without extension). */
export type HardSkill = { name: string } & ({ icon: IconDef } | { png: string })
