import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ubadkaab TV',
  description: 'Created with Salman'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
