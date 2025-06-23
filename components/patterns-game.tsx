"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, RefreshCw } from "lucide-react"
import { useTranslations } from "next-intl"

interface PatternsGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
  language: string
}

export default function PatternsGame({ onScore, playSound, onBack, language }: PatternsGameProps) {
  const t = useTranslations("PatternsGame")

  const colors = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠"]
  const shapes = ["⭐", "❤️", "🔶", "🔺", "⚫", "🟦"]

  const [currentPattern, setCurrentPattern] = useState<string[]>([])
  const [patternOptions, setPatternOptions] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)

  useEffect(() => {
    generatePattern()
  }, [level])

  const generatePattern = () => {
    const patternLength = Math.min(3 + level, 6)
    const useShapes = Math.random() > 0.5
    const items = useShapes ? shapes : colors

    // Create a simple repeating pattern
    const basePattern = items.slice(0, 2 + Math.floor(level / 2))
    const pattern = []

    for (let i = 0; i < patternLength; i++) {
      pattern.push(basePattern[i % basePattern.length])
    }

    // Remove the last item to create the question
    const correctAnswer = pattern[pattern.length - 1]
    const questionPattern = pattern.slice(0, -1)

    setCurrentPattern(questionPattern)

    // Create options including the correct answer
    const wrongOptions = items
      .filter((item) => item !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5)
    setPatternOptions(allOptions)

    setSelectedAnswer(null)
    setShowFeedback(null)
  }

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    playSound("click")

    // Reconstruct the full pattern to check the answer
    const fullPattern = [...currentPattern, answer]
    const isCorrect = checkPatternCorrectness(fullPattern)

    if (isCorrect) {
      playSound("success")
      setScore(score + 25)
      onScore(25)
      setShowFeedback("correct")
      setQuestionsAnswered(questionsAnswered + 1)

      setTimeout(() => {
        if (questionsAnswered + 1 >= 5) {
          setLevel(level + 1)
          setQuestionsAnswered(0)
          playSound("complete")
        }
        generatePattern()
      }, 2000)
    } else {
      playSound("wrong")
      setShowFeedback("wrong")
      setTimeout(() => {
        setShowFeedback(null)
      }, 2000)
    }
  }

  const checkPatternCorrectness = (pattern: string[]): boolean => {
    if (pattern.length < 3) return true

    // Check if it follows a simple repeating pattern
    for (let patternLength = 2; patternLength <= Math.floor(pattern.length / 2); patternLength++) {
      let isValidPattern = true
      for (let i = patternLength; i < pattern.length; i++) {
        if (pattern[i] !== pattern[i % patternLength]) {
          isValidPattern = false
          break
        }
      }
      if (isValidPattern) return true
    }

    return false
  }

  const getCorrectAnswer = (): string => {
    const patternLength = Math.min(3 + level, 6)
    const useShapes = currentPattern.length > 0 && shapes.includes(currentPattern[0])
    const items = useShapes ? shapes : colors

    const basePattern = items.slice(0, 2 + Math.floor(level / 2))
    const fullPattern = []

    for (let i = 0; i < patternLength; i++) {
      fullPattern.push(basePattern[i % basePattern.length])
    }

    return fullPattern[fullPattern.length - 1]
  }

  const resetGame = () => {
    setLevel(1)
    setScore(0)
    setQuestionsAnswered(0)
    generatePattern()
    playSound("click")
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-4"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToMenu")}
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-indigo-800 mb-2">{t("title")}</h1>
            <p className="text-lg text-gray-700">{t("subtitle")}</p>
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

        {/* Level Progress */}
        <div className="text-center mb-6">
          <div className="bg-white/80 rounded-lg p-4 inline-block">
            <h2 className="text-2xl font-bold text-gray-800">
              {t("level")} {level}
            </h2>
            <p className="text-gray-600">
              {t("question")} {questionsAnswered + 1} {t("of")} 5
            </p>
            <div className="w-48 bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((questionsAnswered + 1) / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pattern Display */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-6">{t("patternQuestion")}</h3>
            <div className="flex justify-center items-center gap-4 mb-6 flex-wrap">
              {currentPattern.map((item, index) => (
                <div key={index} className="text-6xl animate-pulse" style={{ animationDelay: `${index * 0.2}s` }}>
                  {item}
                </div>
              ))}
              <div className="text-6xl text-gray-400 border-4 border-dashed border-gray-400 rounded-lg w-20 h-20 flex items-center justify-center">
                ?
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer Options */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 text-center">{t("chooseNext")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {patternOptions.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback !== null}
                  className={`h-20 text-4xl transition-all ${
                    selectedAnswer === option
                      ? showFeedback === "correct"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : showFeedback === "wrong"
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-indigo-500 hover:bg-indigo-600 text-white"
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
                  <h3 className="text-2xl font-bold">{t("perfectPattern")}</h3>
                  <p>{t("correctPiece")}</p>
                  <div className="mt-4 flex justify-center items-center gap-2">
                    {[...currentPattern, selectedAnswer!].map((item, index) => (
                      <span key={index} className="text-3xl">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="text-6xl mb-2">🤔</div>
                  <h3 className="text-2xl font-bold">{t("tryAgain")}</h3>
                  <p>
                    {t("correctAnswerIs")} {getCorrectAnswer()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={generatePattern} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("newPattern")}
          </Button>
          <Button onClick={resetGame} variant="outline" className="bg-white/80">
            🎯 {t("resetGame")}
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-center">📚 {t("howToPlay")}</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• {t("instruction1")}</li>
            <li>• {t("instruction2")}</li>
            <li>• {t("instruction3")}</li>
            <li>• {t("instruction4")}</li>
            <li>• {t("instruction5")}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
