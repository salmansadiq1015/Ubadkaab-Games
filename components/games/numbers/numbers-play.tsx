"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import { ArrowLeft } from "lucide-react"

interface NumbersPlayScreenProps {
  onBack: () => void
}

export default function NumbersPlayScreen({ onBack }: NumbersPlayScreenProps) {
  const { t } = useLanguage()
  const { updateProgress } = useProgress()
  const [currentNumber, setCurrentNumber] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const numbers = [
    {
      count: 1,
      emoji: "🍎",
      options: ["1", "2", "3"],
    },
    {
      count: 2,
      emoji: "🐶",
      options: ["1", "2", "3"],
    },
    {
      count: 3,
      emoji: "⭐",
      options: ["2", "3", "4"],
    },
    {
      count: 4,
      emoji: "🌸",
      options: ["3", "4", "5"],
    },
    {
      count: 5,
      emoji: "🎈",
      options: ["4", "5", "6"],
    },
    {
      count: 6,
      emoji: "🍓",
      options: ["5", "6", "7"],
    },
  ]

  const handleAnswer = (answer: string) => {
    setSelectedOption(answer)
    setShowResult(true)

    const isCorrect = answer === numbers[currentNumber].count.toString()
    if (isCorrect) {
      setScore(score + 10)
      updateProgress("numbers", 10)
    }

    setTimeout(() => {
      if (currentNumber < numbers.length - 1) {
        setCurrentNumber(currentNumber + 1)
        setSelectedOption(null)
        setShowResult(false)
      } else {
        setGameComplete(true)
        updateProgress("numbers", 0, true)
      }
    }, 1500)
  }

  const restartGame = () => {
    setCurrentNumber(0)
    setScore(0)
    setSelectedOption(null)
    setShowResult(false)
    setGameComplete(false)
  }

  const current = numbers[currentNumber]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-blue-100 p-4 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🔢</div>
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-blue-100 p-4">
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
            {currentNumber + 1} / {numbers.length}
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">How many do you see?</CardTitle>
            <div className="text-6xl mb-4 flex justify-center flex-wrap gap-2">
              {Array.from({ length: current.count }, (_, i) => (
                <span key={i}>{current.emoji}</span>
              ))}
            </div>
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
                      ? option === current.count.toString()
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
                    selectedOption === current.count.toString() ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {selectedOption === current.count.toString() ? t("correct") : t("incorrect")}
                </div>
                {selectedOption === current.count.toString() && <div className="text-4xl mt-2">🎉</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
