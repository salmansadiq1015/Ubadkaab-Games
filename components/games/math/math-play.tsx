"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import { ArrowLeft } from "lucide-react"

interface MathPlayScreenProps {
  onBack: () => void
}

export default function MathPlayScreen({ onBack }: MathPlayScreenProps) {
  const { t } = useLanguage()
  const { updateProgress } = useProgress()
  const [score, setScore] = useState(0)
  const [currentProblem, setCurrentProblem] = useState(generateProblem())
  const [userAnswer, setUserAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [problemCount, setProblemCount] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  function generateProblem() {
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * 10) + 1
    const operations = ["+", "-", "×"]
    const operation = operations[Math.floor(Math.random() * operations.length)]

    let answer: number
    let displayA = a
    let displayB = b

    switch (operation) {
      case "+":
        answer = a + b
        break
      case "-":
        // Ensure positive result
        if (a < b) {
          displayA = b
          displayB = a
        }
        answer = Math.abs(displayA - displayB)
        break
      case "×":
        // Keep numbers smaller for multiplication
        displayA = Math.floor(Math.random() * 5) + 1
        displayB = Math.floor(Math.random() * 5) + 1
        answer = displayA * displayB
        break
      default:
        answer = a + b
    }

    return { a: displayA, b: displayB, operation, answer }
  }

  const handleSubmit = () => {
    const correct = Number.parseInt(userAnswer) === currentProblem.answer
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      setScore(score + 10)
      updateProgress("math", 10)
    }

    setTimeout(() => {
      if (problemCount < 9) {
        setCurrentProblem(generateProblem())
        setUserAnswer("")
        setShowResult(false)
        setProblemCount(problemCount + 1)
      } else {
        setGameComplete(true)
        updateProgress("math", 0, true)
      }
    }, 1500)
  }

  const restartGame = () => {
    setScore(0)
    setCurrentProblem(generateProblem())
    setUserAnswer("")
    setShowResult(false)
    setProblemCount(0)
    setGameComplete(false)
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 p-4 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🧮</div>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
          <div className="text-xl font-bold">
            {t("score")}: {score}
          </div>
          <div className="text-sm text-gray-600">{problemCount + 1} / 10</div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl mb-4">{t("mathGame")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-blue-600 mb-6">
                {currentProblem.a} {currentProblem.operation} {currentProblem.b} = ?
              </div>

              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="text-4xl text-center border-2 border-blue-300 rounded-lg p-4 w-32 touch-manipulation"
                disabled={showResult}
                placeholder="?"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!userAnswer || showResult}
              className="w-full text-xl py-6 touch-manipulation"
              size="lg"
            >
              {t("submit")}
            </Button>

            {showResult && (
              <div className="text-center mt-6">
                <div className={`text-2xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {isCorrect ? t("correct") : `${t("incorrect")} ${currentProblem.answer}`}
                </div>
                {isCorrect && <div className="text-4xl mt-2">🎉</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
