"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAudio } from "@/contexts/audio-context"
import { useUser } from "@/contexts/user-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Download, Palette, Target, Star } from "lucide-react"
import Link from "next/link"

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#85C1E9",
  "#D7BDE2",
  "#000000",
  "#FFFFFF",
  "#8B4513",
]

const brushSizes = [2, 5, 10, 15, 20, 25, 30]

interface DrawingChallenge {
  type: "free" | "shape" | "object" | "pattern" | "color" | "story"
  title: string
  description: string
  prompt: string
  targetColors?: string[]
  requiredShapes?: string[]
  timeLimit?: number
}

const drawingPrompts = {
  objects: [
    "house",
    "tree",
    "car",
    "flower",
    "sun",
    "moon",
    "star",
    "cat",
    "dog",
    "fish",
    "bird",
    "butterfly",
    "rainbow",
    "cloud",
    "mountain",
    "ocean",
    "castle",
    "rocket",
    "robot",
    "dinosaur",
    "pizza",
    "cake",
    "ice cream",
    "balloon",
    "kite",
    "boat",
  ],
  patterns: [
    "stripes",
    "dots",
    "zigzag",
    "spirals",
    "checkerboard",
    "waves",
    "hearts",
    "stars",
    "triangles",
    "circles",
    "squares",
    "diamonds",
    "flowers",
    "leaves",
  ],
  stories: [
    "a magical forest",
    "underwater adventure",
    "space journey",
    "fairy tale castle",
    "jungle safari",
    "winter wonderland",
    "summer beach",
    "city skyline",
    "farm scene",
    "birthday party",
    "playground fun",
    "garden party",
  ],
}

export default function DrawingGame() {
  const { t } = useLanguage()
  const { playSound, speakText } = useAudio()
  const { updateScore } = useUser()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState(colors[0])
  const [brushSize, setBrushSize] = useState(5)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null)
  const [currentChallenge, setCurrentChallenge] = useState<DrawingChallenge | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isLevelComplete, setIsLevelComplete] = useState(false)
  const [usedColors, setUsedColors] = useState<Set<string>>(new Set())
  const [strokeCount, setStrokeCount] = useState(0)

  const generateDrawingChallenge = (level: number): DrawingChallenge => {
    if (level <= 2) {
      return {
        type: "free",
        title: "Free Drawing",
        description: "Draw anything you like!",
        prompt: "Let your creativity flow! Draw whatever makes you happy.",
      }
    } else if (level <= 5) {
      const shapes = ["circle", "square", "triangle", "rectangle", "star", "heart"]
      const shape = shapes[Math.floor(Math.random() * shapes.length)]
      return {
        type: "shape",
        title: "Shape Challenge",
        description: `Draw a ${shape}`,
        prompt: `Can you draw a beautiful ${shape}? Make it colorful!`,
        requiredShapes: [shape],
      }
    } else if (level <= 10) {
      const objects = drawingPrompts.objects
      const object = objects[Math.floor(Math.random() * objects.length)]
      return {
        type: "object",
        title: "Object Drawing",
        description: `Draw a ${object}`,
        prompt: `Draw a creative ${object}! Add details and colors to make it special.`,
        timeLimit: 180, // 3 minutes
      }
    } else if (level <= 15) {
      const patterns = drawingPrompts.patterns
      const pattern = patterns[Math.floor(Math.random() * patterns.length)]
      const colorCount = Math.min(3 + Math.floor(level / 3), 6)
      const challengeColors = colors
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, colorCount)
      return {
        type: "pattern",
        title: "Pattern Challenge",
        description: `Create a ${pattern} pattern`,
        prompt: `Fill the canvas with a ${pattern} pattern using these specific colors!`,
        targetColors: challengeColors,
        timeLimit: 240, // 4 minutes
      }
    } else if (level <= 25) {
      const colorCount = Math.min(4 + Math.floor(level / 5), 8)
      const challengeColors = colors
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, colorCount)
      return {
        type: "color",
        title: "Color Mastery",
        description: "Use all specified colors",
        prompt: `Create a masterpiece using ALL of these colors! Be creative and make something beautiful.`,
        targetColors: challengeColors,
        timeLimit: 300, // 5 minutes
      }
    } else {
      const stories = drawingPrompts.stories
      const story = stories[Math.floor(Math.random() * stories.length)]
      const colorCount = Math.min(5 + Math.floor(level / 10), colors.length)
      const challengeColors = colors
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, colorCount)
      return {
        type: "story",
        title: "Story Illustration",
        description: `Illustrate: ${story}`,
        prompt: `Draw a scene showing ${story}. Tell a story with your art! Use lots of colors and details.`,
        targetColors: challengeColors,
        timeLimit: 420, // 7 minutes
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Set initial canvas background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set drawing properties
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  useEffect(() => {
    setCurrentChallenge(generateDrawingChallenge(level))
    setUsedColors(new Set())
    setStrokeCount(0)
    setIsLevelComplete(false)
    clearCanvas()
  }, [level])

  useEffect(() => {
    if (currentChallenge?.timeLimit && timeLeft === null) {
      setTimeLeft(currentChallenge.timeLimit)
    }
  }, [currentChallenge])

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleTimeUp()
    }
  }, [timeLeft])

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()

    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0]
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(true)
    const pos = getEventPos(e)
    setLastPoint(pos)
    setUsedColors((prev) => new Set([...prev, currentColor]))
    draw(e)
    playSound("click")
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const currentPos = getEventPos(e)

    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.strokeStyle = currentColor

    if (lastPoint) {
      ctx.beginPath()
      ctx.moveTo(lastPoint.x, lastPoint.y)
      ctx.lineTo(currentPos.x, currentPos.y)
      ctx.stroke()
    }

    setLastPoint(currentPos)
    setScore((prev) => prev + 1)
  }

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return
    setIsDrawing(false)
    setLastPoint(null)
    setStrokeCount((prev) => prev + 1)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setUsedColors(new Set())
    setStrokeCount(0)
    playSound("click")
  }

  const handleCompleteDrawing = () => {
    if (!currentChallenge) return

    let bonusScore = 0
    let feedback = "Great artwork! "

    // Calculate bonus based on challenge completion
    if (currentChallenge.targetColors) {
      const colorUsageRatio = usedColors.size / currentChallenge.targetColors.length
      const targetColorUsage = currentChallenge.targetColors.filter((color) => usedColors.has(color)).length
      bonusScore += targetColorUsage * 20

      if (targetColorUsage === currentChallenge.targetColors.length) {
        feedback += "Perfect color usage! "
        bonusScore += 50
      }
    }

    // Time bonus
    if (timeLeft && currentChallenge.timeLimit) {
      const timeBonus = Math.floor((timeLeft / currentChallenge.timeLimit) * 30)
      bonusScore += timeBonus
      feedback += `Time bonus: ${timeBonus} points! `
    }

    // Creativity bonus based on strokes and colors
    const creativityBonus = Math.min(strokeCount * 2 + usedColors.size * 5, 100)
    bonusScore += creativityBonus

    setScore((prev) => prev + bonusScore)
    updateScore("drawing", bonusScore, level)
    setIsLevelComplete(true)
    playSound("correct")

    setTimeout(() => {
      speakText(feedback + `You earned ${bonusScore} bonus points!`)
    }, 500)
  }

  const handleTimeUp = () => {
    handleCompleteDrawing()
  }

  const handleNextLevel = () => {
    setLevel((prev) => prev + 1)
    playSound("correct")
  }

  const downloadDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `level-${level}-artwork.png`
    link.href = canvas.toDataURL()
    link.click()
    playSound("correct")
  }

  const handleColorSelect = (color: string) => {
    setCurrentColor(color)
    playSound("click")
  }

  const handleBrushSizeSelect = (size: number) => {
    setBrushSize(size)
    playSound("click")
  }

  const handleRestart = () => {
    playSound("click")
    setScore(0)
    setLevel(1)
    setTimeLeft(null)
    setIsLevelComplete(false)
    clearCanvas()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100">
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
            {timeLeft !== null && (
              <div
                className={`rounded-full px-4 py-2 shadow-lg ${timeLeft <= 30 ? "bg-red-100 text-red-800" : "bg-white text-gray-800"}`}
              >
                <span className="font-bold">
                  Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
            )}
            <Button onClick={clearCanvas} variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("clear")}
            </Button>
            <Button onClick={downloadDrawing} variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleRestart} variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("restart")}
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎨 {t("drawing")} 🎨
          </h1>
          {currentChallenge && (
            <div className="bg-white rounded-xl p-4 shadow-lg max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{currentChallenge.title}</h2>
              <p className="text-gray-600 mb-2">{currentChallenge.description}</p>
              <p className="text-sm text-gray-500 italic">{currentChallenge.prompt}</p>

              {currentChallenge.targetColors && (
                <div className="mt-3">
                  <p className="text-sm font-bold text-gray-700 mb-2">Required Colors:</p>
                  <div className="flex justify-center space-x-2">
                    {currentChallenge.targetColors.map((color, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full border-2 ${usedColors.has(color) ? "border-green-500" : "border-gray-300"}`}
                        style={{ backgroundColor: color }}
                      >
                        {usedColors.has(color) && <Star className="w-4 h-4 text-green-500 m-0.5" />}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Used: {currentChallenge.targetColors.filter((color) => usedColors.has(color)).length}/
                    {currentChallenge.targetColors.length}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {!isLevelComplete ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tools Panel */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    {t("colors")}
                  </h3>

                  {/* Color Palette */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-12 h-12 rounded-full border-4 transition-all duration-300 hover:scale-110 active:scale-95 ${
                          currentColor === color ? "border-gray-800 scale-110" : "border-gray-300"
                        } ${usedColors.has(color) ? "ring-2 ring-green-400" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                        onTouchStart={(e) => {
                          e.preventDefault()
                          handleColorSelect(color)
                        }}
                      />
                    ))}
                  </div>

                  {/* Brush Size */}
                  <h4 className="text-lg font-bold mb-3">{t("brushSize")}</h4>
                  <div className="space-y-2">
                    {brushSizes.map((size) => (
                      <button
                        key={size}
                        className={`w-full p-2 rounded-lg border-2 transition-all duration-300 active:scale-95 ${
                          brushSize === size ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => handleBrushSizeSelect(size)}
                        onTouchStart={(e) => {
                          e.preventDefault()
                          handleBrushSizeSelect(size)
                        }}
                      >
                        <div
                          className="mx-auto rounded-full bg-gray-800"
                          style={{ width: size * 2, height: size * 2 }}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Colors Used: {usedColors.size}</p>
                    <p className="text-sm text-gray-600">Strokes: {strokeCount}</p>
                  </div>

                  {/* Complete Button */}
                  <Button
                    onClick={handleCompleteDrawing}
                    className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
                    disabled={strokeCount < 5}
                  >
                    Complete Drawing
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Canvas */}
            <div className="lg:col-span-3">
              <Card className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-96 border-2 border-gray-300 rounded-lg cursor-crosshair touch-none"
                    style={{ touchAction: "none" }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onTouchCancel={stopDrawing}
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">🖱️ Use mouse or 👆 touch to draw!</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Level Complete */
          <div className="text-center">
            <Card className="bg-white shadow-2xl max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-4xl font-bold text-green-600 mb-4">🎨 Artwork Complete! 🎨</h2>
                <div className="space-y-2 text-lg text-gray-700 mb-6">
                  <p>
                    Level {level} Challenge: {currentChallenge?.title}
                  </p>
                  <p>Colors Used: {usedColors.size}</p>
                  <p>Total Strokes: {strokeCount}</p>
                  <p>Final Score: {score} points</p>
                </div>
                <div className="space-x-4">
                  <Button onClick={downloadDrawing} variant="outline" className="mb-4">
                    <Download className="w-4 h-4 mr-2" />
                    Save Artwork
                  </Button>
                  <Button onClick={handleNextLevel} className="kid-button">
                    <Target className="w-4 h-4 mr-2" />
                    Next Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
