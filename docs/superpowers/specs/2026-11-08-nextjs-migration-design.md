# Migração do site pessoal para Next.js — Design

Data: 2026-11-08
Branch: `feat/nextjs-migration`

## Objetivo

Migrar o site pessoal (`kalvaitir.com`), hoje feito com Bootstrap 4.6 + jQuery + i18next via CDN + Gulp/SCSS, para React + Next.js + Tailwind CSS + Radix UI, com internacionalização (PT-BR/EN), **mantendo o design visualmente idêntico** ao atual.

### Critérios de sucesso

1. Visual idêntico ao site atual em todas as larguras (1920, 1280, 1024, 800, 390 px), incluindo estados: modal aberto, collapse aberto, tooltip, menu mobile aberto e versão em inglês.
2. Mesmo comportamento: scrollspy na sidebar, rolagem suave (1000 ms, `easeInOutExpo`), logo da sidebar visível somente fora da seção "Início", tooltips nos ícones, modais de grade curricular, collapses de "Todos os cursos".
3. Conteúdo inalterado (mesmos textos, chaves de tradução e imagens).
4. `npm run lint`, `npm run typecheck` e `npm run build` sem erros.
5. Deploy estático no GitHub Pages via GitHub Actions, no domínio `kalvaitir.com`.

### Decisões do usuário

| Tema | Decisão |
|---|---|
| Hospedagem | Continua no GitHub Pages (export estático + GitHub Actions) |
| Idioma na URL | Rotas por idioma: `/pt-br` e `/en` |
| Raiz `/` | Sempre redireciona para `/pt-br` |
| Ícones | Idênticos aos atuais: SVGs do Font Awesome/Devicon extraídos como componentes React locais |
| Abordagem de estilo | Tailwind v4 com os valores do Bootstrap 4 como tokens |
| README | Atualizar apenas tecnologias e forma de instalação/execução; o resto permanece. Sem aviso sobre configuração do Pages |

### Correções incluídas

- O collapse "Todos os cursos" do CEBRAC hoje abre a lista da TreinaWeb (ambos usam `id="collapseTreinaWebCourses"`). No novo site cada escola tem estado próprio.

## Arquitetura

### Build e deploy

- Next.js 16 (App Router), `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true` (gera `pt-br/index.html`, compatível com GitHub Pages).
- `public/` contém `img/` (mesmos caminhos atuais), `CNAME` (`kalvaitir.com`) e o manifest.
- Workflow `.github/workflows/deploy.yml`: em push na `main` → `npm ci` → `npm run lint` → `npm run typecheck` → `npm run build` → `actions/upload-pages-artifact` (`out/`) → `actions/deploy-pages`.
- Removidos: Gulp, SCSS, `vendor/`, `sections/`, `main.js`, `js/`, `css/`, `.travis.yml`, `.browserslistrc`.

### Rotas

```
src/app/
  (redirect)/layout.tsx   → layout raiz mínimo (<html lang="pt-BR">)
  (redirect)/page.tsx     → "/" → redirect('/pt-br') (meta refresh no HTML estático)
  [locale]/layout.tsx     → layout raiz por idioma: <html lang>, fontes, metadata, providers
  [locale]/page.tsx       → página única com as 9 seções
```

- `generateStaticParams` → `[{ locale: 'pt-br' }, { locale: 'en' }]`; `dynamicParams = false`.
- Metadata por idioma: `title` "Osvaldo Kalvaitir Filho", `description`, `alternates.languages` (`pt-BR` → `/pt-br`, `en` → `/en`), `themeColor` `#28A745`, ícones (`favicon.ico`, `logo-kalvaitir-end.png`), `appleWebApp` (capable, title "Kalvaitir", status bar `black-translucent`), manifest.

### i18n

- `i18next` + `react-i18next`, recursos empacotados no build (import dos JSON), sem fetch em runtime.
- Arquivos: `src/locales/pt-BR.json` e `src/locales/en.json` (conteúdo e chaves idênticos aos atuais `locales/ptBR` e `locales/enEN`).
- Mapeamento de rota → idioma i18next: `pt-br` → `pt-BR`, `en` → `en`.
- `src/i18n/config.ts`: lista de locales, default `pt-br`, type guard `isLocale`.
- `src/i18n/get-t.ts`: cria instância i18next por idioma para componentes de servidor e retorna `t`.
- `src/i18n/provider.tsx`: `I18nextProvider` cliente para os componentes interativos.
- Bandeiras: links para `/pt-br` e `/en`, preservando o hash atual (ex.: `/en#skills`). Mesmo visual dos botões atuais (`.btn` com imagens 40×28 arredondadas).

### Estrutura de código

```
src/
  app/                      rotas (acima)
  components/
    sidebar/                sidebar.tsx (cliente), language-switcher.tsx
    sections/               start, about, experience, education, skills, interests, courses, speeches, thanks
    resume-item.tsx         bloco reutilizável (logo 70px + conteúdo + período)
    section.tsx             wrapper <section> + <hr>
    ui/                     dialog.tsx, tooltip.tsx, collapse.tsx, button.tsx
    icons/                  componentes SVG (Font Awesome / Devicon) + PngIcon (sprite)
  data/                     experience.ts, education.ts, skills.ts, courses.ts, speeches.ts, social.ts
  hooks/                    use-scroll-spy.ts, use-smooth-scroll.ts
  i18n/                     config.ts, get-t.ts, provider.tsx
  lib/utils.ts              cn() = twMerge(clsx())
  locales/                  pt-BR.json, en.json
  styles/globals.css        Tailwind + tokens + base
```

Os dados (`data/*.ts`) são tipados e referenciam chaves de tradução, logos, links e itens de grade curricular/cursos, de modo que as seções renderizam listas em vez de HTML repetido.

## Componentes e interações

### Sidebar / navbar (cliente)

- **Desktop (≥ 992 px):** `fixed`, topo/esquerda, largura `17rem`, altura `100vh`, fundo `#28a745`, `flex-col`, `text-center`, `align-items: center`, padding `.5rem 1rem`.
  - Bandeiras no topo.
  - Brand com `margin: auto auto 0`, padding `.5rem`; foto `profile.png` circular, `max-width/height: 10rem`, borda `.5rem solid rgba(52,58,64,.2)`, `mb-2`.
  - Links (`margin-bottom: auto`, largura 100%): display block, padding `.5rem`, cor `#343a40`, peso 400, `letter-spacing .05rem`; hover `#dee2e6`; ativo branco peso 800; sem sublinhado.
  - Área do logo: altura 100 px; `logo-kalvaitir-sidebar.png` visível somente quando a seção ativa não é "start".
- **Mobile (< 992 px):** barra `fixed` no topo, `flex-wrap`, `justify-between`, `align-items-center`, padding `.5rem 1rem`: bandeiras | nome "Osvaldo Kalvaitir" (texto branco 1.25rem) | botão hambúrguer (borda `rgba(255,255,255,.1)`, ícone de 3 linhas `rgba(255,255,255,.5)`, `aria-label="Toggle navigation"`). Menu colapsável (animação de altura .35 s ease), links alinhados à esquerda com padding `.5rem 0`. Clique em link fecha o menu. Área do logo oculta.
- Clique na brand rola ao topo.

### Scrollspy (`use-scroll-spy`)

Algoritmo do Bootstrap 4: `scrollTop = window.scrollY + 10`; ativa a última seção cujo topo (posição absoluta) ≤ `scrollTop`; se `scrollTop` ≥ altura máxima rolável, ativa a última; se acima da primeira seção, nenhuma ativa. Recalcula em `scroll` e `resize`.

### Rolagem suave (`use-smooth-scroll`)

Anima `window.scrollTo` com `requestAnimationFrame`, 1000 ms, `easeInOutExpo`, até o topo absoluto da seção; atualiza o hash via `history.replaceState`. Com `prefers-reduced-motion: reduce`, salta direto.

### Modal "Grade Curricular" (Radix Dialog)

- Botão de abertura no estilo `button.dark`: borda 1px `#28a745`, texto `#ced4da`, padding `.375rem .75rem`, raio `.25rem`, margem direita/inferior 15px; hover fundo `#28a745` e texto `#212529`; focus `box-shadow: 2px 2px #28a745`.
- Overlay preto 50 % (fade .15 s). Conteúdo: largura 800 px (≥ 992), 500 px (≥ 576), margem `.5rem` abaixo; centralizado verticalmente; fundo `#212529`; borda `1px solid rgba(0,0,0,.2)`; raio `.3rem`; entrada com `translateY(-50px) → 0` em .3 s ease-out.
- Header: padding 1rem, borda inferior `#dee2e6`, título h3 (Saira, 2rem, `#adb5bd`, uppercase, `line-height 1.5`), botão × (1.5rem, peso 700, preto, `text-shadow 0 1px 0 #fff`, opacidade .5 → .75 no hover).
- Body: padding 1rem; pares subheading + texto separados por `<br>`.
- Footer: padding .75rem, borda superior `#dee2e6`, botão "Fechar" estilo `btn-secondary` (`#6c757d`, hover `#5a6268`).

### Collapse "Todos os cursos" (cliente)

Gatilho `<button>` com aparência de texto (`.text` cinza `#868e96`, cursor pointer, sublinhado no hover), `aria-expanded`/`aria-controls`. Conteúdo expande/recolhe com transição de altura .35 s ease. Estado independente por escola.

### Tooltip (Radix Tooltip)

`TooltipProvider` único; lado `bottom`, offset que reproduz o Bootstrap; fundo preto, texto branco `.875rem`, padding `.25rem .5rem`, raio `.25rem`, seta preta; fade.

### Seções

- `Section`: `<section id>` com `p-4`/`lg:p-12` horizontal, padding vertical `5rem` (< 992) / `3rem` (≥ 992), `min-height: 100vh` (≥ 768), `flex items-center` (Experience: `justify-center`, conteúdo no topo, como hoje); seguido de `<hr class="m-0">` (exceto Thanks).
- `ResumeItem`: `flex-col md:flex-row justify-between mb-12`; logo 70×70 circular com padding `.25rem`, fundo branco e borda `#dee2e6`, `mb-2`; conteúdo com `margin-left 20px`; período à direita (`md:text-right`, `min-width 18rem` em ≥ 768) em `#28a745`.
- **Start:** `logo-kalvaitir-start.png` centralizado.
- **About:** h1 nome + sobrenome verde; subheading profissão · endereço (link Google Maps); dois `p.lead` (1.15rem, `#dee2e6`); ícones sociais 3.5rem circulares `#495057` → `#28a745` no hover (e-mail, LinkedIn, GitHub, Rocketseat, Facebook, Instagram).
- **Experience, Education, Courses, Speeches:** listas de `ResumeItem` a partir de `data/*`.
- **Skills:** "Hard Skills" (lista inline de ícones 3rem `#495057`, hover verde; PNGs 45×45 com sprite e `margin-bottom 18px`), "Soft Skills" (lista com check, `margin-left 2.5em`, itens `#868e96` com `margin-bottom 15px`).
- **Interests / Thanks:** parágrafos `#868e96`; Thanks com logo final 100×100 (margem superior 200 px, inferior 30 px), copyright verde e direitos `#ced4da`.

### Ícones

- `components/icons/`: SVGs extraídos do Font Awesome Free 6 (licença CC BY 4.0, atribuição em comentário) e do Devicon (MIT) apenas para os ícones usados, renderizados com `1em` de altura e `fill="currentColor"`, alinhados como os glifos de fonte atuais.
- Ícones genéricos também mantêm o visual atual: check e × do Font Awesome; o hambúrguer usa o mesmo SVG do Bootstrap 4 (3 linhas, `rgba(255,255,255,.5)`, stroke 2, viewBox 30×30).
- `PngIcon`: `<span>` 45×45 com `background: url(/img/icons/<nome>.png) 0 0`, hover `0 -45px`.

## Estilo

`src/styles/globals.css` (Tailwind v4):

- `@import "tailwindcss"` + `@import "tw-animate-css"`.
- `@theme`: cores (`primary #28a745`, `gray-100 #f8f9fa`, `gray-200 #e9ecef`, `gray-300 #dee2e6`, `gray-400 #ced4da`, `gray-500 #adb5bd`, `gray-600 #868e96`, `gray-700 #495057`, `gray-800 #343a40`, `gray-900 #212529`, `link-hover #606870`), breakpoints (`sm 576px`, `md 768px`, `lg 992px`, `xl 1200px`), fontes (`--font-body`, `--font-heading`), `--spacing-sidebar: 17rem`.
- `@layer base`: reboot essencial do Bootstrap 4 (font-size 16px, `line-height 1.5`, margens de `p` e headings, `hr` com `border-top 1px rgba(0,0,0,.1)`, links `#868e96` com sublinhado no hover, `img` `vertical-align: middle`), body (`#212529`, branco, padding-top 54px / padding-left 17rem em ≥ 992), headings (Saira, 700, uppercase; h1 6rem/5.5rem; h2 3.5rem `#e9ecef`; h3 2rem `#adb5bd`), fundo do container (`background.png` 375px canto superior direito; 300px ≤ 1500px; nenhum ≤ 767px), scrollbar verde (`#28a745` sobre `#343a40`, 12px, raio 10px).
- Fontes via `next/font/google`: Mulish (400, 800, normal e itálico; substituta oficial de "Muli") e Saira Extra Condensed (500, 700).

## Ferramentas de desenvolvimento

- **Runtime:** `next`, `react`, `react-dom`, `@radix-ui/react-dialog`, `@radix-ui/react-tooltip`, `clsx`, `tailwind-merge`, `tw-animate-css`, `i18next`, `react-i18next`. Demais pacotes da lista do usuário (incluindo `lucide-react`, `simple-icons` e `cookies-next`) não são instalados por não terem uso; os que já entraram no `package.json` durante a tentativa inicial são removidos.
- **Dev:** `@eslint/eslintrc`, `@rocketseat/eslint-config`, `@tailwindcss/postcss`, `@types/node`, `@types/react`, `@types/react-dom`, `eslint`, `eslint-config-next`, `eslint-plugin-simple-import-sort`, `prettier`, `prettier-plugin-tailwindcss`, `tailwindcss`, `typescript`.
- `eslint.config.mjs` (flat): `FlatCompat` para `@rocketseat/eslint-config/next` + `next/core-web-vitals` + `next/typescript`; regra `simple-import-sort/imports: error`; ignora `out/`, `.next/`.
- `prettier.config.mjs` com `prettier-plugin-tailwindcss` (estilo Rocketseat: sem ponto e vírgula, aspas simples).
- `tsconfig.json` strict, alias `@/*` → `src/*`.
- Scripts: `dev`, `build`, `preview` (serve `out/`), `lint`, `lint:fix`, `format`, `typecheck`.

## Validação

1. `npm run lint` e `npm run typecheck` sem erros.
2. `npm run build` gera `out/index.html` (redirect), `out/pt-br/index.html` e `out/en/index.html`.
3. Comparação visual: script de screenshots (fora do repositório) roda no site novo com os mesmos cenários do baseline do site antigo (5 larguras × 9 seções + fim da página, tooltip, collapse, modal, inglês, menu mobile); diferenças são ajustadas até ficar igual. Diferenças aceitas: correção do bug CEBRAC e eventuais diferenças sub-pixel de renderização de fonte.
4. Verificação manual: scrollspy, rolagem suave, troca de idioma preservando âncora, redirect de `/`, Esc/clique fora fecha modal.

## README

Atualizar apenas: a linha de tecnologias ("Personal website using Bootstrap, Gulp and jQuery" → Next.js, React, Tailwind CSS…) e a seção "Install and run" (requisito Node.js, comandos `npm install` / `npm run dev`). Todo o resto permanece como está.

## Fora de escopo

- Mudanças de conteúdo ou de design.
- Testes automatizados de UI no repositório.
- Tema claro/escuro, analytics, formulários.
