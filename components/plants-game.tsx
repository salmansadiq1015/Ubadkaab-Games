"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { useTranslations } from "next-intl"

interface PlantsGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
  locale: string
}

export default function PlantsGame({ onScore, playSound, onBack, locale }: PlantsGameProps) {
  const t = useTranslations("PlantsGame")

  const plantStages = [
    {
      name: "Seed",
      emoji: "🌱",
      description: "A tiny plant waiting to grow",
      needs: ["Water", "Soil", "Warmth"],
      stage: 1,
    },
    {
      name: "Sprout",
      emoji: "🌱",
      description: "First green shoots appear",
      needs: ["Sunlight", "Water", "Nutrients"],
      stage: 2,
    },
    {
      name: "Seedling",
      emoji: "🌿",
      description: "Small plant with first leaves",
      needs: ["More sunlight", "Regular water", "Good soil"],
      stage: 3,
    },
    {
      name: "Young Plant",
      emoji: "🌳",
      description: "Growing taller with more leaves",
      needs: ["Lots of sunlight", "Water", "Space to grow"],
      stage: 4,
    },
    {
      name: "Mature Plant",
      emoji: "🌲",
      description: "Fully grown and strong",
      needs: ["Maintenance", "Seasonal care", "Protection"],
      stage: 5,
    },
    {
      name: "Flowering",
      emoji: "🌸",
      description: "Beautiful flowers bloom",
      needs: ["Pollination", "Good weather", "Nutrients"],
      stage: 6,
    },
  ]

  const [currentStage, setCurrentStage] = useState(0)
  const [gameMode, setGameMode] = useState<"learn" | "sequence" | "needs">("learn")
  const [sequenceGame, setSequenceGame] = useState<number[]>([])
  const [userSequence, setUserSequence] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)
  const [completedStages, setCompletedStages] = useState<string[]>([])

  useEffect(() => {
    if (gameMode === "sequence") {
      generateSequenceGame()
    }
  }, [gameMode])

  const generateSequenceGame = () => {
    // Create a shuffled sequence of 4 stages
    const stages = [0, 1, 2, 3].sort(() => Math.random() - 0.5)
    setSequenceGame(stages)
    setUserSequence([])
    setShowFeedback(null)
  }

  const handleSequenceClick = (stageIndex: number) => {
    playSound("click")
    const newUserSequence = [...userSequence, stageIndex]
    setUserSequence(newUserSequence)

    // Check if the sequence is correct so far
    const correctSequence = [...sequenceGame].sort((a, b) => a - b)
    const isCorrectSoFar = newUserSequence.every((stage, index) => stage === correctSequence[index])

    if (!isCorrectSoFar) {
      playSound("wrong")
      setShowFeedback("wrong")
      setTimeout(() => {
        setUserSequence([])
        setShowFeedback(null)
      }, 1500)
    } else if (newUserSequence.length === sequenceGame.length) {
      playSound("success")
      setScore(score + 40)
      onScore(40)
      setShowFeedback("correct")
      setTimeout(() => {
        generateSequenceGame()
      }, 2000)
    }
  }

  const handleNeedsAnswer = (need: string) => {
    playSound("click")
    const currentPlant = plantStages[currentStage]

    if (currentPlant.needs.includes(need)) {
      playSound("success")
      setScore(score + 20)
      onScore(20)
      setShowFeedback("correct")

      if (!completedStages.includes(currentPlant.name)) {
        setCompletedStages([...completedStages, currentPlant.name])
      }

      setTimeout(() => {
        if (currentStage < plantStages.length - 1) {
          setCurrentStage(currentStage + 1)
        } else {
          playSound("complete")
          alert("🎉 Wonderful! You understand plant life cycles!")
          setCurrentStage(0)
        }
        setShowFeedback(null)
      }, 2000)
    } else {
      playSound("wrong")
      setShowFeedback("wrong")
      setTimeout(() => {
        setShowFeedback(null)
      }, 1500)
    }
  }

  const currentPlantData = plantStages[currentStage]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200 p-4 ${locale === "ar" ? "rtl" : "ltr"}`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToMenu")}
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-800 mb-2">{t("title")}</h1>
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

        {/* Game Mode Selection */}
        <div className="flex justify-center gap-2 mb-6">
          {[
            { mode: "learn" as const, label: t("learnMode"), color: "bg-green-500" },
            { mode: "sequence" as const, label: t("orderMode"), color: "bg-blue-500" },
            { mode: "needs" as const, label: t("needsMode"), color: "bg-purple-500" },
          ].map(({ mode, label, color }) => (
            <Button
              key={mode}
              onClick={() => {
                setGameMode(mode)
                playSound("click")
              }}
              className={`w-full sm:w-auto ${gameMode === mode ? color : "bg-gray-400"} hover:opacity-80 text-white`}
            >
              {label}
            </Button>
          ))}
        </div>

        {gameMode === "learn" ? (
          /* Learning Mode */
          <>
            <Card className="mb-8">
              <CardContent className="p-8 text-center">
                <div className="text-9xl mb-6">{currentPlantData.emoji}</div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{currentPlantData.name}</h2>
                <p className="text-xl text-gray-600 mb-8">{currentPlantData.description}</p>

                {/* Plant Needs */}
                <div className="bg-green-100 rounded-lg p-6">
                  <h3 className="text-2xl font-bold text-green-800 mb-4">{t("plantNeedsTitle")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentPlantData.needs.map((need, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                        <div className="text-2xl mb-2">
                          {need.includes("Water") && "💧"}
                          {need.includes("Sun") && "☀️"}
                          {need.includes("Soil") && "🌍"}
                          {need.includes("Nutrients") && "🌿"}
                          {need.includes("Space") && "📏"}
                          {need.includes("Pollination") && "🐝"}
                          {need.includes("Warmth") && "🌡️"}
                          {need.includes("Maintenance") && "🔧"}
                          {need.includes("Protection") && "🛡️"}
                          {need.includes("weather") && "🌤️"}
                        </div>
                        <div className="font-bold text-green-700">{need}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mb-6">
              <Button
                onClick={() => {
                  if (currentStage > 0) {
                    setCurrentStage(currentStage - 1)
                    playSound("click")
                  }
                }}
                disabled={currentStage === 0}
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                {t("previousStage")}
              </Button>
              <div className="bg-white/80 rounded-lg px-4 py-2 flex items-center">
                <span className="font-bold">
                  {t("stage")} {currentStage + 1} / {plantStages.length}
                </span>
              </div>
              <Button
                onClick={() => {
                  if (currentStage < plantStages.length - 1) {
                    setCurrentStage(currentStage + 1)
                    playSound("click")
                  }
                }}
                disabled={currentStage === plantStages.length - 1}
                className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
              >
                {t("nextStage")}
              </Button>
            </div>
          </>
        ) : gameMode === "sequence" ? (
          /* Sequence Game */
          <>
            <Card className="mb-8">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-6">{t("sequenceTitle")}</h3>
                <p className="text-lg text-gray-600 mb-6">{t("sequenceSubtitle")}</p>

                {/* Shuffled stages to order */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {sequenceGame.map((stageIndex, position) => {
                    const stage = plantStages[stageIndex]
                    const isClicked = userSequence.includes(stageIndex)
                    const clickOrder = userSequence.indexOf(stageIndex) + 1

                    return (
                      <Button
                        key={position}
                        onClick={() => handleSequenceClick(stageIndex)}
                        disabled={isClicked || showFeedback !== null}
                        className={`h-32 flex flex-col items-center justify-center text-lg font-bold transition-all ${
                          isClicked
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300"
                        }`}
                      >
                        <div className="text-4xl mb-2">{stage.emoji}</div>
                        <div className="text-sm">{stage.name}</div>
                        {isClicked && (
                          <div className="text-xs bg-white/20 rounded-full w-6 h-6 flex items-center justify-center mt-1">
                            {clickOrder}
                          </div>
                        )}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Needs Game */
          <>
            <Card className="mb-8">
              <CardContent className="p-8 text-center">
                <div className="text-9xl mb-6">{currentPlantData.emoji}</div>
                <h3 className="text-2xl font-bold mb-4">{t("needsQuestion", { plantName: currentPlantData.name })}</h3>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {["Water", "Sunlight", "Soil", "Nutrients", "Space", "Warmth"].map((need) => (
                    <Button
                      key={need}
                      onClick={() => handleNeedsAnswer(need)}
                      disabled={showFeedback !== null}
                      className="h-20 text-lg font-bold bg-green-500 hover:bg-green-600 text-white flex flex-col items-center justify-center"
                    >
                      <div className="text-2xl mb-1">
                        {need === "Water" && "💧"}
                        {need === "Sunlight" && "☀️"}
                        {need === "Soil" && "🌍"}
                        {need === "Nutrients" && "🌿"}
                        {need === "Space" && "📏"}
                        {need === "Warmth" && "🌡️"}
                      </div>
                      {need}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Feedback */}
        {showFeedback && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              {showFeedback === "correct" ? (
                <div className="text-green-600">
                  <div className="text-6xl mb-2">🎉</div>
                  <h3 className="text-2xl font-bold">{t("correctFeedbackTitle")}</h3>
                  <p>{t("correctFeedbackText")}</p>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="text-6xl mb-2">🤔</div>
                  <h3 className="text-2xl font-bold">{t("wrongFeedbackTitle")}</h3>
                  <p>{t("wrongFeedbackText")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Plant Progress */}
        <div className="bg-white/80 rounded-lg p-4 mb-6">
          <h3 className="text-xl font-bold mb-3 text-center">{t("growthProgressTitle")}</h3>
          <div className="grid grid-cols-3 gap-2">
            {plantStages.map((stage, index) => (
              <div
                key={stage.name}
                className={`p-3 rounded-lg text-center font-bold cursor-pointer transition-all ${
                  index === currentStage
                    ? "bg-green-500 text-white"
                    : completedStages.includes(stage.name)
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => {
                  setCurrentStage(index)
                  playSound("click")
                }}
              >
                <div className="text-2xl mb-1">{stage.emoji}</div>
                <div className="text-xs">{stage.name}</div>
                {completedStages.includes(stage.name) && <div className="text-xs">✓</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-center">{t("howToPlayTitle")}</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              • <strong>{t("learnMode")}:</strong> {t("learnModeDescription")}
            </li>
            <li>
              • <strong>{t("orderMode")}:</strong> {t("orderModeDescription")}
            </li>
            <li>
              • <strong>{t("needsMode")}:</strong> {t("needsModeDescription")}
            </li>
            <li>• {t("generalInstructions")}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
