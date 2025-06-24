"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import { ArrowLeft } from "lucide-react"

interface MusicPlayScreenProps {
  onBack: () => void
}

export default function MusicPlayScreen({ onBack }: MusicPlayScreenProps) {
  const { t } = useLanguage()
  const { updateProgress } = useProgress()
  const [score, setScore] = useState(0)
  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)

  const colors = [
    { id: 0, color: "bg-red-500", sound: "🎵" },
    { id: 1, color: "bg-blue-500", sound: "🎶" },
    { id: 2, color: "bg-green-500", sound: "🎼" },
    { id: 3, color: "bg-yellow-500", sound: "🎹" },
  ]

  const startGame = () => {
    setGameStarted(true)
    setSequence([Math.floor(Math.random() * 4)])
    setPlayerSequence([])
    playSequence([Math.floor(Math.random() * 4)])
  }

  const playSequence = async (seq: number[]) => {
    setIsPlaying(true)
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600))
      // Visual feedback would go here
    }
    setIsPlaying(false)
  }

  const handleColorClick = (colorId: number) => {
    if (isPlaying) return

    const newPlayerSequence = [...playerSequence, colorId]
    setPlayerSequence(newPlayerSequence)

    // Check if the player's sequence matches so far
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      // Wrong sequence - game over
      setGameComplete(true)
      updateProgress("music", score, true)
      return
    }

    // If player completed the current sequence correctly
    if (newPlayerSequence.length === sequence.length) {
      const points = sequence.length * 10
      setScore(score + points)
      updateProgress("music", points)

      if (sequence.length >= 8) {
        // Win condition
        setGameComplete(true)
        updateProgress("music", 50, true)
      } else {
        // Add next color to sequence
        const nextSequence = [...sequence, Math.floor(Math.random() * 4)]
        setSequence(nextSequence)
        setPlayerSequence([])
        setTimeout(() => playSequence(nextSequence), 1000)
      }
    }
  }

  const restartGame = () => {
    setScore(0)
    setSequence([])
    setPlayerSequence([])
    setGameStarted(false)
    setGameComplete(false)
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 to-purple-100 p-4 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎵</div>
            <CardTitle className="text-3xl text-green-600">{t("gameComplete")}</CardTitle>
            <CardDescription className="text-xl">
              {t("score")}: {score} | Sequence: {sequence.length}
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

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 to-purple-100 p-4 flex items-center justify-center">
        <Card className="bg-white/80 backdrop-blur-sm max-w-md w-full">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">🎵</div>
            <CardTitle className="text-3xl">{t("musicGame")}</CardTitle>
            <CardDescription className="text-lg">
              Watch the sequence and repeat it by tapping the colors!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={startGame} className="w-full" size="lg">
              {t("start")}
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
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-purple-100 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
          <div className="text-xl font-bold">
            {t("score")}: {score}
          </div>
          <div className="text-sm text-gray-600">Level: {sequence.length}</div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">
              {isPlaying ? "Watch the sequence!" : "Repeat the sequence!"}
            </CardTitle>
            <CardDescription>
              {isPlaying ? "Pay attention to the pattern" : "Tap the colors in the same order"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
              {colors.map((color) => (
                <div
                  key={color.id}
                  onClick={() => handleColorClick(color.id)}
                  className={`
                    aspect-square flex items-center justify-center text-4xl rounded-lg cursor-pointer transition-all touch-manipulation
                    ${color.color} ${isPlaying ? "opacity-50" : "hover:scale-105 active:scale-95"}
                  `}
                >
                  {color.sound}
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                Progress: {playerSequence.length} / {sequence.length}
              </div>
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
