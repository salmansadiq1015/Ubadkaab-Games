"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2, Star, Trophy, BookOpen, Gamepad2, Brain } from "lucide-react"
import AlphabetMatchingGame from "@/components/alphabet-matching-game"
import LetterTracingGame from "@/components/letter-tracing-game"
import WordBuildingGame from "@/components/word-building-game"
import SoundRecognitionGame from "@/components/sound-recognition-game"
import MemoryGame from "@/components/memory-game"
import CountingGame from "@/components/counting-game"
import AdditionGame from "@/components/addition-game"
import ShapesGame from "@/components/shapes-game"
import AnimalsGame from "@/components/animals-game"
import WeatherGame from "@/components/weather-game"
import PlantsGame from "@/components/plants-game"
import JigsawGame from "@/components/jigsaw-game"
import PatternsGame from "@/components/patterns-game"
import SortingGame from "@/components/sorting-game"
import LanguageSelector from "@/components/language-selector"
import { type Language, getTranslation } from "@/lib/translations"

type GameType =
  | "menu"
  | "matching"
  | "tracing"
  | "wordbuilding"
  | "soundrecognition"
  | "memory"
  | "counting"
  | "addition"
  | "shapes"
  | "animals"
  | "weather"
  | "plants"
  | "jigsaw"
  | "patterns"
  | "sorting"

export default function AlphabetLearningGames() {
  const [currentGame, setCurrentGame] = useState<GameType>("menu")
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [language, setLanguage] = useState<Language>("en")

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("gameLanguage") as Language
    if (savedLanguage && ["en", "ar", "so"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when changed
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("gameLanguage", newLanguage)
  }

  const playSound = (type: "click" | "success" | "wrong" | "complete") => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      if (audioContext.state === "suspended") {
        audioContext.resume()
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      switch (type) {
        case "click":
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.1)
          break
        case "success":
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1)
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.3)
          break
        case "wrong":
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(250, audioContext.currentTime + 0.1)
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + 0.4)
          break
        case "complete":
          const frequencies = [523, 659, 784, 1047]
          frequencies.forEach((freq, index) => {
            const osc = audioContext.createOscillator()
            const gain = audioContext.createGain()
            osc.connect(gain)
            gain.connect(audioContext.destination)
            osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.2)
            gain.gain.setValueAtTime(0.2, audioContext.currentTime + index * 0.2)
            osc.start(audioContext.currentTime + index * 0.2)
            osc.stop(audioContext.currentTime + index * 0.2 + 0.3)
          })
          return
      }

      oscillator.start()
    } catch (error) {
      console.log("Audio not supported or blocked by browser")
    }
  }

  const games = [
    {
      id: "matching" as GameType,
      titleKey: "alphabetMatching" as const,
      descriptionKey: "matchLetters" as const,
      icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-pink-400 to-pink-600",
      difficulty: "easy" as const,
      category: "Alphabet",
    },
    {
      id: "tracing" as GameType,
      titleKey: "letterTracing" as const,
      descriptionKey: "traceLetters" as const,
      icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
      difficulty: "medium" as const,
      category: "Alphabet",
    },
    {
      id: "wordbuilding" as GameType,
      titleKey: "wordBuilding" as const,
      descriptionKey: "buildWords" as const,
      icon: <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-green-400 to-green-600",
      difficulty: "medium" as const,
      category: "Alphabet",
    },
    {
      id: "soundrecognition" as GameType,
      titleKey: "soundRecognition" as const,
      descriptionKey: "matchSounds" as const,
      icon: <Volume2 className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      difficulty: "hard" as const,
      category: "Alphabet",
    },
    {
      id: "memory" as GameType,
      titleKey: "memoryGame" as const,
      descriptionKey: "rememberPositions" as const,
      icon: <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-orange-400 to-orange-600",
      difficulty: "hard" as const,
      category: "Alphabet",
    },
    {
      id: "counting" as GameType,
      titleKey: "numberCounting" as const,
      descriptionKey: "learnCounting" as const,
      icon: <Star className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
      difficulty: "easy" as const,
      category: "Math",
    },
    {
      id: "addition" as GameType,
      titleKey: "simpleAddition" as const,
      descriptionKey: "addNumbers" as const,
      icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-amber-400 to-amber-600",
      difficulty: "medium" as const,
      category: "Math",
    },
    {
      id: "shapes" as GameType,
      titleKey: "shapeRecognition" as const,
      descriptionKey: "identifyShapes" as const,
      icon: <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-violet-400 to-violet-600",
      difficulty: "easy" as const,
      category: "Math",
    },
    {
      id: "animals" as GameType,
      titleKey: "animalSounds" as const,
      descriptionKey: "matchAnimalSounds" as const,
      icon: <Volume2 className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-lime-400 to-lime-600",
      difficulty: "easy" as const,
      category: "Science",
    },
    {
      id: "weather" as GameType,
      titleKey: "weatherPatterns" as const,
      descriptionKey: "learnWeather" as const,
      icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-sky-400 to-sky-600",
      difficulty: "medium" as const,
      category: "Science",
    },
    {
      id: "plants" as GameType,
      titleKey: "plantLifeCycle" as const,
      descriptionKey: "discoverPlants" as const,
      icon: <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-green-500 to-green-700",
      difficulty: "medium" as const,
      category: "Science",
    },
    {
      id: "jigsaw" as GameType,
      titleKey: "jigsawPuzzle" as const,
      descriptionKey: "completePuzzles" as const,
      icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-rose-400 to-rose-600",
      difficulty: "hard" as const,
      category: "Puzzle",
    },
    {
      id: "patterns" as GameType,
      titleKey: "patternMatching" as const,
      descriptionKey: "completePatterns" as const,
      icon: <Star className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
      difficulty: "medium" as const,
      category: "Puzzle",
    },
    {
      id: "sorting" as GameType,
      titleKey: "colorSorting" as const,
      descriptionKey: "sortObjects" as const,
      icon: <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8" />,
      color: "bg-gradient-to-br from-pink-500 to-pink-700",
      difficulty: "easy" as const,
      category: "Puzzle",
    },
  ]

  const renderGame = () => {
    const gameProps = {
      onScore: (points: number) => setScore(score + points),
      playSound,
      onBack: () => setCurrentGame("menu"),
      language,
    }

    switch (currentGame) {
      case "matching":
        return <AlphabetMatchingGame {...gameProps} />
      case "tracing":
        return <LetterTracingGame {...gameProps} />
      case "wordbuilding":
        return <WordBuildingGame {...gameProps} />
      case "soundrecognition":
        return <SoundRecognitionGame {...gameProps} />
      case "memory":
        return <MemoryGame {...gameProps} />
      case "counting":
        return <CountingGame {...gameProps} />
      case "addition":
        return <AdditionGame {...gameProps} />
      case "shapes":
        return <ShapesGame {...gameProps} />
      case "animals":
        return <AnimalsGame {...gameProps} />
      case "weather":
        return <WeatherGame {...gameProps} />
      case "plants":
        return <PlantsGame {...gameProps} />
      case "jigsaw":
        return <JigsawGame {...gameProps} />
      case "patterns":
        return <PatternsGame {...gameProps} />
      case "sorting":
        return <SortingGame {...gameProps} />
      default:
        return (
          <div
            className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200 p-2 sm:p-4"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="text-center mb-4 sm:mb-8">
                {/* Language Selector */}
                <div className="flex justify-end mb-4">
                  <LanguageSelector currentLanguage={language} onLanguageChange={handleLanguageChange} />
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2 sm:mb-4 animate-pulse">
                  {getTranslation(language, "title")}
                </h1>
                <p className="text-sm sm:text-lg md:text-xl text-gray-700 mb-4 sm:mb-6 px-4">
                  {getTranslation(language, "subtitle")}
                </p>

                {/* Score Display */}
                <div className="flex justify-center items-center gap-3 sm:gap-6 mb-4 sm:mb-8">
                  <div className="bg-white rounded-full px-3 sm:px-6 py-2 sm:py-3 shadow-lg">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500" />
                      <span className="text-lg sm:text-2xl font-bold text-gray-800">{score}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-full px-3 sm:px-6 py-2 sm:py-3 shadow-lg">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-orange-500" />
                      <span className="text-lg sm:text-2xl font-bold text-gray-800">
                        {getTranslation(language, "level")} {level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Games Grid */}
              <div className="mb-4 sm:mb-8">
                {["Alphabet", "Math", "Science", "Puzzle"].map((category) => (
                  <div key={category} className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-6 text-gray-800">
                      {category === "Alphabet" && "🔤"}
                      {category === "Math" && "🔢"}
                      {category === "Science" && "🔬"}
                      {category === "Puzzle" && "🧩"}{" "}
                      {getTranslation(language, `${category.toLowerCase()}Games` as any)}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                      {games
                        .filter((game) => game.category === category)
                        .map((game) => (
                          <Card
                            key={game.id}
                            className="overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer shadow-xl border-0"
                            onClick={() => {
                              playSound("click")
                              setCurrentGame(game.id)
                            }}
                          >
                            <CardContent className="p-0">
                              <div className={`${game.color} p-3 sm:p-6 text-white`}>
                                <div className="flex items-center justify-between mb-2 sm:mb-4">
                                  {game.icon}
                                  <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                    {getTranslation(language, `difficulty.${game.difficulty}` as any)}
                                  </span>
                                </div>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 leading-tight">
                                  {getTranslation(language, game.titleKey)}
                                </h3>
                                <p className="text-white/90 mb-2 sm:mb-4 text-sm sm:text-base leading-tight">
                                  {getTranslation(language, game.descriptionKey)}
                                </p>
                                <Button
                                  className="w-full bg-white/20 hover:bg-white/30 border-white/30 text-white text-sm sm:text-base"
                                  variant="outline"
                                >
                                  {getTranslation(language, "playNow")}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fun Characters */}
              <div className="text-center mt-8 sm:mt-12">
                <div className="text-4xl sm:text-6xl mb-2 sm:mb-4 animate-bounce">🦄 🌈 🎨 🎪 🎭</div>
                <p className="text-sm sm:text-lg text-gray-600 px-4">{getTranslation(language, "chooseGame")}</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return renderGame()
}
