"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star } from "lucide-react"
import { useTranslations } from "next-intl"

interface WeatherGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
  language: string
}

export default function WeatherGame({ onScore, playSound, onBack, language }: WeatherGameProps) {
  const t = useTranslations("WeatherGame")

  const weatherTypes = [
    {
      name: "Sunny",
      emoji: "☀️",
      description: "Bright and warm with clear skies",
      activities: ["Swimming", "Picnic", "Playing outside"],
      clothing: ["T-shirt", "Shorts", "Sunglasses"],
    },
    {
      name: "Rainy",
      emoji: "🌧️",
      description: "Water falling from clouds",
      activities: ["Reading inside", "Board games", "Watching movies"],
      clothing: ["Raincoat", "Boots", "Umbrella"],
    },
    {
      name: "Cloudy",
      emoji: "☁️",
      description: "Sky covered with clouds",
      activities: ["Walking", "Photography", "Outdoor sports"],
      clothing: ["Light jacket", "Long pants", "Comfortable shoes"],
    },
    {
      name: "Snowy",
      emoji: "❄️",
      description: "White flakes falling from the sky",
      activities: ["Building snowmen", "Skiing", "Hot chocolate"],
      clothing: ["Winter coat", "Gloves", "Warm boots"],
    },
    {
      name: "Windy",
      emoji: "💨",
      description: "Air moving fast and strong",
      activities: ["Flying kites", "Sailing", "Wind surfing"],
      clothing: ["Windbreaker", "Secure hat", "Closed shoes"],
    },
    {
      name: "Stormy",
      emoji: "⛈️",
      description: "Thunder, lightning, and heavy rain",
      activities: ["Stay inside", "Read books", "Play quiet games"],
      clothing: ["Raincoat", "Stay indoors", "Waterproof gear"],
    },
  ]

  const [currentWeather, setCurrentWeather] = useState(0)
  const [gameMode, setGameMode] = useState<"learn" | "activities" | "clothing">("learn")
  const [quizOptions, setQuizOptions] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)
  const [completedWeather, setCompletedWeather] = useState<string[]>([])

  useEffect(() => {
    if (gameMode !== "learn") {
      generateQuizQuestion()
    }
  }, [currentWeather, gameMode])

  const generateQuizQuestion = () => {
    const correct = weatherTypes[currentWeather]
    const wrongOptions = weatherTypes
      .filter((weather) => weather.name !== correct.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5).map((weather) => weather.name)

    setQuizOptions(allOptions)
    setSelectedAnswer(null)
    setShowFeedback(null)
  }

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    playSound("click")

    const correctAnswer = weatherTypes[currentWeather].name

    if (answer === correctAnswer) {
      playSound("success")
      setScore(score + 30)
      onScore(30)
      setShowFeedback("correct")

      if (!completedWeather.includes(correctAnswer)) {
        setCompletedWeather([...completedWeather, correctAnswer])
      }

      setTimeout(() => {
        if (currentWeather < weatherTypes.length - 1) {
          setCurrentWeather(currentWeather + 1)
        } else {
          playSound("complete")
          alert(t("completeAlert"))
          setCurrentWeather(0)
        }
      }, 2000)
    } else {
      playSound("wrong")
      setShowFeedback("wrong")
      setTimeout(() => {
        setShowFeedback(null)
      }, 2000)
    }
  }

  const getQuestionText = () => {
    const weather = weatherTypes[currentWeather]
    switch (gameMode) {
      case "activities":
        return t("activityQuestion", { activity: weather.activities[0] })
      case "clothing":
        return t("clothingQuestion", { clothing: weather.clothing[0] })
      default:
        return t("weatherQuestion")
    }
  }

  const currentWeatherData = weatherTypes[currentWeather]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-sky-200 via-blue-200 to-indigo-200 p-4 ${language === "ar" ? "rtl" : "ltr"}`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToMenu")}
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-sky-800 mb-2">{t("title")}</h1>
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
            { mode: "learn" as const, label: t("learnMode"), color: "bg-blue-500" },
            { mode: "activities" as const, label: t("activitiesMode"), color: "bg-green-500" },
            { mode: "clothing" as const, label: t("clothingMode"), color: "bg-purple-500" },
          ].map(({ mode, label, color }) => (
            <Button
              key={mode}
              onClick={() => {
                setGameMode(mode)
                playSound("click")
              }}
              className={`${gameMode === mode ? color : "bg-gray-400"} hover:opacity-80 text-white`}
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
                <div className="text-9xl mb-6">{currentWeatherData.emoji}</div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{currentWeatherData.name}</h2>
                <p className="text-xl text-gray-600 mb-8">{currentWeatherData.description}</p>

                {/* Weather Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-100 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-3">{t("goodActivities")}</h3>
                    <ul className="space-y-2">
                      {currentWeatherData.activities.map((activity, index) => (
                        <li key={index} className="text-green-700">
                          • {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-purple-800 mb-3">{t("whatToWear")}</h3>
                    <ul className="space-y-2">
                      {currentWeatherData.clothing.map((item, index) => (
                        <li key={index} className="text-purple-700">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mb-6">
              <Button
                onClick={() => {
                  if (currentWeather > 0) {
                    setCurrentWeather(currentWeather - 1)
                    playSound("click")
                  }
                }}
                disabled={currentWeather === 0}
                className="bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-50"
              >
                {t("previousWeather")}
              </Button>
              <div className="bg-white/80 rounded-lg px-4 py-2 flex items-center">
                <span className="font-bold">
                  {currentWeather + 1} / {weatherTypes.length}
                </span>
              </div>
              <Button
                onClick={() => {
                  if (currentWeather < weatherTypes.length - 1) {
                    setCurrentWeather(currentWeather + 1)
                    playSound("click")
                  }
                }}
                disabled={currentWeather === weatherTypes.length - 1}
                className="bg-sky-600 hover:bg-sky-700 text-white disabled:opacity-50"
              >
                {t("nextWeather")}
              </Button>
            </div>
          </>
        ) : (
          /* Quiz Mode */
          <>
            <Card className="mb-8">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-6">{getQuestionText()}</h3>
                <div className="text-9xl mb-6">{currentWeatherData.emoji}</div>
              </CardContent>
            </Card>

            {/* Quiz Options */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quizOptions.map((option) => (
                    <Button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={showFeedback !== null}
                      className={`h-16 text-xl font-bold transition-all ${
                        selectedAnswer === option
                          ? showFeedback === "correct"
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : showFeedback === "wrong"
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-blue-500 hover:bg-blue-600 text-white"
                          : "bg-sky-500 hover:bg-sky-600 text-white"
                      }`}
                    >
                      {weatherTypes.find((w) => w.name === option)?.emoji} {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            {showFeedback && (
              <Card className="mb-6">
                <CardContent className="p-6 text-center">
                  {showFeedback === "correct" ? (
                    <div className="text-green-600">
                      <div className="text-6xl mb-2">🎉</div>
                      <h3 className="text-2xl font-bold">{t("correctFeedbackTitle")}</h3>
                      <p>{t("correctFeedbackText", { weather: currentWeatherData.name })}</p>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <div className="text-6xl mb-2">🤔</div>
                      <h3 className="text-2xl font-bold">{t("wrongFeedbackTitle")}</h3>
                      <p>{t("wrongFeedbackText", { weather: currentWeatherData.name })}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Weather Progress */}
        <div className="bg-white/80 rounded-lg p-4 mb-6">
          <h3 className="text-xl font-bold mb-3 text-center">{t("weatherProgress")}</h3>
          <div className="grid grid-cols-3 gap-2">
            {weatherTypes.map((weather, index) => (
              <div
                key={weather.name}
                className={`p-3 rounded-lg text-center font-bold cursor-pointer transition-all ${
                  index === currentWeather
                    ? "bg-sky-500 text-white"
                    : completedWeather.includes(weather.name)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => {
                  setCurrentWeather(index)
                  playSound("click")
                }}
              >
                <div className="text-2xl mb-1">{weather.emoji}</div>
                <div className="text-xs">{weather.name}</div>
                {completedWeather.includes(weather.name) && <div className="text-xs">✓</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-center">{t("howToPlay")}</h3>
          <ul className="space-y-2 text-gray-700">
            <li>
              • <strong>{t("learnMode")}:</strong> {t("learnModeDescription")}
            </li>
            <li>
              • <strong>{t("activitiesMode")}:</strong> {t("activitiesModeDescription")}
            </li>
            <li>
              • <strong>{t("clothingMode")}:</strong> {t("clothingModeDescription")}
            </li>
            <li>• {t("clickWeatherIcons")}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
