"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { useTranslations } from "next-intl"

interface ShapesGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
  language: string
}

export default function ShapesGame({ onScore, playSound, onBack, language }: ShapesGameProps) {
  const t = useTranslations("ShapesGame")

  const shapes = [
    { name: "Circle", emoji: "🔴", color: "red", description: "Round with no corners" },
    { name: "Square", emoji: "🟦", color: "blue", description: "4 equal sides and corners" },
    { name: "Triangle", emoji: "🔺", color: "red", description: "3 sides and 3 corners" },
    { name: "Rectangle", emoji: "🟩", color: "green", description: "4 sides, opposite sides equal" },
    { name: "Star", emoji: "⭐", color: "yellow", description: "5 pointed star shape" },
    { name: "Heart", emoji: "❤️", color: "red", description: "Heart shape for love" },
    { name: "Diamond", emoji: "🔶", color: "orange", description: "4 sides like a tilted square" },
    { name: "Oval", emoji: "🥚", color: "white", description: "Like a stretched circle" },
  ]

  const [currentShape, setCurrentShape] = useState(0)
  const [gameMode, setGameMode] = useState<"learn" | "quiz">("learn")
  const [quizOptions, setQuizOptions] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)
  const [completedShapes, setCompletedShapes] = useState<string[]>([])

  useEffect(() => {
    if (gameMode === "quiz") {
      generateQuizQuestion()
    }
  }, [currentShape, gameMode])

  const generateQuizQuestion = () => {
    const correct = shapes[currentShape]
    const wrongOptions = shapes
      .filter((shape) => shape.name !== correct.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5).map((shape) => shape.name)

    setQuizOptions(allOptions)
    setSelectedAnswer(null)
    setShowFeedback(null)
  }

  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    playSound("click")

    const correctAnswer = shapes[currentShape].name

    if (answer === correctAnswer) {
      playSound("success")
      setScore(score + 20)
      onScore(20)
      setShowFeedback("correct")

      if (!completedShapes.includes(correctAnswer)) {
        setCompletedShapes([...completedShapes, correctAnswer])
      }

      setTimeout(() => {
        if (currentShape < shapes.length - 1) {
          setCurrentShape(currentShape + 1)
        } else {
          playSound("complete")
          alert(t("congratulations"))
          setCurrentShape(0)
        }
      }, 2000)
    } else {
      playSound("wrong")
      setShowFeedback("wrong")
      setTimeout(() => {
        setShowFeedback(null)
      }, 2000)
    }
  }

  const nextShape = () => {
    if (currentShape < shapes.length - 1) {
      setCurrentShape(currentShape + 1)
      playSound("click")
    }
  }

  const previousShape = () => {
    if (currentShape > 0) {
      setCurrentShape(currentShape - 1)
      playSound("click")
    }
  }

  const toggleMode = () => {
    setGameMode(gameMode === "learn" ? "quiz" : "learn")
    setShowFeedback(null)
    setSelectedAnswer(null)
    playSound("click")
  }

  const currentShapeData = shapes[currentShape]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-violet-200 via-purple-200 to-indigo-200 p-4 ${language === "ar" ? "rtl" : ""}`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToMenu")}
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-violet-800 mb-2">{t("shapeRecognition")}</h1>
            <p className="text-lg text-gray-700">{t("learnShapes")}</p>
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

        {/* Mode Toggle */}
        <div className="text-center mb-6">
          <Button
            onClick={toggleMode}
            className={`px-8 py-3 text-lg font-bold ${
              gameMode === "learn" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {gameMode === "learn" ? t("learningMode") : t("quizMode")}
          </Button>
          <p className="text-sm text-gray-600 mt-2">
            {gameMode === "learn" ? t("switchToQuiz") : t("switchToLearning")}
          </p>
        </div>

        {gameMode === "learn" ? (
          /* Learning Mode */
          <>
            <Card className="mb-8">
              <CardContent className="p-8 text-center">
                <div className="text-9xl mb-6">{currentShapeData.emoji}</div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{currentShapeData.name}</h2>
                <p className="text-xl text-gray-600 mb-6">{currentShapeData.description}</p>

                {/* Shape Properties */}
                <div className="bg-gray-100 rounded-lg p-4 inline-block">
                  <h3 className="text-lg font-bold mb-2">{t("shapeProperties")}:</h3>
                  <div className="text-left">
                    {currentShapeData.name === "Circle" && (
                      <ul className="space-y-1">
                        <li>• {t("circleProperty1")}</li>
                        <li>• {t("circleProperty2")}</li>
                        <li>• {t("circleProperty3")}</li>
                      </ul>
                    )}
                    {currentShapeData.name === "Square" && (
                      <ul className="space-y-1">
                        <li>• {t("squareProperty1")}</li>
                        <li>• {t("squareProperty2")}</li>
                        <li>• {t("squareProperty3")}</li>
                      </ul>
                    )}
                    {currentShapeData.name === "Triangle" && (
                      <ul className="space-y-1">
                        <li>• {t("triangleProperty1")}</li>
                        <li>• {t("triangleProperty2")}</li>
                        <li>• {t("triangleProperty3")}</li>
                      </ul>
                    )}
                    {currentShapeData.name === "Rectangle" && (
                      <ul className="space-y-1">
                        <li>• {t("rectangleProperty1")}</li>
                        <li>• {t("rectangleProperty2")}</li>
                        <li>• {t("rectangleProperty3")}</li>
                      </ul>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mb-6">
              <Button
                onClick={previousShape}
                disabled={currentShape === 0}
                className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
              >
                {t("previousShape")}
              </Button>
              <div className="bg-white/80 rounded-lg px-4 py-2 flex items-center">
                <span className="font-bold">
                  {currentShape + 1} / {shapes.length}
                </span>
              </div>
              <Button
                onClick={nextShape}
                disabled={currentShape === shapes.length - 1}
                className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
              >
                {t("nextShape")}
              </Button>
            </div>
          </>
        ) : (
          /* Quiz Mode */
          <>
            <Card className="mb-8">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-6">{t("whatShape")}</h3>
                <div className="text-9xl mb-6">{currentShapeData.emoji}</div>
              </CardContent>
            </Card>

            {/* Quiz Options */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {quizOptions.map((option) => (
                    <Button
                      key={option}
                      onClick={() => handleQuizAnswer(option)}
                      disabled={showFeedback !== null}
                      className={`h-16 text-xl font-bold transition-all ${
                        selectedAnswer === option
                          ? showFeedback === "correct"
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : showFeedback === "wrong"
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          : "bg-violet-500 hover:bg-violet-600 text-white"
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
                      <h3 className="text-2xl font-bold">{t("excellent")}!</h3>
                      <p>
                        {t("thatsA")} {currentShapeData.name}!
                      </p>
                      <p className="text-sm mt-2">{currentShapeData.description}</p>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <div className="text-6xl mb-2">🤔</div>
                      <h3 className="text-2xl font-bold">{t("tryAgain")}!</h3>
                      <p>
                        {t("thisIsA")} {currentShapeData.name}
                      </p>
                      <p className="text-sm mt-2">{currentShapeData.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Progress */}
        <div className="bg-white/80 rounded-lg p-4 mb-6">
          <h3 className="text-xl font-bold mb-3 text-center">📈 {t("shapeProgress")}</h3>
          <div className="grid grid-cols-4 gap-2">
            {shapes.map((shape, index) => (
              <div
                key={shape.name}
                className={`p-3 rounded-lg text-center font-bold cursor-pointer transition-all ${
                  index === currentShape
                    ? "bg-violet-500 text-white"
                    : completedShapes.includes(shape.name)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => {
                  setCurrentShape(index)
                  playSound("click")
                }}
              >
                <div className="text-2xl mb-1">{shape.emoji}</div>
                <div className="text-xs">{shape.name}</div>
                {completedShapes.includes(shape.name) && <div className="text-xs">✓</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-center">📚 {t("howToPlay")}</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              • <strong>{t("learningMode")}:</strong> {t("studyShapes")}
            </li>
            <li>
              • <strong>{t("quizMode")}:</strong> {t("testKnowledge")}
            </li>
            <li>• {t("clickShapes")}</li>
            <li>• {t("completeShapes")}!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
