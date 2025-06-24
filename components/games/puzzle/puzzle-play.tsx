"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import { ArrowLeft } from "lucide-react"

interface PuzzlePlayScreenProps {
  onBack: () => void
}

export default function PuzzlePlayScreen({ onBack }: PuzzlePlayScreenProps) {
  const { t } = useLanguage()
  const { updateProgress } = useProgress()
  const [score, setScore] = useState(0)
  const [puzzle, setPuzzle] = useState(generatePuzzle())
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  function generatePuzzle() {
    const numbers = Array.from({ length: 8 }, (_, i) => i + 1)
    numbers.push(0) // Empty space

    // Shuffle array with solvable configuration
    for (let i = 0; i < 100; i++) {
      const emptyIndex = numbers.indexOf(0)
      const validMoves = getValidMoves(emptyIndex)
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]

      // Swap empty space with random valid position
      ;[numbers[emptyIndex], numbers[randomMove]] = [numbers[randomMove], numbers[emptyIndex]]
    }

    return numbers
  }

  function getValidMoves(emptyIndex: number) {
    const moves = []

    // Left
    if (emptyIndex % 3 !== 0) moves.push(emptyIndex - 1)
    // Right
    if (emptyIndex % 3 !== 2) moves.push(emptyIndex + 1)
    // Up
    if (emptyIndex >= 3) moves.push(emptyIndex - 3)
    // Down
    if (emptyIndex < 6) moves.push(emptyIndex + 3)

    return moves
  }

  const handleTileClick = (index: number) => {
    if (gameComplete) return

    const emptyIndex = puzzle.indexOf(0)
    const validMoves = getValidMoves(emptyIndex)

    if (validMoves.includes(index)) {
      const newPuzzle = [...puzzle]
      newPuzzle[emptyIndex] = newPuzzle[index]
      newPuzzle[index] = 0
      setPuzzle(newPuzzle)
      setMoves(moves + 1)

      // Check if solved
      const isSolved = newPuzzle.slice(0, 8).every((num, i) => num === i + 1)
      if (isSolved) {
        const points = Math.max(100 - moves, 10) // More points for fewer moves
        setScore(score + points)
        updateProgress("puzzle", points, true)
        setGameComplete(true)
      }
    }
  }

  const restartGame = () => {
    setPuzzle(generatePuzzle())
    setMoves(0)
    setGameComplete(false)
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🧩</div>
            <CardTitle className="text-3xl text-green-600">{t("gameComplete")}</CardTitle>
            <CardDescription className="text-xl">
              {t("score")}: {score} | Moves: {moves}
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
          <div className="text-xl font-bold">
            {t("score")}: {score}
          </div>
          <div className="text-sm text-gray-600">Moves: {moves}</div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">Arrange numbers 1-8 in order!</CardTitle>
            <CardDescription>Tap tiles next to the empty space to move them</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
              {puzzle.map((number, index) => (
                <div
                  key={index}
                  onClick={() => handleTileClick(index)}
                  className={`
                    aspect-square flex items-center justify-center text-2xl font-bold rounded-lg cursor-pointer transition-all touch-manipulation
                    ${
                      number === 0
                        ? "bg-gray-200"
                        : "bg-gradient-to-br from-purple-400 to-purple-600 text-white hover:scale-105 active:scale-95"
                    }
                  `}
                >
                  {number !== 0 && number}
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button onClick={restartGame} variant="outline" className="touch-manipulation">
                New Puzzle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
