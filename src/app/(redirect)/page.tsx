import Link from 'next/link'

// The redirect itself lives in the layout's <head> (see layout.tsx).
export default function Page() {
  return (
    <>
      <title>Osvaldo Kalvaitir Filho</title>
      <link rel="canonical" href="/pt-br/" />
      <p>
        <Link href="/pt-br/">/pt-br/</Link>
      </p>
    </>
  )
}
