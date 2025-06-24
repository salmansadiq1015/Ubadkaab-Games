"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "ar" | "so"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    home: "Home",
    games: "Games",
    profile: "Profile",
    settings: "Settings",

    // Home page
    welcome: "Welcome to Learning Games!",
    subtitle: "Fun educational games for children",
    totalScore: "Total Score",
    gamesPlayed: "Games Played",
    currentLevel: "Current Level",
    bestScore: "Best Score",
    enter: "Enter",

    // Games
    alphabetGame: "Alphabet Game",
    mathGame: "Math Game",
    scienceGame: "Science Game",
    puzzleGame: "Puzzle Game",
    quizGame: "Quiz Game",
    memoryGame: "Memory Game",
    colorsGame: "Colors Game",
    shapesGame: "Shapes Game",
    animalsGame: "Animals Game",
    numbersGame: "Numbers Game",
    musicGame: "Music Game",
    drawingGame: "Drawing Game",

    // Game descriptions
    alphabetDesc: "Learn letters and sounds",
    mathDesc: "Practice numbers and calculations",
    scienceDesc: "Discover amazing facts",
    puzzleDesc: "Solve fun puzzles",
    quizDesc: "Test your knowledge",
    memoryDesc: "Improve your memory",
    colorsDesc: "Learn about colors",
    shapesDesc: "Identify different shapes",
    animalsDesc: "Meet amazing animals",
    numbersDesc: "Count and learn numbers",
    musicDesc: "Create beautiful music",
    drawingDesc: "Express your creativity",

    // Common
    play: "Play",
    start: "Start",
    next: "Next",
    submit: "Submit",
    correct: "Correct!",
    incorrect: "Try again!",
    score: "Score",
    level: "Level",
    back: "Back",
    restart: "Restart",
    wellDone: "Well Done!",
    gameComplete: "Game Complete!",
    highScore: "High Score",
    currentScore: "Current Score",
    playNow: "Play Now",
    achievements: "Achievements",
    statistics: "Statistics",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    games: "الألعاب",
    profile: "الملف الشخصي",
    settings: "الإعدادات",

    // Home page
    welcome: "مرحباً بك في ألعاب التعلم!",
    subtitle: "ألعاب تعليمية ممتعة للأطفال",
    totalScore: "النقاط الإجمالية",
    gamesPlayed: "الألعاب المُلعبة",
    currentLevel: "المستوى الحالي",
    bestScore: "أفضل نتيجة",
    enter: "دخول",

    // Games
    alphabetGame: "لعبة الحروف",
    mathGame: "لعبة الرياضيات",
    scienceGame: "لعبة العلوم",
    puzzleGame: "لعبة الألغاز",
    quizGame: "لعبة الأسئلة",
    memoryGame: "لعبة الذاكرة",
    colorsGame: "لعبة الألوان",
    shapesGame: "لعبة الأشكال",
    animalsGame: "لعبة الحيوانات",
    numbersGame: "لعبة الأرقام",
    musicGame: "لعبة الموسيقى",
    drawingGame: "لعبة الرسم",

    // Game descriptions
    alphabetDesc: "تعلم الحروف والأصوات",
    mathDesc: "تدرب على الأرقام والحسابات",
    scienceDesc: "اكتشف حقائق مذهلة",
    puzzleDesc: "حل الألغاز الممتعة",
    quizDesc: "اختبر معلوماتك",
    memoryDesc: "حسن ذاكرتك",
    colorsDesc: "تعلم عن الألوان",
    shapesDesc: "تعرف على الأشكال المختلفة",
    animalsDesc: "تعرف على الحيوانات الرائعة",
    numbersDesc: "عد وتعلم الأرقام",
    musicDesc: "أنشئ موسيقى جميلة",
    drawingDesc: "عبر عن إبداعك",

    // Common
    play: "العب",
    start: "ابدأ",
    next: "التالي",
    submit: "إرسال",
    correct: "صحيح!",
    incorrect: "حاول مرة أخرى!",
    score: "النقاط",
    level: "المستوى",
    back: "رجوع",
    restart: "إعادة البدء",
    wellDone: "أحسنت!",
    gameComplete: "اللعبة مكتملة!",
    highScore: "أعلى نتيجة",
    currentScore: "النتيجة الحالية",
    playNow: "العب الآن",
    achievements: "الإنجازات",
    statistics: "الإحصائيات",
  },
  so: {
    // Navigation
    home: "Guriga",
    games: "Ciyaaraha",
    profile: "Xogta Shakhsi",
    settings: "Dejinta",

    // Home page
    welcome: "Ku soo dhawoow Ciyaaraha Waxbarashada!",
    subtitle: "Ciyaaro waxbarasho oo xiiso leh carruurta",
    totalScore: "Dhibcaha Guud",
    gamesPlayed: "Ciyaaraha la Ciyaaray",
    currentLevel: "Heerka Hadda",
    bestScore: "Natiijooyinka Ugu Fiican",
    enter: "Gal",

    // Games
    alphabetGame: "Ciyaarta Xarfaha",
    mathGame: "Ciyaarta Xisaabta",
    scienceGame: "Ciyaarta Sayniska",
    puzzleGame: "Ciyaarta Halxidhaale",
    quizGame: "Ciyaarta Su'aalaha",
    memoryGame: "Ciyaarta Xusuusta",
    colorsGame: "Ciyaarta Midabada",
    shapesGame: "Ciyaarta Qaababka",
    animalsGame: "Ciyaarta Xayawaanka",
    numbersGame: "Ciyaarta Tirooyinka",
    musicGame: "Ciyaarta Muusikada",
    drawingGame: "Ciyaarta Sawirka",

    // Game descriptions
    alphabetDesc: "Baro xarfaha iyo codadka",
    mathDesc: "Ku celceli tirooyinka iyo xisaabinta",
    scienceDesc: "Ogaado xaqiiqooyin cajiib ah",
    puzzleDesc: "Xalli halxidhaale xiiso leh",
    quizDesc: "Imtixaan aqoontaada",
    memoryDesc: "Hagaaji xusuustaada",
    colorsDesc: "Ku baro midabada",
    shapesDesc: "Aqoonso qaababka kala duwan",
    animalsDesc: "La kulam xayawaanka cajiibka ah",
    numbersDesc: "Tiri oo baro tirooyinka",
    musicDesc: "Samee muusiko qurux badan",
    drawingDesc: "Muuji hal-abuurkaaga",

    // Common
    play: "Ciyaar",
    start: "Bilow",
    next: "Xiga",
    submit: "Dir",
    correct: "Sax!",
    incorrect: "Mar kale isku day!",
    score: "Dhibco",
    level: "Heer",
    back: "Dib u noqo",
    restart: "Dib u bilow",
    wellDone: "Si fiican!",
    gameComplete: "Ciyaartu way dhammaatay!",
    highScore: "Dhibcaha Ugu Sarreeya",
    currentScore: "Dhibcaha Hadda",
    playNow: "Hadda Ciyaar",
    achievements: "Guulaha",
    statistics: "Tirakoobka",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
