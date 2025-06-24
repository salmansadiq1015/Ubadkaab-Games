"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import { ArrowLeft } from "lucide-react"

interface QuizPlayScreenProps {
  onBack: () => void
}

export default function QuizPlayScreen({ onBack }: QuizPlayScreenProps) {
  const { t } = useLanguage()
  const { updateProgress } = useProgress()
  const [score, setScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const questions = [
    {
      question: "What color do you get when you mix red and yellow?",
      emoji: "🎨",
      options: ["Orange", "Purple", "Green"],
      correct: "Orange",
    },
    {
      question: "How many days are in a week?",
      emoji: "📅",
      options: ["5", "7", "10"],
      correct: "7",
    },
    {
      question: "What animal says 'moo'?",
      emoji: "🐄",
      options: ["Dog", "Cat", "Cow"],
      correct: "Cow",
    },
    {
      question: "What do bees make?",
      emoji: "🐝",
      options: ["Milk", "Honey", "Cheese"],
      correct: "Honey",
    },
    {
      question: "How many wheels does a bicycle have?",
      emoji: "🚲",
      options: ["2", "3", "4"],
      correct: "2",
    },
    {
      question: "What do we use to write on paper?",
      emoji: "✏️",
      options: ["Spoon", "Pencil", "Hammer"],
      correct: "Pencil",
    },
  ]

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)

    const isCorrect = answer === questions[currentQuestion].correct
    if (isCorrect) {
      setScore(score + 20)
      updateProgress("quiz", 20)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setGameComplete(true)
        updateProgress("quiz", 0, true)
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
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 p-4 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🧠</div>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 p-4">
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
                {selectedAnswer === current.correct && <div className="text-4xl mt-2">🎉</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
