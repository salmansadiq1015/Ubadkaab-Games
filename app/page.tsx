"use client"

import { useLanguage } from "@/contexts/language-context"
import { useAudio } from "@/contexts/audio-context"
import { Header } from "@/components/header"
import Link from "next/link"
import { BookOpen, Palette, Brain, Calculator, Microscope, Puzzle, Music, BookOpenCheck } from "lucide-react"

const gameCategories = [
  {
    id: "alphabets",
    icon: BookOpen,
    color: "from-red-400 to-pink-500",
    href: "/games/alphabets",
  },
  {
    id: "drawing",
    icon: Palette,
    color: "from-green-400 to-blue-500",
    href: "/games/drawing",
  },
  {
    id: "quizzes",
    icon: Brain,
    color: "from-purple-400 to-indigo-500",
    href: "/games/quizzes",
  },
  {
    id: "math",
    icon: Calculator,
    color: "from-yellow-400 to-orange-500",
    href: "/games/math",
  },
  {
    id: "science",
    icon: Microscope,
    color: "from-teal-400 to-cyan-500",
    href: "/games/science",
  },
  {
    id: "puzzles",
    icon: Puzzle,
    color: "from-pink-400 to-rose-500",
    href: "/games/puzzles",
  },
  {
    id: "music",
    icon: Music,
    color: "from-indigo-400 to-purple-500",
    href: "/games/music",
  },
  {
    id: "quran",
    icon: BookOpenCheck,
    color: "from-emerald-400 to-green-500",
    href: "/games/quran",
  },
]

export default function HomePage() {
  const { t } = useLanguage()
  const { playSound } = useAudio()

  const handleGameClick = () => {
    playSound("click")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🌟 {t("games")} 🌟
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose your favorite learning adventure!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {gameCategories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.id} href={category.href} onClick={handleGameClick} className="game-card group">
                <div
                  className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{t(category.id)}</h3>
                <div className="text-center">
                  <span className="kid-button inline-block">{t("play")}</span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-3xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎯 Learning Made Fun!</h2>
            <p className="text-gray-600 text-lg">
              Explore interactive games, learn new skills, and have amazing adventures while discovering the world
              around you!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
