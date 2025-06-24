"use client"

import type React from "react"
import type { HTMLCanvasEvent } from "react" // Declare the variable here

import { useState, useRef, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAudio } from "@/contexts/audio-context"
import { useUser } from "@/contexts/user-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Download, Palette } from "lucide-react"
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
]

const brushSizes = [2, 5, 10, 15, 20]

export default function DrawingGame() {
  const { t } = useLanguage()
  const { playSound } = useAudio()
  const { updateScore } = useUser()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState(colors[0])
  const [brushSize, setBrushSize] = useState(5)
  const [score, setScore] = useState(0)
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null)

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

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()

    if ("touches" in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0]
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    } else {
      // Mouse event
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
    draw(e)
    playSound("click")
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasEvent>) => {
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

    // Increase score for drawing
    setScore((prev) => prev + 1)
  }

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (!isDrawing) return
    setIsDrawing(false)
    setLastPoint(null)

    const canvas = canvasRef.current
    if (!canvas) return

    // Update user score
    updateScore("drawing", Math.floor(score / 10), 1)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setScore(0)
    playSound("click")
  }

  const downloadDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "my-drawing.png"
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
                {t("score")}: {Math.floor(score / 10)}
              </span>
            </div>
            <Button onClick={clearCanvas} variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("clear")}
            </Button>
            <Button onClick={downloadDrawing} variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎨 {t("drawing")} 🎨
          </h1>
          <p className="text-xl text-gray-600">Create amazing artwork with colors and shapes!</p>
        </div>

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
                      }`}
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
                      <div className="mx-auto rounded-full bg-gray-800" style={{ width: size * 2, height: size * 2 }} />
                    </button>
                  ))}
                </div>
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
      </main>
    </div>
  )
}
