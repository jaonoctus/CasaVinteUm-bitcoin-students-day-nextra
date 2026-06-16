import type { Metadata } from 'next'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Bitcoin Students Day',
    template: '%s – Bitcoin Students Day'
  },
  description:
    'Um dia inteiro de imersão prática em Bitcoin e Lightning, com workshops, discussões técnicas e networking.'
}

const navbar = (
  <Navbar
    logo={<b>Bitcoin Students Day</b>}
    projectLink="https://github.com/vinteum-bdl"
  />
)

const footer = (
  <Footer>
    {new Date().getFullYear()} © Bitcoin Students Day, by{' '}
    <a href="https://vinteum.org" target="_blank" rel="noreferrer">
      Vinteum
    </a>
    .
  </Footer>
)

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/vinteum-bdl"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
