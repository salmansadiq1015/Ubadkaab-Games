"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import { ArrowLeft } from "lucide-react"

interface ColorsPlayScreenProps {
  onBack: () => void
}

export default function ColorsPlayScreen({ onBack }: ColorsPlayScreenProps) {
  const { t } = useLanguage()
  const { updateProgress } = useProgress()
  const [currentColor, setCurrentColor] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const colors = [
    { name: "Red", color: "#EF4444", options: ["Red", "Blue", "Green"] },
    { name: "Blue", color: "#3B82F6", options: ["Red", "Blue", "Yellow"] },
    { name: "Green", color: "#10B981", options: ["Green", "Purple", "Orange"] },
    { name: "Yellow", color: "#F59E0B", options: ["Pink", "Yellow", "Blue"] },
    { name: "Purple", color: "#8B5CF6", options: ["Purple", "Green", "Red"] },
    { name: "Orange", color: "#F97316", options: ["Blue", "Orange", "Pink"] },
    { name: "Pink", color: "#EC4899", options: ["Pink", "Yellow", "Purple"] },
    { name: "Brown", color: "#A3A3A3", options: ["Brown", "Black", "White"] },
  ]

  const handleAnswer = (answer: string) => {
    setSelectedOption(answer)
    setShowResult(true)

    const isCorrect = answer === colors[currentColor].name
    if (isCorrect) {
      setScore(score + 15)
      updateProgress("colors", 15)
    }

    setTimeout(() => {
      if (currentColor < colors.length - 1) {
        setCurrentColor(currentColor + 1)
        setSelectedOption(null)
        setShowResult(false)
      } else {
        setGameComplete(true)
        updateProgress("colors", 0, true)
      }
    }, 1500)
  }

  const restartGame = () => {
    setCurrentColor(0)
    setScore(0)
    setSelectedOption(null)
    setShowResult(false)
    setGameComplete(false)
  }

  const current = colors[currentColor]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-4 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🌈</div>
            <CardTitle className="text-3xl text-green-600">{t("gameComplete")}</CardTitle>
            <CardDescription className="text-xl">
              {t("score")}: {score}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={restartGame} className="w-full" size="lg">
              {t("restart")}
            </Button>
            <Button onClick={onBack} variant="outline" className="w-full" size="lg">
              {t("back")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
          <div className="text-xl font-bold">
            {t("score")}: {score}
          </div>
          <div className="text-sm text-gray-600">
            {currentColor + 1} / {colors.length}
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">What color is this?</CardTitle>
            <div
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
              style={{ backgroundColor: current.color }}
            />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {current.options.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  variant={
                    showResult
                      ? option === current.name
                        ? "default"
                        : selectedOption === option
                          ? "destructive"
                          : "outline"
                      : "outline"
                  }
                  className="text-lg py-6 touch-manipulation"
                  size="lg"
                >
                  {option}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="text-center mt-6">
                <div
                  className={`text-2xl font-bold ${
                    selectedOption === current.name ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {selectedOption === current.name ? t("correct") : t("incorrect")}
                </div>
                {selectedOption === current.name && <div className="text-4xl mt-2">🎨</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
