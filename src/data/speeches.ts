import type { SpeechItem } from './types.ts'

const fdd = {
  logo: '/img/logos-companies/fdd.png',
  logoAlt: 'FDD logo',
  url: 'http://www.firebirddevelopersday.com.br/',
}

const conince = {
  logo: '/img/logos-companies/conince.png',
  logoAlt: 'Conince logo',
  url: 'https://www.eduvaleavare.com.br/conince/',
}

const eduvale = {
  logo: '/img/logos-companies/fatec_eduvale.png',
  logoAlt: 'Fatec Eduvale logo',
  url: 'https://www.eduvaleavare.com.br/',
}

/** `speech-1` … `speech-<count>` */
function numbered(count: number) {
  return Array.from({ length: count }, (_, i) => `speech-${i + 1}`)
}

const period = ['period']

export const speeches: readonly SpeechItem[] = [
  { id: 'fdd-16', ...fdd, speeches: numbered(6), periods: period },
  { id: 'fdd-11', ...fdd, speeches: numbered(6), periods: period },
  {
    id: 'delphi-tour',
    logo: '/img/logos-companies/embarcadero.png',
    logoAlt: 'Embarcadero logo',
    url: 'https://www.embarcadero.com/br/',
    speeches: ['speech'],
    periods: period,
  },
  {
    id: 'mdl-sap-consulting',
    logo: '/img/logos-companies/sap.png',
    logoAlt: 'SAP logo',
    url: 'https://www.sap.com/brazil/',
    speeches: ['speech'],
    periods: period,
  },
  { id: 'fdd-8', ...fdd, speeches: numbered(5), periods: period },
  { id: 'conince-4', ...conince, speeches: numbered(3), periods: period },
  { id: 'it-week-2', ...eduvale, speeches: numbered(4), periods: period },
  { id: 'conince-3', ...conince, speeches: numbered(4), periods: period },
  {
    id: 'it-week-1',
    ...eduvale,
    speeches: numbered(5),
    periods: ['period', 'period-2'],
  },
  { id: 'conince-2', ...conince, speeches: [], periods: period },
  {
    id: 'enread-9',
    logo: '/img/logos-companies/sebrae.png',
    logoAlt: 'SEBRAE logo',
    url: 'https://www.sebrae.com.br/sites/PortalSebrae/',
    speeches: ['speech'],
    periods: period,
  },
]
