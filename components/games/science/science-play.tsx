"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import { ArrowLeft } from "lucide-react"

interface SciencePlayScreenProps {
  onBack: () => void
}

export default function SciencePlayScreen({ onBack }: SciencePlayScreenProps) {
  const { t } = useLanguage()
  const { updateProgress } = useProgress()
  const [score, setScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const questions = [
    {
      question: "What do plants need to make food?",
      emoji: "🌱",
      options: ["Sunlight", "Darkness", "Cold water"],
      correct: "Sunlight",
    },
    {
      question: "How many legs does a spider have?",
      emoji: "🕷️",
      options: ["6", "8", "10"],
      correct: "8",
    },
    {
      question: "What is the largest planet in our solar system?",
      emoji: "🪐",
      options: ["Earth", "Jupiter", "Mars"],
      correct: "Jupiter",
    },
    {
      question: "What do we call baby frogs?",
      emoji: "🐸",
      options: ["Tadpoles", "Puppies", "Kittens"],
      correct: "Tadpoles",
    },
    {
      question: "How many hearts does an octopus have?",
      emoji: "🐙",
      options: ["1", "2", "3"],
      correct: "3",
    },
    {
      question: "What gas do plants produce?",
      emoji: "🌿",
      options: ["Carbon dioxide", "Oxygen", "Nitrogen"],
      correct: "Oxygen",
    },
  ]

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)

    const isCorrect = answer === questions[currentQuestion].correct
    if (isCorrect) {
      setScore(score + 15)
      updateProgress("science", 15)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setGameComplete(true)
        updateProgress("science", 0, true)
      }
    }, 2000)
  }

  const restartGame = () => {
    setScore(0)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setGameComplete(false)
  }

  const current = questions[currentQuestion]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-100 p-4 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🔬</div>
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
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-100 p-4">
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
            {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">{current.emoji}</div>
            <CardTitle className="text-2xl mb-4">{current.question}</CardTitle>
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
                      ? option === current.correct
                        ? "default"
                        : selectedAnswer === option
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
                    selectedAnswer === current.correct ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {selectedAnswer === current.correct ? t("correct") : t("incorrect")}
                </div>
                {selectedAnswer === current.correct && <div className="text-4xl mt-2">🧪</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
