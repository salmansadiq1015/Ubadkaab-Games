"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useProgress } from "@/hooks/use-progress"
import { ArrowLeft, Palette, RotateCcw } from "lucide-react"

interface DrawingPlayScreenProps {
  onBack: () => void
}

export default function DrawingPlayScreen({ onBack }: DrawingPlayScreenProps) {
  const { t } = useLanguage()
  const { updateProgress } = useProgress()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentColor, setCurrentColor] = useState("#3B82F6")
  const [brushSize, setBrushSize] = useState(5)

  const colors = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#F97316", // Orange
    "#000000", // Black
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 400
    canvas.height = 300

    // Set white background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set drawing properties
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let clientX: number, clientY: number

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.lineWidth = brushSize
    ctx.strokeStyle = currentColor
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.beginPath()

    // Award points for drawing
    updateProgress("drawing", 5)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Create download link
    const link = document.createElement("a")
    link.download = "my-drawing.png"
    link.href = canvas.toDataURL()
    link.click()

    updateProgress("drawing", 20, true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-pink-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
          <h1 className="text-2xl font-bold">{t("drawingGame")}</h1>
          <div className="w-20"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Drawing Canvas */}
          <div className="lg:col-span-3">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Draw anything you want!</CardTitle>
                <CardDescription>Use your finger or mouse to create beautiful art</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="border-2 border-gray-300 rounded-lg cursor-crosshair touch-none"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Tools Panel */}
          <div className="space-y-4">
            {/* Colors */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Colors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCurrentColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all touch-manipulation ${
                        currentColor === color ? "border-gray-800 scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Brush Size */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Brush Size</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full touch-manipulation"
                />
                <div className="text-center mt-2 text-sm text-gray-600">{brushSize}px</div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={clearCanvas} variant="outline" className="w-full touch-manipulation">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button onClick={saveDrawing} className="w-full touch-manipulation">
                  Save Drawing
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
