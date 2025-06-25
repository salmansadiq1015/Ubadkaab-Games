"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAudio } from "@/contexts/audio-context"
import { useUser } from "@/contexts/user-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Shuffle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface PuzzlePiece {
  id: number
  value: string
  correctPosition: number
  currentPosition: number
}

const puzzleImages = [
  {
    id: 1,
    name: "Rainbow",
    pieces: ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣"],
    description: "Arrange the rainbow colors in order!",
  },
  {
    id: 2,
    name: "Animals",
    pieces: ["🐱", "🐶", "🐰", "🐸", "🐧", "🦁"],
    description: "Put the animals in the right spots!",
  },
  { id: 3, name: "Fruits", pieces: ["🍎", "🍌", "🍇", "🍊", "🍓", "🥝"], description: "Match the colorful fruits!" },
  { id: 4, name: "Shapes", pieces: ["⭐", "❤️", "🔺", "🟦", "⚪", "💎"], description: "Sort the shapes correctly!" },
]

export default function PuzzlesGame() {
  const { t } = useLanguage()
  const { playSound } = useAudio()
  const { updateScore } = useUser()
  const [selectedPuzzle, setSelectedPuzzle] = useState<(typeof puzzleImages)[0] | null>(null)
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([])
  const [selectedPiece, setSelectedPiece] = useState<PuzzlePiece | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [isCompleted, setIsCompleted] = useState(false)
  const [moves, setMoves] = useState(0)

  const initializePuzzle = (puzzle: (typeof puzzleImages)[0]) => {
    const pieces: PuzzlePiece[] = puzzle.pieces.map((piece, index) => ({
      id: index,
      value: piece,
      correctPosition: index,
      currentPosition: index,
    }))

    // Shuffle the pieces
    const shuffled = [...pieces].sort(() => Math.random() - 0.5)
    shuffled.forEach((piece, index) => {
      piece.currentPosition = index
    })

    setPuzzlePieces(shuffled)
    setIsCompleted(false)
    setMoves(0)
    setSelectedPiece(null)
  }

  const handlePuzzleSelect = (puzzle: (typeof puzzleImages)[0]) => {
    playSound("click")
    setSelectedPuzzle(puzzle)
    initializePuzzle(puzzle)
  }

  const handlePieceClick = (piece: PuzzlePiece) => {
    playSound("click")

    if (!selectedPiece) {
      // Select this piece
      setSelectedPiece(piece)
    } else if (selectedPiece.id === piece.id) {
      // Deselect if clicking the same piece
      setSelectedPiece(null)
    } else {
      // Swap pieces
      swapPieces(selectedPiece, piece)
      setSelectedPiece(null)
    }
  }

  const handleSlotClick = (targetPosition: number) => {
    if (!selectedPiece) return

    const targetPiece = puzzlePieces.find((p) => p.currentPosition === targetPosition)

    if (targetPiece) {
      swapPieces(selectedPiece, targetPiece)
    } else {
      // Move to empty slot
      const newPieces = [...puzzlePieces]
      const pieceIndex = newPieces.findIndex((p) => p.id === selectedPiece.id)
      newPieces[pieceIndex].currentPosition = targetPosition
      setPuzzlePieces(newPieces)
      setMoves((prev) => prev + 1)
      playSound("click")
      checkCompletion(newPieces)
    }

    setSelectedPiece(null)
  }

  const swapPieces = (piece1: PuzzlePiece, piece2: PuzzlePiece) => {
    const newPieces = [...puzzlePieces]
    const index1 = newPieces.findIndex((p) => p.id === piece1.id)
    const index2 = newPieces.findIndex((p) => p.id === piece2.id)

    // Swap positions
    const temp = newPieces[index1].currentPosition
    newPieces[index1].currentPosition = newPieces[index2].currentPosition
    newPieces[index2].currentPosition = temp

    setPuzzlePieces(newPieces)
    setMoves((prev) => prev + 1)
    playSound("click")

    checkCompletion(newPieces)
  }

  const checkCompletion = (pieces: PuzzlePiece[]) => {
    const isComplete = pieces.every((piece) => piece.correctPosition === piece.currentPosition)
    if (isComplete) {
      setIsCompleted(true)
      const bonusScore = Math.max(100 - moves * 5, 20)
      setScore((prev) => prev + bonusScore)
      updateScore("puzzles", bonusScore, level)
      playSound("correct")
    }
  }

  const handleShuffle = () => {
    if (!selectedPuzzle) return
    playSound("click")
    initializePuzzle(selectedPuzzle)
  }

  const handleRestart = () => {
    playSound("click")
    setSelectedPuzzle(null)
    setPuzzlePieces([])
    setScore(0)
    setLevel(1)
    setIsCompleted(false)
    setMoves(0)
    setSelectedPiece(null)
  }

  const handleNextLevel = () => {
    playSound("click")
    setLevel((prev) => prev + 1)
    const nextPuzzle = puzzleImages[level % puzzleImages.length]
    setSelectedPuzzle(nextPuzzle)
    initializePuzzle(nextPuzzle)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100">
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
            {selectedPuzzle && (
              <div className="bg-white rounded-full px-4 py-2 shadow-lg">
                <span className="font-bold text-gray-800">Moves: {moves}</span>
              </div>
            )}
            <Button onClick={handleRestart} variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("restart")}
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🧩 {t("puzzles")} 🧩
          </h1>
          <p className="text-xl text-gray-600">Solve puzzles by arranging pieces in the correct order!</p>
        </div>

        {!selectedPuzzle ? (
          /* Puzzle Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {puzzleImages.map((puzzle) => (
              <Card
                key={puzzle.id}
                className="cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 bg-white shadow-lg hover:shadow-xl"
                onClick={() => handlePuzzleSelect(puzzle)}
                onTouchStart={(e) => {
                  e.preventDefault()
                  handlePuzzleSelect(puzzle)
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center space-x-2 mb-4">
                    {puzzle.pieces.slice(0, 3).map((piece, index) => (
                      <div key={index} className="text-3xl">
                        {piece}
                      </div>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{puzzle.name}</h3>
                  <p className="text-gray-600 text-sm">{puzzle.description}</p>
                  <div className="mt-4">
                    <span className="kid-button inline-block">{t("play")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Puzzle Game */
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-2xl mb-6">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedPuzzle.name} Puzzle</h2>
                  <p className="text-gray-600">{selectedPuzzle.description}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    👆 Tap a piece to select it, then tap where you want to move it!
                  </p>
                </div>

                {/* Puzzle Grid */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6 max-w-2xl mx-auto">
                  {Array.from({ length: selectedPuzzle.pieces.length }, (_, index) => {
                    const piece = puzzlePieces.find((p) => p.currentPosition === index)
                    return (
                      <div
                        key={index}
                        className={`w-20 h-20 border-4 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-95 ${
                          piece
                            ? selectedPiece?.id === piece.id
                              ? "border-blue-500 bg-blue-100 scale-110"
                              : "border-gray-300 bg-white hover:bg-gray-50"
                            : "border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          if (piece) {
                            handlePieceClick(piece)
                          } else {
                            handleSlotClick(index)
                          }
                        }}
                        onTouchStart={(e) => {
                          e.preventDefault()
                          if (piece) {
                            handlePieceClick(piece)
                          } else {
                            handleSlotClick(index)
                          }
                        }}
                      >
                        {piece && <div className="text-4xl transition-transform hover:scale-110">{piece.value}</div>}
                      </div>
                    )
                  })}
                </div>

                {/* Solution Preview (for reference) */}
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-2">Solution:</p>
                  <div className="flex justify-center space-x-1">
                    {selectedPuzzle.pieces.map((piece, index) => (
                      <div key={index} className="text-2xl opacity-50">
                        {piece}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={handleShuffle}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      handleShuffle()
                    }}
                    variant="outline"
                    className="px-6 py-3 active:scale-95"
                    disabled={isCompleted}
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Shuffle
                  </Button>

                  <Button
                    onClick={() => setSelectedPuzzle(null)}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      setSelectedPuzzle(null)
                    }}
                    variant="outline"
                    className="px-6 py-3 active:scale-95"
                  >
                    Back to Puzzles
                  </Button>

                  {isCompleted && (
                    <Button
                      onClick={handleNextLevel}
                      onTouchStart={(e) => {
                        e.preventDefault()
                        handleNextLevel()
                      }}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 active:scale-95"
                    >
                      Next Level
                    </Button>
                  )}
                </div>

                {/* Completion Message */}
                {isCompleted && (
                  <div className="text-center mt-6">
                    <div className="bg-green-100 rounded-xl p-6">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                      <h3 className="text-2xl font-bold text-green-600 mb-2">🎉 Puzzle Completed! 🎉</h3>
                      <p className="text-green-700">
                        Completed in {moves} moves! Bonus score: {Math.max(100 - moves * 5, 20)} points
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
