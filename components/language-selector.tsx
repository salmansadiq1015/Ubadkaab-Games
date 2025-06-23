"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Globe } from "lucide-react"
import type { Language } from "@/lib/translations"

interface LanguageSelectorProps {
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
}

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "so", name: "Soomaali", flag: "🇸🇴" },
  ]

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="bg-white/90 hover:bg-white flex items-center gap-2 text-sm sm:text-base px-2 sm:px-4"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{languages.find((l) => l.code === currentLanguage)?.flag}</span>
        <span className="hidden md:inline">{languages.find((l) => l.code === currentLanguage)?.name}</span>
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-2 right-0 z-50 min-w-[150px]">
          <CardContent className="p-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code)
                  setIsOpen(false)
                }}
                variant={currentLanguage === lang.code ? "default" : "ghost"}
                className={`w-full justify-start text-sm ${lang.code === "ar" ? "text-right" : "text-left"}`}
                dir={lang.code === "ar" ? "rtl" : "ltr"}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
