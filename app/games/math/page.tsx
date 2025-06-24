"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAudio } from "@/contexts/audio-context"
import { useUser } from "@/contexts/user-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Plus, Minus, X } from "lucide-react"
import Link from "next/link"

type Operation = "addition" | "subtraction" | "multiplication"

interface Question {
  num1: number
  num2: number
  operation: Operation
  answer: number
}

export default function MathGame() {
  const { t } = useLanguage()
  const { playSound } = useAudio()
  const { updateScore } = useUser()
  const [currentOperation, setCurrentOperation] = useState<Operation>("addition")
  const [question, setQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)

  const generateQuestion = (operation: Operation, level: number): Question => {
    let num1: number, num2: number, answer: number

    const maxNum = Math.min(10 + level * 2, 20)

    switch (operation) {
      case "addition":
        num1 = Math.floor(Math.random() * maxNum) + 1
        num2 = Math.floor(Math.random() * maxNum) + 1
        answer = num1 + num2
        break
      case "subtraction":
        num1 = Math.floor(Math.random() * maxNum) + 1
        num2 = Math.floor(Math.random() * num1) + 1
        answer = num1 - num2
        break
      case "multiplication":
        num1 = Math.floor(Math.random() * Math.min(level + 2, 10)) + 1
        num2 = Math.floor(Math.random() * Math.min(level + 2, 10)) + 1
        answer = num1 * num2
        break
    }

    return { num1, num2, operation, answer }
  }

  const getOperationSymbol = (operation: Operation) => {
    switch (operation) {
      case "addition":
        return "+"
      case "subtraction":
        return "-"
      case "multiplication":
        return "×"
    }
  }

  const getOperationIcon = (operation: Operation) => {
    switch (operation) {
      case "addition":
        return Plus
      case "subtraction":
        return Minus
      case "multiplication":
        return X
    }
  }

  useEffect(() => {
    setQuestion(generateQuestion(currentOperation, level))
  }, [currentOperation, level])

  const handleSubmit = () => {
    if (!question || !userAnswer) return

    const isCorrect = Number.parseInt(userAnswer) === question.answer

    if (isCorrect) {
      playSound("correct")
      setScore((prev) => prev + 10 * level)
      setStreak((prev) => prev + 1)
      setFeedback(t("correct"))

      // Level up every 5 correct answers
      if (streak > 0 && (streak + 1) % 5 === 0) {
        setLevel((prev) => prev + 1)
      }
    } else {
      playSound("wrong")
      setStreak(0)
      setFeedback(t("tryAgain"))
    }

    setTimeout(() => {
      setFeedback(null)
      setUserAnswer("")
      setQuestion(generateQuestion(currentOperation, level))
    }, 1500)
  }

  const handleRestart = () => {
    playSound("click")
    setScore(0)
    setLevel(1)
    setStreak(0)
    setUserAnswer("")
    setFeedback(null)
    setQuestion(generateQuestion(currentOperation, 1))
  }

  const handleOperationChange = (operation: Operation) => {
    playSound("click")
    setCurrentOperation(operation)
    setUserAnswer("")
    setFeedback(null)
  }

  useEffect(() => {
    updateScore("math", score, level)
  }, [score, level, updateScore])

  if (!question) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("back")}
            </Button>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-full px-4 py-2 shadow-lg">
              <span className="font-bold text-gray-800">
                {t("score")}: {score}
              </span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow-lg">
              <span className="font-bold text-gray-800">
                {t("level")}: {level}
              </span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow-lg">
              <span className="font-bold text-gray-800">Streak: {streak}</span>
            </div>
            <Button onClick={handleRestart} variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("restart")}
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
            🔢 {t("math")} 🔢
          </h1>
          <p className="text-xl text-gray-600">Solve math problems and improve your skills!</p>
        </div>

        {/* Operation Selector */}
        <div className="flex justify-center space-x-4 mb-8">
          {(["addition", "subtraction", "multiplication"] as Operation[]).map((operation) => {
            const Icon = getOperationIcon(operation)
            return (
              <Button
                key={operation}
                onClick={() => handleOperationChange(operation)}
                className={`${
                  currentOperation === operation
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } font-bold rounded-full px-6 py-3 shadow-lg transition-all duration-300`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {t(operation)}
              </Button>
            )
          })}
        </div>

        {/* Question Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="text-6xl font-bold text-gray-800 mb-8">
                {question.num1} {getOperationSymbol(question.operation)} {question.num2} = ?
              </div>

              <div className="mb-6">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="text-4xl font-bold text-center border-4 border-gray-300 rounded-2xl px-6 py-4 w-48 focus:border-yellow-500 focus:outline-none"
                  placeholder="?"
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>

              <Button onClick={handleSubmit} disabled={!userAnswer} className="kid-button text-2xl px-8 py-4">
                Check Answer
              </Button>

              {/* Feedback */}
              {feedback && (
                <div
                  className={`mt-6 text-2xl font-bold ${feedback === t("correct") ? "text-green-600" : "text-red-600"}`}
                >
                  {feedback}
                  {feedback === t("correct") && " 🎉"}
                  {feedback === t("tryAgain") && ` (Answer: ${question.answer})`}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicators */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <div className="bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((streak / 5) * 100, 100)}%` }}
              />
            </div>
            <p className="text-center mt-2 font-bold text-gray-700">{streak}/5 correct answers to next level</p>
          </div>
        </div>
      </main>
    </div>
  )
}
