import type { ReactNode } from 'react'

// `redirect()` does not emit a working redirect in a static export, so `/`
// redirects on the client. The script keeps the hash (`/#courses` →
// `/pt-br/#courses`); the meta refresh is the no-JS fallback, inside
// <noscript> so it never races the script.
const redirectScript = "location.replace('/pt-br/' + location.hash)"

export default function RedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/pt-br/" />
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  )
}
