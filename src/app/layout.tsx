import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import StoreProvider from './StoreProvider'
import '@styles/globals.scss'

const roboto = Roboto({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lalasia',
  description: 'Your favorite store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}