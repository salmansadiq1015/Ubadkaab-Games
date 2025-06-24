"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import { ArrowLeft } from "lucide-react"

interface AnimalsPlayScreenProps {
  onBack: () => void
}

export default function AnimalsPlayScreen({ onBack }: AnimalsPlayScreenProps) {
  const { t } = useLanguage()
  const { updateProgress } = useProgress()
  const [currentAnimal, setCurrentAnimal] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const animals = [
    {
      name: "Lion",
      emoji: "🦁",
      sound: "Roar",
      options: ["Roar", "Meow", "Bark"],
      fact: "Lions are called the king of the jungle!",
    },
    {
      name: "Elephant",
      emoji: "🐘",
      sound: "Trumpet",
      options: ["Trumpet", "Chirp", "Hiss"],
      fact: "Elephants never forget!",
    },
    {
      name: "Dog",
      emoji: "🐶",
      sound: "Bark",
      options: ["Meow", "Bark", "Moo"],
      fact: "Dogs are man's best friend!",
    },
    {
      name: "Cat",
      emoji: "🐱",
      sound: "Meow",
      options: ["Bark", "Meow", "Roar"],
      fact: "Cats can sleep up to 16 hours a day!",
    },
    {
      name: "Cow",
      emoji: "🐄",
      sound: "Moo",
      options: ["Moo", "Baa", "Oink"],
      fact: "Cows give us milk!",
    },
    {
      name: "Duck",
      emoji: "🦆",
      sound: "Quack",
      options: ["Quack", "Tweet", "Hoot"],
      fact: "Ducks can swim, walk, and fly!",
    },
  ]

  const handleAnswer = (answer: string) => {
    setSelectedOption(answer)
    setShowResult(true)

    const isCorrect = answer === animals[currentAnimal].sound
    if (isCorrect) {
      setScore(score + 15)
      updateProgress("animals", 15)
    }

    setTimeout(() => {
      if (currentAnimal < animals.length - 1) {
        setCurrentAnimal(currentAnimal + 1)
        setSelectedOption(null)
        setShowResult(false)
      } else {
        setGameComplete(true)
        updateProgress("animals", 0, true)
      }
    }, 2000)
  }

  const restartGame = () => {
    setCurrentAnimal(0)
    setScore(0)
    setSelectedOption(null)
    setShowResult(false)
    setGameComplete(false)
  }

  const current = animals[currentAnimal]

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-green-100 p-4 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🐾</div>
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-green-100 p-4">
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
            {currentAnimal + 1} / {animals.length}
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="text-8xl mb-4">{current.emoji}</div>
            <CardTitle className="text-2xl mb-4">What sound does a {current.name} make?</CardTitle>
            <CardDescription className="text-sm text-gray-600">{current.fact}</CardDescription>
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
                      ? option === current.sound
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
                    selectedOption === current.sound ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {selectedOption === current.sound ? t("correct") : t("incorrect")}
                </div>
                {selectedOption === current.sound && <div className="text-4xl mt-2">🎉</div>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
