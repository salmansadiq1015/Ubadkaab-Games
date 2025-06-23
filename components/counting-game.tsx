"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, RefreshCw } from "lucide-react"
import { type Language, getTranslation } from "@/lib/translations"

interface CountingGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
  language: Language
}

export default function CountingGame({ onScore, playSound, onBack, language }: CountingGameProps) {
  const objects = ["🍎", "🐶", "⭐", "🌸", "🚗", "🎈", "🍪", "🦋"]
  const [currentNumber, setCurrentNumber] = useState(1)
  const [displayObjects, setDisplayObjects] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)

  useEffect(() => {
    generateQuestion()
  }, [currentNumber])

  const generateQuestion = () => {
    const randomObject = objects[Math.floor(Math.random() * objects.length)]
    const objectArray = Array(currentNumber).fill(randomObject)
    setDisplayObjects(objectArray)
    setSelectedAnswer(null)
    setShowFeedback(null)
  }

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer)
    playSound("click")

    if (answer === currentNumber) {
      playSound("success")
      setScore(score + 10)
      onScore(10)
      setShowFeedback("correct")

      setTimeout(() => {
        if (currentNumber >= 10) {
          playSound("complete")
          setLevel(level + 1)
          setCurrentNumber(1)
        } else {
          setCurrentNumber(currentNumber + 1)
        }
      }, 1500)
    } else {
      playSound("wrong")
      setShowFeedback("wrong")
      setTimeout(() => {
        setShowFeedback(null)
      }, 1500)
    }
  }

  const resetGame = () => {
    setCurrentNumber(1)
    setScore(0)
    setLevel(1)
    setSelectedAnswer(null)
    setShowFeedback(null)
    generateQuestion()
    playSound("click")
  }

  const answerOptions = [currentNumber, currentNumber + 1, currentNumber - 1, currentNumber + 2]
    .filter((n) => n > 0 && n <= 10)
    .sort(() => Math.random() - 0.5)

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gradient-to-br from-emerald-200 via-teal-200 to-cyan-200 p-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {getTranslation(language, "backToMenu")}
          </Button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-emerald-800 mb-2">
              {getTranslation(language, "numberCounting")}
            </h1>
            <p className="text-lg text-gray-700">{getTranslation(language, "countObjects")}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full px-4 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold">{score}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level Display */}
        <div className="text-center mb-6">
          <div className="bg-white/80 rounded-lg p-2 sm:p-4 inline-block">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {getTranslation(language, "level")} {level}
            </h2>
            <p className="text-gray-600">
              {getTranslation(language, "countingTo")} {Math.min(level * 10, 10)}
            </p>
          </div>
        </div>

        {/* Objects Display */}
        <Card className="mb-8">
          <CardContent className="p-2 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6">
              {getTranslation(language, "howManyObjects")}
            </h3>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 min-h-[200px] items-center">
              {displayObjects.map((obj, index) => (
                <div
                  key={index}
                  className="text-4xl sm:text-6xl animate-bounce"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {obj}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Answer Options */}
        <Card className="mb-6">
          <CardContent className="p-2 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">
              {getTranslation(language, "chooseCorrectNumber")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              {answerOptions.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback !== null}
                  className={`h-16 sm:h-20 text-2xl sm:text-4xl font-bold transition-all ${
                    selectedAnswer === option
                      ? showFeedback === "correct"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : showFeedback === "wrong"
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        {showFeedback && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              {showFeedback === "correct" ? (
                <div className="text-green-600">
                  <div className="text-6xl mb-2">🎉</div>
                  <h3 className="text-xl sm:text-2xl font-bold">{getTranslation(language, "excellent")}</h3>
                  <p>
                    {getTranslation(language, "youCountedCorrectly")} {currentNumber}{" "}
                    {getTranslation(language, "objects")}!
                  </p>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="text-6xl mb-2">🤔</div>
                  <h3 className="text-xl sm:text-2xl font-bold">{getTranslation(language, "tryAgain")}</h3>
                  <p>
                    {getTranslation(language, "countCarefully")} {currentNumber} {getTranslation(language, "objects")}.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={generateQuestion} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            {getTranslation(language, "newObjects")}
          </Button>
          <Button onClick={resetGame} variant="outline" className="bg-white/80">
            🔄 {getTranslation(language, "resetGame")}
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 rounded-lg p-2 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-3 text-center">📚 {getTranslation(language, "howToPlay")}</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• {getTranslation(language, "lookAtObjects")}</li>
            <li>• {getTranslation(language, "countCarefullyOneByOne")}</li>
            <li>• {getTranslation(language, "clickOnNumber")}</li>
            <li>• {getTranslation(language, "completeAllNumbers")}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
