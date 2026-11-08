# Migração para Next.js — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescrever o site pessoal em Next.js 16 + React + Tailwind v4 + Radix, com rotas `/pt-br` e `/en`, visualmente idêntico ao site Bootstrap atual, publicado como export estático no GitHub Pages.

**Architecture:** App Router com `output: 'export'`; `[locale]` gera duas páginas estáticas e `/` redireciona para `/pt-br`. Seções são componentes de servidor que renderizam dados tipados de `src/data/*` traduzidos por `i18next`; sidebar, modal, collapse e tooltip são componentes de cliente. Lógica pura (scroll spy, easing, locales) fica em módulos sem dependências e é testada com `node --test`.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Tailwind CSS v4, Radix Dialog/Tooltip, i18next + react-i18next, ESLint 9 (flat) + Rocketseat config, Prettier.

**Spec:** `docs/superpowers/specs/2026-11-08-nextjs-migration-design.md` — leia a spec inteira antes de cada task; os valores de estilo (cores, tamanhos, espaçamentos) estão lá e não são repetidos aqui.

## Global Constraints

- Design idêntico ao site atual; referência visual = baseline de screenshots em `$SCRATCH/shots-old/` (gerado de `$SCRATCH/old-site/`, cópia do commit `a0e28d0`). `$SCRATCH` = `C:/Users/osval/AppData/Local/Temp/claude/dd8e197626b824b6/a4c63845-10a1-4502-872b-4293a478b6e3/scratchpad`.
- Conteúdo e chaves de tradução inalterados (`src/locales/pt-BR.json`, `src/locales/en.json` já movidos no working tree).
- Rotas: `/pt-br/` e `/en/` (com `trailingSlash: true`); `/` → `/pt-br/`. Links internos sempre com barra final.
- Runtime deps permitidas: `next`, `react`, `react-dom`, `@radix-ui/react-dialog`, `@radix-ui/react-tooltip`, `clsx`, `tailwind-merge`, `tw-animate-css`, `i18next`, `react-i18next`. Nenhuma outra.
- Dev deps: exatamente a lista da spec (seção "Ferramentas de desenvolvimento").
- Ícones: SVG do Font Awesome Free 6 / Devicon (mesmos glifos de hoje); nada de `lucide-react`/`simple-icons`.
- Imagens: caminhos `/img/...` iguais aos atuais, em `public/img/`.
- Estilo de código: Prettier Rocketseat (sem ponto e vírgula, aspas simples), imports ordenados por `simple-import-sort`.
- Testes de lógica: `node --test` (Node 24, type stripping nativo); arquivos `*.test.ts` importam módulos por caminho relativo com extensão `.ts` (sem alias `@/`), por isso módulos testados não podem importar via `@/`.
- README: só a linha de tecnologias e a seção "Install and run" mudam.
- Commits: mensagens em inglês no padrão conventional commits, terminando com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Deep link com hash** (`/pt-br/#courses` aberto direto): link ativo e logo da sidebar devem refletir a seção visível já no carregamento, não só após o primeiro scroll → teste de `computeActiveSection` para posição inicial no meio da página (Task 5) + verificação manual (Task 7).
2. **Troca de idioma numa seção**: clicar na bandeira em `#skills` leva a `/en/#skills` e o navegador posiciona na seção → teste de `localeHref` (Task 2).
3. **Redimensionar de mobile para desktop com menu aberto**: em ≥ 992 px a navegação é sempre visível, independente do estado do menu → verificação no script de screenshots (Task 7).
4. **Chave de tradução inexistente**: i18next devolve a chave em silêncio → teste que percorre todos os dados e confirma que cada chave existe em ambos os JSONs (Tasks 3, 4 e 5).
5. **Modal longo no mobile (390 px)**: a grade da pós (15 itens) deve rolar dentro do overlay, com "Fechar" alcançável → screenshot do modal rolado (Task 7).

---

## File Structure

```
.github/workflows/deploy.yml        build + deploy Pages
eslint.config.mjs, prettier.config.mjs, postcss.config.mjs, next.config.ts, tsconfig.json
public/manifest.json                PWA manifest (conteúdo do manifest atual)
src/app/(redirect)/layout.tsx       layout mínimo para "/"
src/app/(redirect)/page.tsx         redirect('/pt-br/')
src/app/[locale]/layout.tsx         <html lang>, fontes, metadata, providers, Sidebar
src/app/[locale]/page.tsx           monta as 9 seções
src/i18n/config.ts                  locales, isLocale, toI18nLang, localeHref (puro, testado)
src/i18n/get-t.ts                   getT(locale) para server components
src/i18n/provider.tsx               I18nProvider cliente
src/lib/utils.ts                    cn()
src/lib/scroll.ts                   computeActiveSection, easeInOutExpo (puro, testado)
src/hooks/use-scroll-spy.ts         hook sobre computeActiveSection
src/hooks/use-smooth-scroll.ts      hook com rAF + easeInOutExpo
src/styles/globals.css              Tailwind, @theme, @layer base
src/data/types.ts                   tipos dos dados
src/data/{social,experience,education,skills,courses,speeches,sections}.ts
src/data/translation-keys.test.ts   integridade das chaves
src/components/section.tsx, resume-item.tsx
src/components/ui/{button,dialog,tooltip,collapse}.tsx
src/components/icons/{brand-icons.tsx,icon.tsx,png-icon.tsx}
src/components/sidebar/{sidebar.tsx,language-switcher.tsx,menu-toggle.tsx}
src/components/sections/{start,about,experience,education,skills,interests,courses,speeches,thanks}.tsx
```

---

### Task 1: Tooling e esqueleto do projeto

**Files:**
- Modify: `package.json`, `.gitignore`
- Create: `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `prettier.config.mjs`, `src/lib/utils.ts`, `src/app/[locale]/layout.tsx` (provisório), `src/app/[locale]/page.tsx` (provisório), `src/styles/globals.css` (só `@import "tailwindcss"`)

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string` em `src/lib/utils.ts`; scripts `dev`, `build`, `preview`, `lint`, `lint:fix`, `format`, `typecheck`, `test` (`node --test "src/**/*.test.ts"`).

- [ ] **Step 1:** `npm uninstall lucide-react simple-icons cookies-next`; instalar runtime faltante (`i18next`, `react-i18next` já estão) e todas as dev deps da spec. Ajustar `"start"` → `"preview": "npx serve@14.2.4 out"`. Adicionar `"engines": { "node": ">=20.9" }`.
- [ ] **Step 2:** `next.config.ts`: `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`. `tsconfig.json`: strict, `paths { "@/*": ["./src/*"] }`, `allowImportingTsExtensions: true`, `noEmit: true`, plugin `next`. `postcss.config.mjs` com `@tailwindcss/postcss`. `.gitignore`: `node_modules`, `.next`, `out`, `next-env.d.ts`, `*.tsbuildinfo`.
- [ ] **Step 3:** `eslint.config.mjs` conforme spec (FlatCompat → `@rocketseat/eslint-config/next`, `next/core-web-vitals`, `next/typescript`, plugin `simple-import-sort` com `imports: 'error'`; ignorar `out`, `.next`, `next-env.d.ts`). Se a config Rocketseat conflitar com ESLint 9, inspecionar o pacote instalado e usar o export flat que ele oferecer; registrar a escolha na mensagem de commit. `prettier.config.mjs`: `semi: false`, `singleQuote: true`, `plugins: ['prettier-plugin-tailwindcss']`.
- [ ] **Step 4:** Layout/page provisórios em `[locale]` com `generateStaticParams` retornando `pt-br` e `en` e `dynamicParams = false`; page renderiza `<p>{locale}</p>`.
- [ ] **Step 5: Verificar**
  Run: `npm run lint && npm run typecheck && npm run build`
  Expected: sem erros; existem `out/pt-br/index.html` e `out/en/index.html`.
- [ ] **Step 6: Commit** — inclui as remoções/movimentações de arquivos legados já presentes no working tree (`git add -A`). Mensagem: `chore: scaffold Next.js project and remove legacy Gulp/Bootstrap build`.

### Task 2: i18n, rotas e metadata

**Files:**
- Create: `src/i18n/config.ts`, `src/i18n/config.test.ts`, `src/i18n/get-t.ts`, `src/i18n/provider.tsx`, `src/app/(redirect)/layout.tsx`, `src/app/(redirect)/page.tsx`, `public/manifest.json`
- Modify: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`

**Interfaces:**
- Produces:
  - `type Locale = 'pt-br' | 'en'`; `locales: readonly Locale[]`; `defaultLocale: Locale = 'pt-br'`
  - `isLocale(value: string): value is Locale`
  - `toI18nLang(locale: Locale): 'pt-BR' | 'en'`
  - `localeHref(locale: Locale, hash?: string): string` → `'/en/'` ou `'/en/#skills'`
  - `getT(locale: Locale): TFunction` (server)
  - `<I18nProvider locale={Locale}>` (client) — expõe `useTranslation()` no idioma certo
  - `type LocaleParams = { params: Promise<{ locale: string }> }`

- [ ] **Step 1: Testes falhando** em `src/i18n/config.test.ts`:
  ```ts
  assert.equal(isLocale('pt-br'), true); assert.equal(isLocale('en'), true)
  assert.equal(isLocale('pt-BR'), false); assert.equal(isLocale('fr'), false)
  assert.equal(toI18nLang('pt-br'), 'pt-BR'); assert.equal(toI18nLang('en'), 'en')
  assert.equal(localeHref('en'), '/en/')
  assert.equal(localeHref('en', '#skills'), '/en/#skills')
  assert.equal(localeHref('pt-br', ''), '/pt-br/')
  ```
- [ ] **Step 2:** `npm test` → FAIL (módulo inexistente).
- [ ] **Step 3:** Implementar `config.ts` (sem imports). `get-t.ts`: `i18next.createInstance()` com `resources` dos dois JSON, `lng: toI18nLang(locale)`, `initImmediate: false`, retorna `instance.t`. `provider.tsx`: cria instância memoizada por locale e envolve em `I18nextProvider`.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** `[locale]/layout.tsx`: valida `isLocale` (senão `notFound()`), `<html lang={toI18nLang(locale)}>`, `generateMetadata` com title "Osvaldo Kalvaitir Filho", description "Personal website", `alternates.languages`, ícones, `appleWebApp`, `manifest: '/manifest.json'`; `viewport.themeColor '#28A745'`. `public/manifest.json` com o conteúdo do manifest atual (`short_name` Kalvaitir, `start_url` `/pt-br/`, cores `#28A745`). `(redirect)/page.tsx`: `redirect('/pt-br/')`; `(redirect)/layout.tsx` mínimo com `<html lang="pt-BR">`.
- [ ] **Step 6: Verificar** — `npm run build`; `out/index.html` contém `/pt-br/` (meta refresh); `out/en/index.html` contém `lang="en"`. `npm run lint && npm run typecheck`.
- [ ] **Step 7: Commit** `feat: add locale routing and i18n setup`.

### Task 3: Estilos base, fontes e seções estáticas

**Files:**
- Create: `src/styles/globals.css` (completo), `src/data/types.ts`, `src/data/social.ts`, `src/data/experience.ts`, `src/data/sections.ts`, `src/data/translation-keys.test.ts`, `src/components/section.tsx`, `src/components/resume-item.tsx`, `src/components/sections/{start,about,experience,interests,thanks}.tsx`, `src/components/icons/icon.tsx`, `src/components/icons/brand-icons.tsx` (apenas os ícones sociais nesta task)
- Modify: `src/app/[locale]/layout.tsx` (fontes, body, container), `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `getT`, `Locale`.
- Produces:
  - `sections: readonly { id: SectionId; labelKey: string }[]` em ordem: start, about, experience, education, skills, interests, courses, speeches, thanks (`labelKey` = `sidebar.<x>`; id de interesses é `interests`).
  - `type SectionId`
  - `<Section id={SectionId} align?: 'center' | 'start' divider?: boolean>` (default `center`, `true`)
  - `<ResumeItem logo={string} logoAlt={string} period={ReactNode}>{children}</ResumeItem>`
  - `type IconDef = { viewBox: string; path: string }`; `<Icon def={IconDef} className?>` (SVG `height: 1em`, `fill: currentColor`)
  - `type ExperienceItem = { id: string; logo: string; logoAlt: string; url: string }` (chaves `experience.<id>.office|company|functions|period`)
  - `type SocialLink = { href: string; label: string; icon: IconDef }`
- O teste de chaves exporta um helper interno `collectKeys()` que cada task seguinte estende ao adicionar dados.

- [ ] **Step 1: Teste falhando** `translation-keys.test.ts`: para cada chave gerada a partir de `sections` e `experience` (e as fixas `about.*`, `interests.paragraph1..6`, `thanks.*`), `assert.ok(get(ptBR, key) !== undefined)` e o mesmo para `en`, com mensagem que nomeia a chave.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Criar dados (`social.ts`, `experience.ts` com prisma, datasmart, gep, crystal na ordem atual; links do HTML atual em `$SCRATCH/old-site/sections/`).
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** `globals.css` completo conforme seção "Estilo" da spec; fontes `Mulish` e `Saira_Extra_Condensed` via `next/font/google` expostas como variáveis CSS usadas em `--font-body`/`--font-heading`. Layout: `body` com classes da spec; `<main>` = container com o fundo `background.png`.
- [ ] **Step 6:** Ícones sociais em `brand-icons.tsx`: extrair `viewBox`/path de `@fortawesome/fontawesome-free/svgs/{solid/envelope,brands/linkedin-in,brands/github,solid/rocket,brands/facebook-f,brands/instagram}.svg` (pacote já baixado em `$SCRATCH/tools/node_modules`); cabeçalho de comentário com a atribuição CC BY 4.0 / MIT.
- [ ] **Step 7:** Seções Start, About, Experience (`align="start"`), Interests, Thanks (`divider={false}`) e `page.tsx` montando-as (Education, Skills, Courses e Speeches entram nas próximas tasks).
- [ ] **Step 8: Verificar** — `npm run build`; `node $SCRATCH/tools/serve.mjs out 4002` em background; `node $SCRATCH/tools/shots.mjs http://localhost:4002/pt-br/ $SCRATCH/shots-new 1280`; comparar `1280-about.png` e `1280-experience.png` com `shots-old` (Read de ambas). Diferenças visíveis de tipografia/cor/espaçamento na área de conteúdo devem ser corrigidas antes do commit. A sidebar só existe na Task 6: a faixa de 17rem à esquerda fica vazia e é ignorada nesta comparação.
- [ ] **Step 9:** `npm run lint && npm run typecheck`; commit `feat: add base styles and static resume sections`.

### Task 4: Skills (ícones + tooltip)

**Files:**
- Create: `src/data/skills.ts`, `src/components/icons/png-icon.tsx`, `src/components/ui/tooltip.tsx`, `src/components/sections/skills.tsx`
- Modify: `src/components/icons/brand-icons.tsx`, `src/data/translation-keys.test.ts`, `src/app/[locale]/page.tsx`, `src/app/[locale]/layout.tsx` (TooltipProvider)

**Interfaces:**
- Consumes: `Icon`, `IconDef`, `Section`.
- Produces:
  - `type HardSkill = { name: string } & ({ icon: IconDef } | { png: string })` — `png` é o nome do arquivo em `/img/icons/` sem extensão.
  - `hardSkills: readonly HardSkill[]` (77 itens, ordem e nomes exatamente como os `title` de `sections/skills.html`)
  - `softSkills: readonly string[]` (16 sufixos de `skills.soft-skills.*`, ordem atual)
  - `<PngIcon name={string} />`
  - `<Tooltip content={string}>{child}</Tooltip>` (side bottom, estilo Bootstrap; o trigger recebe `aria-label={content}`)
  - Ícones: um export por glifo (`faJsSquare`, `diTypescriptPlain`…), check (`faCheck`) e × (`faXmark`) incluídos.

- [ ] **Step 1: Teste falhando** — estender `translation-keys.test.ts` com `skills.section`, `skills.hard-skills.section`, `skills.soft-skills.section` e cada `skills.soft-skills.<x>`; adicionar `assert.equal(hardSkills.length, 77)`, `assert.equal(new Set(hardSkills.map((s) => s.name)).size, 77)` (nomes únicos), `assert.equal(hardSkills[0].name, 'JavaScript')`, `assert.equal(hardSkills.at(-1)?.name, 'Microsoft Teams')` e `assert.equal(softSkills.length, 16)`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Gerar `brand-icons.tsx` com os glifos usados: Font Awesome de `svgs/brands|solid/*.svg`; Devicon de `devicon/icons/<nome>/<nome>-<variante>.svg` (variante = sufixo da classe atual, ex. `devicon-nextjs-original` → `nextjs/nextjs-original.svg`). Ícones Devicon com vários paths: concatenar `d` num único path quando não houver `fill` de cor distinta; se houver, manter grupos com `fill="currentColor"`. Script de extração fica em `$SCRATCH/tools`, não no repo.
- [ ] **Step 4:** Dados + seção Skills + PngIcon + Tooltip.
- [ ] **Step 5:** `npm test` → PASS.
- [ ] **Step 6: Verificar** — build + screenshots 1280 e 390 de `skills` e `tooltip`; comparar com `shots-old`; alinhar tamanho/posição dos glifos (altura 1em em font-size 3rem, alinhamento de baseline como hoje) até coincidir.
- [ ] **Step 7:** lint, typecheck, commit `feat: add skills section with brand icons and tooltips`.

### Task 5: Education, Courses e Speeches (dialog + collapse)

**Files:**
- Create: `src/data/education.ts`, `src/data/courses.ts`, `src/data/speeches.ts`, `src/components/ui/{button,dialog,collapse}.tsx`, `src/components/sections/{education,courses,speeches}.tsx`
- Modify: `src/data/translation-keys.test.ts`, `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `ResumeItem`, `Section`, `getT`, `I18nProvider`.
- Produces:
  - `type CurriculumEntry = { key: string; level: 1 | 2 | 3; description?: string }` — `level` mapeia para `.subheading`, `.subheading2` (ml 20px), `.subheading3` (ml 40px); texto usa `.text`, `.text2`, `.text3` conforme HTML atual.
  - `type EducationItem = { id: 'university' | 'college'; logo; logoAlt; url; curriculum: CurriculumEntry[] }`
  - `type CourseItem = { id: string; logo; logoAlt; url?: string; allCourses?: CurriculumEntry[] }` (sem `allCourses` → mostra `description`)
  - `type SpeechItem = { id: string; logo; logoAlt; url: string; speeches: string[]; periods: string[] }` (`speeches` = sufixos `speech`, `speech-1`…; `periods` = `['period']` ou `['period','period-2']`)
  - `<Button variant="dark" | "secondary">` (cva não é usado; variantes via objeto + `cn`)
  - `<CurriculumDialog title={string} closeLabel={string} trigger={string}>{body}</CurriculumDialog>` (cliente)
  - `<Collapse label={string}>{content}</Collapse>` (cliente, estado próprio)

- [ ] **Step 1: Teste falhando** — estender o teste de chaves com todas as chaves derivadas de `education`, `courses` e `speeches` (incluindo `<id>.curriculum.close`, `all-courses.section`, `total-workload`, `period(s)`).
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Dados, na ordem e com os níveis exatos de `$SCRATCH/old-site/sections/{education,courses,speeches}.html`. CEBRAC recebe `allCourses` próprio (correção do bug).
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Componentes `button`, `dialog` (Radix + `tw-animate-css`, valores da spec; overlay com `overflow-y-auto` para modais longos), `collapse` (transição de altura .35 s via `grid-template-rows 0fr → 1fr`), e as três seções.
- [ ] **Step 6: Verificar** — build + screenshots 1280/390 de `education`, `courses`, `speeches`, `modal`, `collapse`; comparar com `shots-old` e ajustar. Conferir que o collapse do CEBRAC abre a própria lista.
- [ ] **Step 7:** lint, typecheck, commit `feat: add education, courses and speeches sections`.

### Task 6: Sidebar (scroll spy, rolagem suave, idiomas, menu mobile)

**Files:**
- Create: `src/lib/scroll.ts`, `src/lib/scroll.test.ts`, `src/hooks/use-scroll-spy.ts`, `src/hooks/use-smooth-scroll.ts`, `src/components/sidebar/{sidebar,language-switcher,menu-toggle}.tsx`
- Modify: `src/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `sections`, `SectionId`, `localeHref`, `Locale`, `I18nProvider`.
- Produces:
  - `computeActiveSection(input: { scrollTop: number; scrollHeight: number; viewportHeight: number; offsets: { id: string; top: number }[]; offset?: number }): string | null` — algoritmo da spec (offset default 10).
  - `easeInOutExpo(t: number): number` (t ∈ [0,1]).
  - `useScrollSpy(ids: readonly string[]): string | null` — calcula no mount, em `scroll` e `resize`.
  - `useSmoothScroll(): (id: string | null) => void` — `null` rola ao topo; 1000 ms; respeita `prefers-reduced-motion`.

- [ ] **Step 1: Testes falhando** em `scroll.test.ts`:
  ```ts
  const offsets = [{ id: 'start', top: 0 }, { id: 'about', top: 900 }, { id: 'thanks', top: 5000 }]
  const base = { scrollHeight: 6000, viewportHeight: 900, offsets }
  assert.equal(computeActiveSection({ ...base, scrollTop: 0 }), 'start')
  assert.equal(computeActiveSection({ ...base, scrollTop: 889 }), 'start')
  assert.equal(computeActiveSection({ ...base, scrollTop: 890 }), 'about')      // +10 de offset
  assert.equal(computeActiveSection({ ...base, scrollTop: 2500 }), 'about')     // deep link no meio
  assert.equal(computeActiveSection({ ...base, scrollTop: 5100 }), 'thanks')    // fim da página
  assert.equal(computeActiveSection({ ...base, offsets: [{ id: 'start', top: 54 }, ...offsets.slice(1)], scrollTop: 0 }), null) // mobile, acima da 1ª seção
  assert.equal(easeInOutExpo(0), 0); assert.equal(easeInOutExpo(1), 1); assert.equal(easeInOutExpo(0.5), 0.5)
  assert.ok(easeInOutExpo(0.25) < 0.25 && easeInOutExpo(0.75) > 0.75)
  ```
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementar `scroll.ts` (sem imports). `easeInOutExpo` = fórmula jQuery: `t===0?0 : t===1?1 : t<.5 ? 2**(20t-10)/2 : (2-2**(-20t+10))/2`.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Hooks e sidebar conforme spec (brand rola ao topo via `scrollTo(null)`; desktop/mobile, logo visível quando `active !== 'start'`, menu mobile com animação de altura e fechando ao clicar em link; em ≥ 992 px a lista é sempre visível independentemente do estado do menu). `LanguageSwitcher` usa `<a href={localeHref(l, location.hash)}>` atualizado no clique (lê `window.location.hash` no handler) com as imagens de bandeira 40×28 arredondadas e `alt` "Português"/"English".
- [ ] **Step 6: Verificar** — build + suíte completa de screenshots em todas as larguras: `node $SCRATCH/tools/shots.mjs http://localhost:4002/pt-br/ $SCRATCH/shots-new`. Comparar sidebar/menu com `shots-old` (`*-about`, `*-skills`, `*-menu`, `*-start`).
- [ ] **Step 7:** lint, typecheck, commit `feat: add sidebar with scroll spy, smooth scroll and language switcher`.

### Task 7: Paridade visual completa

**Files:**
- Modify: quaisquer componentes/estilos com divergência.

- [ ] **Step 1:** Rodar a suíte completa (5 larguras) no site novo e gerar diffs com `pixelmatch` (script `$SCRATCH/tools/diff.mjs` comparando `shots-old/*` × `shots-new/*`, saída em `$SCRATCH/diffs/` com % de pixels diferentes por arquivo).
- [ ] **Step 2:** Revisar (Read) cada par com diferença > 1 %; corrigir divergências reais. Diferenças aceitas: bug do CEBRAC corrigido, anti-aliasing de fonte.
- [ ] **Step 3:** Verificações dos itens do Review Focus: abrir `/pt-br/#courses` direto (link "Cursos" ativo e logo visível no 1º frame após hidratação); clicar bandeira EN em `#skills` → `/en/#skills`; viewport 800 com menu aberto → redimensionar para 1280 → sidebar normal; modal da pós em 390 rolado até "Fechar".
- [ ] **Step 4:** Repetir até todos os pares estarem ≤ 1 % ou justificados.
- [ ] **Step 5:** lint, typecheck, test, build; commit `fix: match legacy layout pixel details` (se houve mudanças).

### Task 8: Deploy e README

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md` (só a linha de tecnologias e "Install and run")

- [ ] **Step 1:** Workflow: `on: push: branches [main]` + `workflow_dispatch`; `permissions: contents: read, pages: write, id-token: write`; `concurrency: pages`; job build (`actions/checkout@v4`, `actions/setup-node@v4` com `node-version: 24` e cache npm, `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `actions/upload-pages-artifact@v3` com `path: out`); job deploy (`actions/deploy-pages@v4`, environment `github-pages`).
- [ ] **Step 2:** README: `🥇 Personal website using Bootstrap, Gulp and jQuery` → `🥇 Personal website using Next.js, React, Tailwind CSS and Radix UI`; em "Install and run": requisito "Node.js 20.9 or higher", comandos `npm install` e `npm run dev` (remover menção a Python 2.7 e yarn). Nada mais muda.
- [ ] **Step 3: Verificar** — `npm ci && npm run lint && npm run typecheck && npm test && npm run build` do zero (apagar `node_modules`, `.next`, `out` antes); `git diff --stat README.md` mostra só essas linhas.
- [ ] **Step 4:** Commit `ci: deploy static export to GitHub Pages` e `docs: update README stack and install instructions`.
