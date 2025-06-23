"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Plus } from "lucide-react"
import { useTranslations } from "next-intl"

interface AdditionGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
  language: string
}

export default function AdditionGame({ onScore, playSound, onBack, language }: AdditionGameProps) {
  const [num1, setNum1] = useState(1)
  const [num2, setNum2] = useState(1)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)

  const t = useTranslations("AdditionGame")

  useEffect(() => {
    generateQuestion()
  }, [level])

  const generateQuestion = () => {
    const maxNum = Math.min(level + 2, 10)
    const n1 = Math.floor(Math.random() * maxNum) + 1
    const n2 = Math.floor(Math.random() * maxNum) + 1
    setNum1(n1)
    setNum2(n2)
    setSelectedAnswer(null)
    setShowFeedback(null)
  }

  const correctAnswer = num1 + num2
  const answerOptions = [correctAnswer, correctAnswer + 1, correctAnswer - 1, correctAnswer + 2]
    .filter((n) => n > 0)
    .sort(() => Math.random() - 0.5)

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer)
    playSound("click")

    if (answer === correctAnswer) {
      playSound("success")
      setScore(score + 15)
      onScore(15)
      setShowFeedback("correct")
      setQuestionsAnswered(questionsAnswered + 1)

      setTimeout(() => {
        if (questionsAnswered + 1 >= 5) {
          setLevel(level + 1)
          setQuestionsAnswered(0)
          playSound("complete")
        }
        generateQuestion()
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
    setLevel(1)
    setScore(0)
    setQuestionsAnswered(0)
    generateQuestion()
    playSound("click")
  }

  const renderObjects = (count: number, emoji: string) => {
    return Array(count)
      .fill(emoji)
      .map((obj, index) => (
        <span key={index} className="text-4xl mx-1 animate-pulse" style={{ animationDelay: `${index * 0.1}s` }}>
          {obj}
        </span>
      ))
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-amber-200 via-orange-200 to-yellow-200 p-4 ${language === "ar" ? "rtl" : ""}`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToMenu")}
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-amber-800 mb-2">{t("title")}</h1>
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
                className="bg-amber-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((questionsAnswered + 1) / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Math Problem Display */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-8">{t("solve")}</h3>

              {/* Visual representation */}
              <div className="mb-8">
                <div className="flex justify-center items-center mb-4">
                  <div className="bg-blue-100 rounded-lg p-4 mx-2">{renderObjects(num1, "🟦")}</div>
                  <Plus className="w-8 h-8 text-gray-600 mx-4" />
                  <div className="bg-red-100 rounded-lg p-4 mx-2">{renderObjects(num2, "🟥")}</div>
                  <span className="text-4xl mx-4">=</span>
                  <span className="text-4xl">❓</span>
                </div>
              </div>

              {/* Number equation */}
              <div className="text-8xl font-bold text-gray-800 mb-6">
                <span className="text-blue-600">{num1}</span>
                <span className="text-gray-600 mx-4">+</span>
                <span className="text-red-600">{num2}</span>
                <span className="text-gray-600 mx-4">=</span>
                <span className="text-green-600">?</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer Options */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 text-center">{t("chooseAnswer")}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {answerOptions.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback !== null}
                  className={`h-20 text-4xl font-bold transition-all ${
                    selectedAnswer === option
                      ? showFeedback === "correct"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : showFeedback === "wrong"
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-amber-500 hover:bg-amber-600 text-white"
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
                  <h3 className="text-2xl font-bold">{t("perfect")}!</h3>
                  <p>
                    {num1} + {num2} = {correctAnswer}
                  </p>
                  <div className="mt-4">{renderObjects(correctAnswer, "⭐")}</div>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="text-6xl mb-2">🤔</div>
                  <h3 className="text-2xl font-bold">{t("notQuite")}!</h3>
                  <p>
                    {t("tryCounting")}: {num1} + {num2} = {correctAnswer}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={generateQuestion} className="bg-amber-600 hover:bg-amber-700 text-white">
            {t("newProblem")}
          </Button>
          <Button onClick={resetGame} variant="outline" className="bg-white/80">
            {t("resetGame")}
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-center">{t("howToPlay")}</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• {t("instruction1")}</li>
            <li>• {t("instruction2")}</li>
            <li>• {t("instruction3")}</li>
            <li>• {t("instruction4")}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
