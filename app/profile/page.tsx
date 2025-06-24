"use client"

import { useLanguage } from "@/contexts/language-context"
import { useUser } from "@/contexts/user-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Trophy, Target, Star, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { t } = useLanguage()
  const { profile, resetProfile } = useUser()

  const gameStats = profile.scores.reduce(
    (acc, score) => {
      if (!acc[score.game]) {
        acc[score.game] = { totalScore: 0, timesPlayed: 0, bestScore: 0 }
      }
      acc[score.game].totalScore += score.score
      acc[score.game].timesPlayed += 1
      acc[score.game].bestScore = Math.max(acc[score.game].bestScore, score.score)
      return acc
    },
    {} as Record<string, { totalScore: number; timesPlayed: number; bestScore: number }>,
  )

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      resetProfile()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("back")}
            </Button>
          </Link>

          <Button onClick={handleReset} variant="outline" className="bg-red-100 text-red-700 hover:bg-red-200">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Progress
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            👤 {t("profile")} 👤
          </h1>
          <p className="text-xl text-gray-600">Track your learning progress and achievements!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Overall Stats */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                  Overall Stats
                </h2>

                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-700">{t("totalScore")}</span>
                      <span className="text-2xl font-bold text-yellow-600">{profile.totalScore}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-700">{t("gamesPlayed")}</span>
                      <span className="text-2xl font-bold text-blue-600">{profile.gamesPlayed}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-700">{t("favoriteGame")}</span>
                      <span className="text-lg font-bold text-green-600 capitalize">{t(profile.favoriteGame)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Statistics */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-blue-500" />
                  Game Statistics
                </h2>

                {Object.keys(gameStats).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(gameStats).map(([game, stats]) => (
                      <div
                        key={game}
                        className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-2 border-purple-200"
                      >
                        <h3 className="text-lg font-bold text-gray-800 mb-3 capitalize flex items-center">
                          <Star className="w-5 h-5 mr-2 text-purple-500" />
                          {t(game)}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Score:</span>
                            <span className="font-bold text-purple-600">{stats.totalScore}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Times Played:</span>
                            <span className="font-bold text-blue-600">{stats.timesPlayed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Best Score:</span>
                            <span className="font-bold text-green-600">{stats.bestScore}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🎮</div>
                    <p className="text-xl text-gray-600 mb-4">No games played yet!</p>
                    <p className="text-gray-500">Start playing games to see your statistics here.</p>
                    <Link href="/">
                      <Button className="kid-button mt-4">Start Playing</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        {profile.scores.length > 0 && (
          <div className="mt-8 max-w-6xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Recent Activity</h2>

                <div className="space-y-3">
                  {profile.scores
                    .slice(-10)
                    .reverse()
                    .map((score, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm capitalize">{t(score.game).charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 capitalize">{t(score.game)}</p>
                            <p className="text-sm text-gray-600">{new Date(score.timestamp).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">+{score.score} points</p>
                          <p className="text-sm text-gray-600">Level {score.level}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
