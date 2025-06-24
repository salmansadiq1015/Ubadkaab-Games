"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LanguageProvider, useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import {
  BookOpen,
  Calculator,
  Atom,
  Puzzle,
  Brain,
  Gamepad2,
  Palette,
  Shapes,
  PawPrint,
  Hash,
  Music,
  Brush,
  Star,
  Globe,
  Trophy,
  Target,
} from "lucide-react"

// Import game main pages
import AlphabetMainPage from "@/components/games/alphabet/alphabet-main"
import MathMainPage from "@/components/games/math/math-main"
import ScienceMainPage from "@/components/games/science/science-main"
// Import the remaining game main pages that were missing
import PuzzleMainPage from "@/components/games/puzzle/puzzle-main"
import QuizMainPage from "@/components/games/quiz/quiz-main"
import MemoryMainPage from "@/components/games/memory/memory-main"
import ShapesMainPage from "@/components/games/shapes/shapes-main"
import AnimalsMainPage from "@/components/games/animals/animals-main"
import NumbersMainPage from "@/components/games/numbers/numbers-main"
import MusicMainPage from "@/components/games/music/music-main"
import DrawingMainPage from "@/components/games/drawing/drawing-main"

import ColorsMainPage from "@/components/games/colors/colors-main"
const games = [
  {
    id: "alphabet",
    icon: BookOpen,
    color: "bg-gradient-to-br from-pink-400 to-pink-600",
    component: AlphabetMainPage,
  },
  {
    id: "math",
    icon: Calculator,
    color: "bg-gradient-to-br from-blue-400 to-blue-600",
    component: MathMainPage,
  },
  {
    id: "science",
    icon: Atom,
    color: "bg-gradient-to-br from-green-400 to-green-600",
    component: ScienceMainPage,
  },
  {
    id: "puzzle",
    icon: Puzzle,
    color: "bg-gradient-to-br from-purple-400 to-purple-600",
    component: PuzzleMainPage,
  },
  {
    id: "quiz",
    icon: Brain,
    color: "bg-gradient-to-br from-orange-400 to-orange-600",
    component: QuizMainPage,
  },
  {
    id: "memory",
    icon: Gamepad2,
    color: "bg-gradient-to-br from-red-400 to-red-600",
    component: MemoryMainPage,
  },
  {
    id: "colors",
    icon: Palette,
    color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    component: ColorsMainPage,
  },
  {
    id: "shapes",
    icon: Shapes,
    color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    component: ShapesMainPage,
  },
  {
    id: "animals",
    icon: PawPrint,
    color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    component: AnimalsMainPage,
  },
  {
    id: "numbers",
    icon: Hash,
    color: "bg-gradient-to-br from-cyan-400 to-cyan-600",
    component: NumbersMainPage,
  },
  {
    id: "music",
    icon: Music,
    color: "bg-gradient-to-br from-violet-400 to-violet-600",
    component: MusicMainPage,
  },
  {
    id: "drawing",
    icon: Brush,
    color: "bg-gradient-to-br from-rose-400 to-rose-600",
    component: DrawingMainPage,
  },
]

function HomePage() {
  const { language, setLanguage, t } = useLanguage()
  const { progress } = useProgress()
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  if (selectedGame) {
    const game = games.find((g) => g.id === selectedGame)
    if (game) {
      const GameMainPage = game.component
      return <GameMainPage onBack={() => setSelectedGame(null)} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("welcome")}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
              <SelectTrigger className="w-32">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="so">Soomaali</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("totalScore")}</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{progress.score}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("gamesPlayed")}</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{progress.gamesPlayed}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("currentLevel")}</CardTitle>
              <Star className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{progress.level}</div>
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => {
            const Icon = game.icon
            return (
              <Card
                key={game.id}
                className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => setSelectedGame(game.id)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${game.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{t(`${game.id}Game`)}</CardTitle>
                  <CardDescription className="text-sm">{t(`${game.id}Desc`)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">
                      {t("bestScore")}: {progress.bestScores[game.id] || 0}
                    </div>
                    <Button className="w-full" size="sm">
                      {t("enter")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <HomePage />
    </LanguageProvider>
  )
}
