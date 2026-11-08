import { entry } from './curriculum.ts'
import type { EducationItem } from './types.ts'

export const education: readonly EducationItem[] = [
  {
    id: 'university',
    logo: '/img/logos-companies/unopar.png',
    logoAlt: 'Unopar logo',
    url: 'https://www.unopar.com.br/',
    curriculum: [
      'flash-animations',
      'visual-tools',
      'php-programming',
      'flex-programming',
      'html-Programming',
      'html-5-programming',
      'agile-projects',
      'systems-analysis',
      'database',
      'interface-design',
      'human-computer-interaction',
      'introduction-java-development',
      'development-java-web',
      'advanced-java-web-development',
      'asp-net-development',
    ].map((key) => entry(key)),
    trailingBreak: true,
  },
  {
    id: 'college',
    logo: '/img/logos-companies/fatec_eduvale.png',
    logoAlt: 'Eduvale logo',
    url: 'https://www.eduvaleavare.com.br/',
    curriculum: [
      'systems-programmer-module-1',
      'systems-programmer-module-2',
      'technologist-analysis-systems-development',
    ].map((key) => entry(key)),
  },
]
