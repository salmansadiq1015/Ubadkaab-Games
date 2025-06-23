"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Shuffle } from "lucide-react"
import { useTranslations } from "next-intl"

interface JigsawGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
  language: string
}

export default function JigsawGame({ onScore, playSound, onBack, language }: JigsawGameProps) {
  const t = useTranslations("JigsawGame")

  const puzzles = [
    { name: "Cat", emoji: "🐱", pieces: ["🐱", "🎀", "🐾", "🥛"] },
    { name: "House", emoji: "🏠", pieces: ["🏠", "🌳", "☀️", "🌸"] },
    { name: "Car", emoji: "🚗", pieces: ["🚗", "🛣️", "⛽", "🚦"] },
    { name: "Garden", emoji: "🌻", pieces: ["🌻", "🦋", "🌿", "🌧️"] },
  ]

  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [shuffledPieces, setShuffledPieces] = useState<string[]>([])
  const [placedPieces, setPlacedPieces] = useState<(string | null)[]>([null, null, null, null])
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    resetPuzzle()
  }, [currentPuzzle])

  const resetPuzzle = () => {
    const pieces = [...puzzles[currentPuzzle].pieces]
    setShuffledPieces(pieces.sort(() => Math.random() - 0.5))
    setPlacedPieces([null, null, null, null])
    setIsComplete(false)
  }

  const handlePieceClick = (piece: string, fromShuffled: boolean, index: number) => {
    playSound("click")

    if (fromShuffled) {
      // Moving from shuffled area to puzzle area
      const emptySlot = placedPieces.findIndex((slot) => slot === null)
      if (emptySlot !== -1) {
        const newPlaced = [...placedPieces]
        newPlaced[emptySlot] = piece
        setPlacedPieces(newPlaced)
        setShuffledPieces(shuffledPieces.filter((_, i) => i !== index))
      }
    } else {
      // Moving from puzzle area back to shuffled area
      const newPlaced = [...placedPieces]
      newPlaced[index] = null
      setPlacedPieces(newPlaced)
      setShuffledPieces([...shuffledPieces, piece])
    }

    // Check if puzzle is complete
    const newPlacedAfterMove = fromShuffled
      ? (() => {
          const emptySlot = placedPieces.findIndex((slot) => slot === null)
          if (emptySlot !== -1) {
            const temp = [...placedPieces]
            temp[emptySlot] = piece
            return temp
          }
          return placedPieces
        })()
      : placedPieces

    if (newPlacedAfterMove.every((piece) => piece !== null) && shuffledPieces.length <= 1) {
      setTimeout(() => {
        playSound("success")
        setScore(score + 50)
        onScore(50)
        setIsComplete(true)

        setTimeout(() => {
          if (currentPuzzle < puzzles.length - 1) {
            setCurrentPuzzle(currentPuzzle + 1)
          } else {
            playSound("complete")
            alert("🎉 Amazing! You completed all puzzles!")
            setCurrentPuzzle(0)
          }
        }, 2000)
      }, 100)
    }
  }

  const nextPuzzle = () => {
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1)
      playSound("click")
    }
  }

  const previousPuzzle = () => {
    if (currentPuzzle > 0) {
      setCurrentPuzzle(currentPuzzle - 1)
      playSound("click")
    }
  }

  const currentPuzzleData = puzzles[currentPuzzle]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-rose-200 via-pink-200 to-red-200 p-4"
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
            <h1 className="text-4xl font-bold text-rose-800 mb-2">{t("title")}</h1>
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

        {/* Puzzle Preview */}
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">{t("completePuzzle", { puzzleName: currentPuzzleData.name })}</h2>
            <div className="text-6xl mb-4">{currentPuzzleData.emoji}</div>
            <p className="text-gray-600">{t("dragPieces")}</p>
          </CardContent>
        </Card>

        {/* Puzzle Area */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 text-center">{t("puzzleArea")}</h3>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {placedPieces.map((piece, index) => (
                <div
                  key={index}
                  className={`aspect-square border-4 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-6xl cursor-pointer transition-all hover:bg-gray-50 ${
                    piece ? "bg-green-100 border-green-400" : "bg-gray-100"
                  }`}
                  onClick={() => piece && handlePieceClick(piece, false, index)}
                >
                  {piece || "❓"}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Puzzle Pieces */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{t("availablePieces")}</h3>
              <Button onClick={resetPuzzle} variant="outline" className="bg-white/80">
                <Shuffle className="w-4 h-4 mr-2" />
                {t("reset")}
              </Button>
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              {shuffledPieces.map((piece, index) => (
                <Button
                  key={index}
                  onClick={() => handlePieceClick(piece, true, index)}
                  className="w-20 h-20 text-4xl bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300"
                >
                  {piece}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completion Message */}
        {isComplete && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-600 mb-2">{t("puzzleComplete")}</h2>
              <p className="text-lg text-gray-700">{t("greatJob", { puzzleName: currentPuzzleData.name })}</p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={previousPuzzle}
            disabled={currentPuzzle === 0}
            className="bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
          >
            {t("previousPuzzle")}
          </Button>
          <div className="bg-white/80 rounded-lg px-4 py-2 flex items-center">
            <span className="font-bold">
              {currentPuzzle + 1} / {puzzles.length}
            </span>
          </div>
          <Button
            onClick={nextPuzzle}
            disabled={currentPuzzle === puzzles.length - 1}
            className="bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
          >
            {t("nextPuzzle")}
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
