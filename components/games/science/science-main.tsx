"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import { Atom, Trophy, Star, Target, ArrowLeft, Globe } from "lucide-react"
import SciencePlayScreen from "./science-play"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ScienceMainPageProps {
  onBack: () => void
}

export default function ScienceMainPage({ onBack }: ScienceMainPageProps) {
  const { t, language, setLanguage } = useLanguage()
  const { progress } = useProgress()
  const [showPlayScreen, setShowPlayScreen] = useState(false)

  if (showPlayScreen) {
    return <SciencePlayScreen onBack={() => setShowPlayScreen(false)} />
  }

  const gameStats = {
    highScore: progress.bestScores.science || 0,
    timesPlayed: Math.floor(progress.gamesPlayed / 6) || 0,
    accuracy: "90%",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button onClick={onBack} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("back")}
            </Button>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
              <Atom className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t("scienceGame")}
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
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-8">
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Atom className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl">{t("scienceGame")}</CardTitle>
              <CardDescription className="text-lg">{t("scienceDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => setShowPlayScreen(true)}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-xl"
              >
                {t("playNow")}
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t("highScore")}</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{gameStats.highScore}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Times Played</CardTitle>
                <Target className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{gameStats.timesPlayed}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                <Star className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{gameStats.accuracy}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle>Game Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Nature</Badge>
                  <span>Learn about plants and animals</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Space</Badge>
                  <span>Explore planets and stars</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Body</Badge>
                  <span>Discover human body facts</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Fun Facts</Badge>
                  <span>Amazing science trivia</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
