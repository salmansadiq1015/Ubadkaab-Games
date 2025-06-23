"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Star } from "lucide-react"

interface LetterTracingGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
}

export default function LetterTracingGame({ onScore, playSound, onBack }: LetterTracingGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentLetter, setCurrentLetter] = useState("A")
  const [isDrawing, setIsDrawing] = useState(false)
  const [score, setScore] = useState(0)
  const [completedLetters, setCompletedLetters] = useState<string[]>([])
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

  useEffect(() => {
    drawLetterOutline()
  }, [currentLetter])

  const drawLetterOutline = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up canvas
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 8
    ctx.lineCap = "round"
    ctx.font = "bold 200px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Draw letter outline
    ctx.strokeText(currentLetter, canvas.width / 2, canvas.height / 2)

    // Draw dotted guide
    ctx.setLineDash([10, 10])
    ctx.strokeStyle = "#9ca3af"
    ctx.lineWidth = 4
    ctx.strokeText(currentLetter, canvas.width / 2, canvas.height / 2)
    ctx.setLineDash([])
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    playSound("click")
    draw(e)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 6
    ctx.lineCap = "round"
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.beginPath()
        }
      }

      // Simulate completion check (in a real app, you'd analyze the drawing)
      setTimeout(() => {
        playSound("success")
        if (!completedLetters.includes(currentLetter)) {
          setCompletedLetters([...completedLetters, currentLetter])
          setScore(score + 15)
          onScore(15)
        }
      }, 500)
    }
  }

  const clearCanvas = () => {
    drawLetterOutline()
    playSound("click")
  }

  const nextLetter = () => {
    const currentIndex = letters.indexOf(currentLetter)
    const nextIndex = (currentIndex + 1) % letters.length
    setCurrentLetter(letters[nextIndex])
    playSound("click")
  }

  const previousLetter = () => {
    const currentIndex = letters.indexOf(currentLetter)
    const prevIndex = currentIndex === 0 ? letters.length - 1 : currentIndex - 1
    setCurrentLetter(letters[prevIndex])
    playSound("click")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-800 mb-2">✏️ Letter Tracing</h1>
            <p className="text-lg text-gray-700">Trace the letters to learn writing!</p>
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

        {/* Current Letter Display */}
        <div className="text-center mb-6">
          <div className="bg-white/80 rounded-lg p-4 inline-block">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Current Letter</h2>
            <div className="text-8xl font-bold text-blue-600">{currentLetter}</div>
          </div>
        </div>

        {/* Canvas */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair w-full max-w-2xl mx-auto block"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={previousLetter} className="bg-blue-600 hover:bg-blue-700 text-white">
            ← Previous
          </Button>
          <Button onClick={clearCanvas} variant="outline" className="bg-white/80">
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button onClick={nextLetter} className="bg-blue-600 hover:bg-blue-700 text-white">
            Next →
          </Button>
        </div>

        {/* Progress */}
        <div className="bg-white/80 rounded-lg p-4 mb-6">
          <h3 className="text-xl font-bold mb-3 text-center">📈 Progress</h3>
          <div className="grid grid-cols-5 gap-2">
            {letters.map((letter) => (
              <div
                key={letter}
                className={`p-3 rounded-lg text-center font-bold cursor-pointer transition-all ${
                  letter === currentLetter
                    ? "bg-blue-500 text-white"
                    : completedLetters.includes(letter)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => {
                  setCurrentLetter(letter)
                  playSound("click")
                }}
              >
                {letter}
                {completedLetters.includes(letter) && <div className="text-xs">✓</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-center">📚 How to Play</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Follow the dotted outline to trace each letter</li>
            <li>• Use your mouse to draw on the canvas</li>
            <li>• Complete all letters to master the alphabet</li>
            <li>• Click on any letter in the progress bar to practice it</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
