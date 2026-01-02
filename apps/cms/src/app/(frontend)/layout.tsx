import React from 'react'
import './styles.css'
import '@/styles/global.css'

export const metadata = {
  description: 'Abacus Poker Club',
  title: 'Abacus Poker Club',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
