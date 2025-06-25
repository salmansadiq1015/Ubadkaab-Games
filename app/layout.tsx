import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { LanguageProvider } from "@/contexts/language-context"
import { UserProvider } from "@/contexts/user-context"
import { AudioProvider } from "@/contexts/audio-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Kids Learning Platform",
  description: "Interactive learning games for children",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <UserProvider>
            <AudioProvider>{children}</AudioProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
