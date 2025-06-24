"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ar" | "so"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const translations = {
  en: {
    // Navigation
    home: "Home",
    games: "Games",
    profile: "Profile",
    settings: "Settings",

    // Game Categories
    alphabets: "Alphabets",
    drawing: "Drawing",
    quizzes: "Quizzes",
    math: "Math Games",
    science: "Science",
    puzzles: "Puzzles",
    music: "Music",
    quran: "Quran Learning",

    // Common
    play: "Play",
    start: "Start",
    next: "Next",
    back: "Back",
    score: "Score",
    level: "Level",
    restart: "Restart",
    correct: "Correct!",
    tryAgain: "Try Again",
    wellDone: "Well Done!",

    // Alphabets
    clickLetter: "Click on a letter to hear its sound!",

    // Math
    addition: "Addition",
    subtraction: "Subtraction",
    multiplication: "Multiplication",

    // Drawing
    colors: "Colors",
    brushSize: "Brush Size",
    clear: "Clear",

    // Quran
    surah: "Surah",
    verse: "Verse",
    listen: "Listen",

    // Profile
    totalScore: "Total Score",
    gamesPlayed: "Games Played",
    favoriteGame: "Favorite Game",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    games: "الألعاب",
    profile: "الملف الشخصي",
    settings: "الإعدادات",

    // Game Categories
    alphabets: "الحروف الأبجدية",
    drawing: "الرسم",
    quizzes: "الاختبارات",
    math: "ألعاب الرياضيات",
    science: "العلوم",
    puzzles: "الألغاز",
    music: "الموسيقى",
    quran: "تعلم القرآن",

    // Common
    play: "العب",
    start: "ابدأ",
    next: "التالي",
    back: "رجوع",
    score: "النقاط",
    level: "المستوى",
    restart: "إعادة البدء",
    correct: "صحيح!",
    tryAgain: "حاول مرة أخرى",
    wellDone: "أحسنت!",

    // Alphabets
    clickLetter: "انقر على حرف لسماع صوته!",

    // Math
    addition: "الجمع",
    subtraction: "الطرح",
    multiplication: "الضرب",

    // Drawing
    colors: "الألوان",
    brushSize: "حجم الفرشاة",
    clear: "مسح",

    // Quran
    surah: "سورة",
    verse: "آية",
    listen: "استمع",

    // Profile
    totalScore: "مجموع النقاط",
    gamesPlayed: "الألعاب المُلعبة",
    favoriteGame: "اللعبة المفضلة",
  },
  so: {
    // Navigation
    home: "Guriga",
    games: "Ciyaaraha",
    profile: "Xogta Shakhsiga",
    settings: "Dejinta",

    // Game Categories
    alphabets: "Xarfaha",
    drawing: "Sawirka",
    quizzes: "Imtixaannada",
    math: "Ciyaaraha Xisaabta",
    science: "Sayniska",
    puzzles: "Halxiraale",
    music: "Muusiga",
    quran: "Barashada Quraanka",

    // Common
    play: "Ciyaar",
    start: "Bilow",
    next: "Xiga",
    back: "Dib u noqo",
    score: "Dhibcaha",
    level: "Heerka",
    restart: "Dib u bilow",
    correct: "Sax!",
    tryAgain: "Mar kale isku day",
    wellDone: "Si fiican!",

    // Alphabets
    clickLetter: "Riix xaraf si aad u maqasho codkiisa!",

    // Math
    addition: "Isku darka",
    subtraction: "Ka goynta",
    multiplication: "Isku dhufashada",

    // Drawing
    colors: "Midabada",
    brushSize: "Cabbirka Brushka",
    clear: "Nadiifi",

    // Quran
    surah: "Suurad",
    verse: "Aayad",
    listen: "Dhegayso",

    // Profile
    totalScore: "Wadarta Dhibcaha",
    gamesPlayed: "Ciyaaraha la ciyaaray",
    favoriteGame: "Ciyaarta la jecel yahay",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["en", "ar", "so"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  const isRTL = language === "ar"

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isRTL }}>
      <div className={isRTL ? "rtl" : "ltr"}>{children}</div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
