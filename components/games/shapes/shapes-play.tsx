"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import { ArrowLeft } from "lucide-react"

interface ShapesPlayScreenProps {
  onBack: () => void
}

export default function ShapesPlayScreen({ onBack }: ShapesPlayScreenProps) {
  const { t } = useLanguage()
  const { updateProgress } = useProgress()
  const [currentShape, setCurrentShape] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const shapes = [
    {
      name: "Circle",
      svg: (
        <svg viewBox="0 0 100 100" className="w-32 h-32">
          <circle cx="50" cy="50" r="40" fill="#3B82F6" />
        </svg>
      ),
      options: ["Circle", "Square", "Triangle"],
    },
    {
      name: "Square",
      svg: (
        <svg viewBox="0 0 100 100" className="w-32 h-32">
          <rect x="10" y="10" width="80" height="80" fill="#EF4444" />
        </svg>
      ),
      options: ["Circle", "Square", "Triangle"],
    },
    {
      name: "Triangle",
      svg: (
        <svg viewBox="0 0 100 100" className="w-32 h-32">
          <polygon points="50,10 90,90 10,90" fill="#10B981" />
        </svg>
      ),
      options: ["Square", "Triangle", "Circle"],
    },
    {
      name: "Rectangle",
      svg: (
        <svg viewBox="0 0 100 100" className="w-32 h-32">
          <rect x="10" y="25" width="80" height="50" fill="#F59E0B" />
        </svg>
      ),
      options: ["Rectangle", "Circle", "Triangle"],
    },
    {
      name: "Star",
      svg: (
        <svg viewBox="0 0 100 100" className="w-32 h-32">
          <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#8B5CF6" />
        </svg>
      ),
      options: ["Circle", "Star", "Square"],
    },
    {
      name: "Heart",
      svg: (
        <svg viewBox="0 0 100 100" className="w-32 h-32">
          <path
            d="M50,85 C50,85 20,60 20,40 C20,25 30,15 45,15 C47,15 50,20 50,20 C50,20 53,15 55,15 C70,15 80,25 80,40 C80,60 50,85 50,85 Z"
            fill="#EC4899"
          />
        </svg>
      ),
      options: ["Heart", "Circle", "Star"],
    },
  ]

  const handleAnswer = (answer: string) => {
    setSelectedOption(answer)
    setShowResult(true)

    const isCorrect = answer === shapes[currentShape].name
    if (isCorrect) {
      setScore(score + 15)
      updateProgress("shapes", 15)
    }

    setTimeout(() => {
      if (currentShape < shapes.length - 1) {
        setCurrentShape(currentShape + 1)
        setSelectedOption(null)
        setShowResult(false)
      } else {
        setGameComplete(true)
        updateProgress("shapes", 0, true)
      }
    }, 1500)
  }

  const restartGame = () => {
    setCurrentShape(0)
    setScore(0)
    setSelectedOption(null)
    setShowResult(false)
    setGameComplete(false)
  }

  const current = shapes[currentShape]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🔷</div>
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
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
            {currentShape + 1} / {shapes.length}
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">What shape is this?</CardTitle>
            <div className="flex justify-center mb-4">{current.svg}</div>
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
                {selectedOption === current.name && <div className="text-4xl mt-2">🎉</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
