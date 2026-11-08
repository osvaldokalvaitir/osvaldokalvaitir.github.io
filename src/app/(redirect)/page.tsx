import Link from 'next/link'

// `redirect()` does not emit a working redirect in a static export,
// so this page redirects on the client via a meta refresh.
export default function Page() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/pt-br/" />
      <link rel="canonical" href="/pt-br/" />
      <p>
        <Link href="/pt-br/">/pt-br/</Link>
      </p>
    </>
  )
}
