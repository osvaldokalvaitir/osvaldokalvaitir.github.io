export const dynamicParams = false

export function generateStaticParams() {
  return [{ locale: 'pt-br' }, { locale: 'en' }]
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return <p>{locale}</p>
}
