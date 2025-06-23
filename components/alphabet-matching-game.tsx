"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"

interface AlphabetMatchingGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
}

export default function AlphabetMatchingGame({ onScore, playSound, onBack }: AlphabetMatchingGameProps) {
  const [letters] = useState(["A", "B", "C", "D", "E", "F", "G", "H"])
  const [shuffledCards, setShuffledCards] = useState<string[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    const upperCase = letters.slice(0, 4)
    const lowerCase = upperCase.map((letter) => letter.toLowerCase())
    const allCards = [...upperCase, ...lowerCase]
    setShuffledCards(allCards.sort(() => Math.random() - 0.5))
  }, [letters])

  const handleCardClick = (index: number) => {
    if (
      selectedCards.length === 2 ||
      selectedCards.includes(index) ||
      matchedPairs.includes(shuffledCards[index].toUpperCase())
    ) {
      return
    }

    playSound("click")
    const newSelected = [...selectedCards, index]
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setAttempts(attempts + 1)
      const [first, second] = newSelected
      const firstCard = shuffledCards[first]
      const secondCard = shuffledCards[second]

      if (firstCard.toUpperCase() === secondCard.toUpperCase() && firstCard !== secondCard) {
        // Match found
        playSound("success")
        setMatchedPairs([...matchedPairs, firstCard.toUpperCase()])
        setScore(score + 10)
        onScore(10)
        setSelectedCards([])

        if (matchedPairs.length + 1 === 4) {
          playSound("complete")
          setTimeout(() => {
            alert("🎉 Congratulations! You matched all letters!")
          }, 500)
        }
      } else {
        // No match
        playSound("wrong")
        setTimeout(() => {
          setSelectedCards([])
        }, 1000)
      }
    }
  }

  const resetGame = () => {
    const upperCase = letters.slice(0, 4)
    const lowerCase = upperCase.map((letter) => letter.toLowerCase())
    const allCards = [...upperCase, ...lowerCase]
    setShuffledCards(allCards.sort(() => Math.random() - 0.5))
    setSelectedCards([])
    setMatchedPairs([])
    setScore(0)
    setAttempts(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-purple-800 mb-2">🔤 Alphabet Matching</h1>
            <p className="text-lg text-gray-700">Match uppercase and lowercase letters!</p>
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

        {/* Game Stats */}
        <div className="text-center mb-6">
          <div className="flex justify-center gap-6">
            <div className="bg-white/80 rounded-lg px-4 py-2">
              <span className="text-sm text-gray-600">Attempts: </span>
              <span className="font-bold text-lg">{attempts}</span>
            </div>
            <div className="bg-white/80 rounded-lg px-4 py-2">
              <span className="text-sm text-gray-600">Matched: </span>
              <span className="font-bold text-lg">{matchedPairs.length}/4</span>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {shuffledCards.map((card, index) => {
            const isSelected = selectedCards.includes(index)
            const isMatched = matchedPairs.includes(card.toUpperCase())
            const isRevealed = isSelected || isMatched

            return (
              <Card
                key={index}
                className={`aspect-square cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isMatched
                    ? "bg-green-200 border-green-400"
                    : isSelected
                      ? "bg-blue-200 border-blue-400"
                      : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => handleCardClick(index)}
              >
                <CardContent className="flex items-center justify-center h-full p-0">
                  {isRevealed ? (
                    <span
                      className={`text-6xl font-bold ${card === card.toUpperCase() ? "text-red-600" : "text-blue-600"}`}
                    >
                      {card}
                    </span>
                  ) : (
                    <div className="text-4xl">❓</div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Controls */}
        <div className="text-center">
          <Button onClick={resetGame} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg">
            🔄 New Game
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white/80 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-center">📚 How to Play</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Click on cards to reveal letters</li>
            <li>• Match uppercase letters (A, B, C...) with lowercase letters (a, b, c...)</li>
            <li>• Find all 4 pairs to win!</li>
            <li>• Try to match them in as few attempts as possible</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
