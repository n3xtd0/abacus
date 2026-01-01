import React from 'react'
import './styles.css'
import '@/styles/global.css'

export const metadata = {
  description: 'Abacus Admin Panel',
  title: 'Abacus Admin Panel',
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
