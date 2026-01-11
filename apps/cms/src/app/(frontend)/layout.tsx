import React from 'react'
import './styles.css'
import '@/styles/global.css'
import { gothamCondensed } from './fonts'
import { Azeret_Mono } from 'next/font/google';

export const metadata = {
  description: 'Abacus Poker Club',
  title: 'Abacus Poker Club',
}

const azeretMono = Azeret_Mono({
  subsets: ['latin'],
  variable: '--font-azeret-mono',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function RootLayout(props: { children: any }) {
  const { children } = props

  return (
    <html lang="en" className={`${gothamCondensed.variable} ${azeretMono.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
