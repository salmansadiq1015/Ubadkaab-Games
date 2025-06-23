"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, RotateCcw } from "lucide-react"

interface MemoryGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
}

export default function MemoryGame({ onScore, playSound, onBack }: MemoryGameProps) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
  const [cards, setCards] = useState<Array<{ id: number; letter: string; isFlipped: boolean; isMatched: boolean }>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const gameLetters = letters.slice(0, 6) // Use 6 letters for 12 cards
    const cardPairs = [...gameLetters, ...gameLetters]
    const shuffledCards = cardPairs
      .map((letter, index) => ({
        id: index,
        letter,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
    setFlippedCards([])
    setScore(0)
    setMoves(0)
    setMatchedPairs(0)
    setGameComplete(false)
  }

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return
    if (flippedCards.includes(cardId)) return
    if (cards.find((card) => card.id === cardId)?.isMatched) return

    playSound("click")

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // Update card state to show it's flipped
    setCards((prevCards) => prevCards.map((card) => (card.id === cardId ? { ...card, isFlipped: true } : card)))

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)
      const [firstCardId, secondCardId] = newFlippedCards
      const firstCard = cards.find((card) => card.id === firstCardId)
      const secondCard = cards.find((card) => card.id === secondCardId)

      if (firstCard && secondCard && firstCard.letter === secondCard.letter) {
        // Match found
        playSound("success")
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstCardId || card.id === secondCardId ? { ...card, isMatched: true } : card,
          ),
        )
        setMatchedPairs(matchedPairs + 1)
        setScore(score + 50)
        onScore(50)
        setFlippedCards([])

        // Check if game is complete
        if (matchedPairs + 1 === 6) {
          setGameComplete(true)
          playSound("complete")
          setTimeout(() => {
            alert(`🎉 Congratulations! You completed the game in ${moves + 1} moves!`)
          }, 500)
        }
      } else {
        // No match
        playSound("wrong")
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCardId || card.id === secondCardId ? { ...card, isFlipped: false } : card,
            ),
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const getCardColors = (letter: string) => {
    const colors = {
      A: "from-red-400 to-red-600",
      B: "from-blue-400 to-blue-600",
      C: "from-green-400 to-green-600",
      D: "from-yellow-400 to-yellow-600",
      E: "from-purple-400 to-purple-600",
      F: "from-pink-400 to-pink-600",
      G: "from-indigo-400 to-indigo-600",
      H: "from-orange-400 to-orange-600",
      I: "from-teal-400 to-teal-600",
      J: "from-cyan-400 to-cyan-600",
      K: "from-lime-400 to-lime-600",
      L: "from-rose-400 to-rose-600",
    }
    return colors[letter as keyof typeof colors] || "from-gray-400 to-gray-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 via-cyan-200 to-blue-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-teal-800 mb-2">🧠 Memory Game</h1>
            <p className="text-lg text-gray-700">Find matching letter pairs!</p>
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
        <div className="flex justify-center gap-6 mb-6">
          <div className="bg-white/80 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-600">Moves: </span>
            <span className="font-bold text-lg">{moves}</span>
          </div>
          <div className="bg-white/80 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-600">Pairs: </span>
            <span className="font-bold text-lg">{matchedPairs}/6</span>
          </div>
          <div className="bg-white/80 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-600">Score: </span>
            <span className="font-bold text-lg">{score}</span>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
          {cards.map((card) => (
            <Card
              key={card.id}
              className={`aspect-square cursor-pointer transition-all duration-500 hover:scale-105 ${
                card.isMatched ? "opacity-75" : ""
              }`}
              onClick={() => handleCardClick(card.id)}
            >
              <CardContent className="p-0 h-full">
                <div className="relative w-full h-full">
                  {/* Card Back */}
                  <div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center transition-all duration-500 ${
                      card.isFlipped || card.isMatched ? "opacity-0 rotate-y-180" : "opacity-100"
                    }`}
                  >
                    <div className="text-4xl">❓</div>
                  </div>

                  {/* Card Front */}
                  <div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-br ${getCardColors(card.letter)} flex items-center justify-center transition-all duration-500 ${
                      card.isFlipped || card.isMatched ? "opacity-100" : "opacity-0 rotate-y-180"
                    }`}
                  >
                    <span className="text-6xl font-bold text-white drop-shadow-lg">{card.letter}</span>
                    {card.isMatched && <div className="absolute top-2 right-2 text-2xl">✨</div>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <div className="text-center mb-6">
          <Button onClick={initializeGame} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg">
            <RotateCcw className="w-5 h-5 mr-2" />
            New Game
          </Button>
        </div>

        {/* Game Complete Message */}
        {gameComplete && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-green-600 mb-2">Congratulations!</h2>
              <p className="text-lg text-gray-700 mb-4">
                You completed the game in {moves} moves with a score of {score} points!
              </p>
              <div className="flex justify-center gap-4">
                <div className="bg-green-100 rounded-lg px-4 py-2">
                  <span className="text-green-800 font-bold">
                    {moves <= 8 ? "Excellent!" : moves <= 12 ? "Great!" : "Good job!"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <div className="bg-white/80 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-center">📚 How to Play</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Click on cards to flip them and reveal letters</li>
            <li>• Find two cards with the same letter to make a match</li>
            <li>• Remember where letters are located</li>
            <li>• Match all 6 pairs to win the game</li>
            <li>• Try to complete the game in as few moves as possible!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
