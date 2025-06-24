"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import { ArrowLeft } from "lucide-react"

interface MemoryPlayScreenProps {
  onBack: () => void
}

export default function MemoryPlayScreen({ onBack }: MemoryPlayScreenProps) {
  const { t } = useLanguage()
  const { updateProgress } = useProgress()
  const [score, setScore] = useState(0)
  const [cards, setCards] = useState(generateCards())
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedCards, setMatchedCards] = useState<number[]>([])
  const [gameComplete, setGameComplete] = useState(false)

  function generateCards() {
    const symbols = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"]
    const cardPairs = [...symbols, ...symbols]

    // Shuffle cards
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]]
    }

    return cardPairs
  }

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return
    }

    const newFlippedCards = [...flippedCards, index]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards
      if (cards[first] === cards[second]) {
        setMatchedCards([...matchedCards, first, second])
        setScore(score + 10)
        updateProgress("memory", 10)
        setFlippedCards([])

        if (matchedCards.length + 2 === cards.length) {
          setGameComplete(true)
          updateProgress("memory", 50, true)
        }
      } else {
        setTimeout(() => setFlippedCards([]), 1000)
      }
    }
  }

  const restartGame = () => {
    setCards(generateCards())
    setMatchedCards([])
    setFlippedCards([])
    setScore(0)
    setGameComplete(false)
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-100 p-4 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🧠</div>
            <CardTitle className="text-3xl text-green-600">{t("gameComplete")}</CardTitle>
            <CardDescription className="text-xl">
              {t("score")}: {score}
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
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-100 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
          <div className="text-xl font-bold">
            {t("score")}: {score}
          </div>
          <div className="text-sm text-gray-600">
            Matches: {matchedCards.length / 2} / {cards.length / 2}
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">Find matching pairs!</CardTitle>
            <CardDescription>Tap cards to flip them and find matches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6">
              {cards.map((symbol, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`
                    aspect-square flex items-center justify-center text-3xl rounded-lg cursor-pointer transition-all touch-manipulation
                    ${
                      flippedCards.includes(index) || matchedCards.includes(index)
                        ? "bg-white border-2 border-red-300"
                        : "bg-gradient-to-br from-red-400 to-red-600 hover:scale-105 active:scale-95"
                    }
                  `}
                >
                  {flippedCards.includes(index) || matchedCards.includes(index) ? symbol : "❓"}
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button onClick={restartGame} variant="outline" className="touch-manipulation">
                New Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
