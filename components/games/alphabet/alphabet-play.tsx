"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import { ArrowLeft } from "lucide-react"

interface AlphabetPlayScreenProps {
  onBack: () => void
}

export default function AlphabetPlayScreen({ onBack }: AlphabetPlayScreenProps) {
  const { t } = useLanguage()
  const { updateProgress } = useProgress()
  const [currentLetter, setCurrentLetter] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const letters = [
    { letter: "A", word: "Apple", image: "🍎", options: ["Apple", "Ball", "Cat"] },
    { letter: "B", word: "Ball", image: "⚽", options: ["Apple", "Ball", "Dog"] },
    { letter: "C", word: "Cat", image: "🐱", options: ["Ball", "Cat", "Elephant"] },
    { letter: "D", word: "Dog", image: "🐶", options: ["Cat", "Dog", "Fish"] },
    { letter: "E", word: "Elephant", image: "🐘", options: ["Dog", "Elephant", "Goat"] },
    { letter: "F", word: "Fish", image: "🐟", options: ["Elephant", "Fish", "Goat"] },
    { letter: "G", word: "Goat", image: "🐐", options: ["Fish", "Goat", "Hat"] },
    { letter: "H", word: "Hat", image: "👒", options: ["Goat", "Hat", "Ice"] },
  ]

  const handleAnswer = (answer: string) => {
    setSelectedOption(answer)
    setShowResult(true)

    const isCorrect = answer === letters[currentLetter].word
    if (isCorrect) {
      setScore(score + 10)
      updateProgress("alphabet", 10)
    }

    setTimeout(() => {
      if (currentLetter < letters.length - 1) {
        setCurrentLetter(currentLetter + 1)
        setSelectedOption(null)
        setShowResult(false)
      } else {
        setGameComplete(true)
        updateProgress("alphabet", 0, true)
      }
    }, 1500)
  }

  const restartGame = () => {
    setCurrentLetter(0)
    setScore(0)
    setSelectedOption(null)
    setShowResult(false)
    setGameComplete(false)
  }

  const current = letters[currentLetter]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎉</div>
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
          <div className="text-xl font-bold">
            {t("score")}: {score}
          </div>
          <div className="text-sm text-gray-600">
            {currentLetter + 1} / {letters.length}
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="text-8xl font-bold text-pink-500 mb-4">{current.letter}</div>
            <div className="text-6xl mb-4">{current.image}</div>
            <CardDescription className="text-xl">Which word starts with "{current.letter}"?</CardDescription>
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
                      ? option === current.word
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
                    selectedOption === current.word ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {selectedOption === current.word ? t("correct") : t("incorrect")}
                </div>
                {selectedOption === current.word && <div className="text-4xl mt-2">🎉</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
