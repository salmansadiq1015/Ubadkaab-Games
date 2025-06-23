"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Volume2 } from "lucide-react"
import { useTranslations } from "next-intl"

interface AnimalsGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
  language: string
}

export default function AnimalsGame({ onScore, playSound, onBack, language }: AnimalsGameProps) {
  const t = useTranslations("AnimalsGame")

  const animals = [
    { name: "Cat", emoji: "🐱", sound: "Meow", habitat: "House", food: "Fish" },
    { name: "Dog", emoji: "🐶", sound: "Woof", habitat: "House", food: "Bones" },
    { name: "Cow", emoji: "🐄", sound: "Moo", habitat: "Farm", food: "Grass" },
    { name: "Pig", emoji: "🐷", sound: "Oink", habitat: "Farm", food: "Corn" },
    { name: "Duck", emoji: "🦆", sound: "Quack", habitat: "Pond", food: "Bread" },
    { name: "Lion", emoji: "🦁", sound: "Roar", habitat: "Jungle", food: "Meat" },
    { name: "Elephant", emoji: "🐘", sound: "Trumpet", habitat: "Safari", food: "Leaves" },
    { name: "Monkey", emoji: "🐵", sound: "Ooh-ooh", habitat: "Trees", food: "Bananas" },
  ]

  const [currentAnimal, setCurrentAnimal] = useState(0)
  const [gameMode, setGameMode] = useState<"sound" | "habitat" | "food">("sound")
  const [quizOptions, setQuizOptions] = useState<string[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)
  const [completedAnimals, setCompletedAnimals] = useState<string[]>([])

  useEffect(() => {
    generateQuizQuestion()
  }, [currentAnimal, gameMode])

  const generateQuizQuestion = () => {
    const correct = animals[currentAnimal]
    const wrongOptions = animals
      .filter((animal) => animal.name !== correct.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5).map((animal) => animal.name)

    setQuizOptions(allOptions)
    setSelectedAnswer(null)
    setShowFeedback(null)
  }

  const playAnimalSound = (animal: (typeof animals)[0]) => {
    // Create a more sophisticated sound based on the animal
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      if (audioContext.state === "suspended") {
        audioContext.resume()
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Different sound patterns for different animals
      switch (animal.name) {
        case "Cat":
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
          break
        case "Dog":
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1)
          break
        case "Cow":
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.2)
          break
        case "Lion":
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime)
          oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 0.3)
          break
        default:
          oscillator.frequency.setValueAtTime(500, audioContext.currentTime)
      }

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.log("Audio not supported")
    }

    playSound("click")
  }

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    playSound("click")

    const correctAnswer = animals[currentAnimal].name

    if (answer === correctAnswer) {
      playSound("success")
      setScore(score + 25)
      onScore(25)
      setShowFeedback("correct")

      if (!completedAnimals.includes(correctAnswer)) {
        setCompletedAnimals([...completedAnimals, correctAnswer])
      }

      setTimeout(() => {
        if (currentAnimal < animals.length - 1) {
          setCurrentAnimal(currentAnimal + 1)
        } else {
          playSound("complete")
          alert("🎉 Amazing! You know all the animals!")
          setCurrentAnimal(0)
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
    const animal = animals[currentAnimal]
    switch (gameMode) {
      case "sound":
        return t("question_sound", { sound: animal.sound })
      case "habitat":
        return t("question_habitat", { habitat: animal.habitat })
      case "food":
        return t("question_food", { food: animal.food })
      default:
        return t("question_default")
    }
  }

  const currentAnimalData = animals[currentAnimal]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-lime-200 via-green-200 to-emerald-200 p-4 ${language === "ar" ? "rtl" : ""}`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back_to_menu")}
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-800 mb-2">{t("animal_sounds")}</h1>
            <p className="text-lg text-gray-700">{t("learn_animals")}</p>
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
            { mode: "sound" as const, label: t("sounds"), color: "bg-blue-500" },
            { mode: "habitat" as const, label: t("homes"), color: "bg-green-500" },
            { mode: "food" as const, label: t("food"), color: "bg-orange-500" },
          ].map(({ mode, label, color }) => (
            <Button
              key={mode}
              onClick={() => {
                setGameMode(mode)
                playSound("click")
              }}
              className={`md:w-auto w-1/3 ${gameMode === mode ? color : "bg-gray-400"} hover:opacity-80 text-white`}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Animal Display */}
        <Card className="mb-8">
          <CardContent className="p-8 text-center">
            <div className="text-9xl mb-6">{currentAnimalData.emoji}</div>

            {/* Animal Info */}
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentAnimalData.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
                <div className="bg-blue-100 rounded-lg p-3">
                  <div className="font-bold text-blue-800">{t("sound")}</div>
                  <div>"{currentAnimalData.sound}"</div>
                  <Button
                    onClick={() => playAnimalSound(currentAnimalData)}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm"
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                    {t("play")}
                  </Button>
                </div>
                <div className="bg-green-100 rounded-lg p-3">
                  <div className="font-bold text-green-800">{t("home")}</div>
                  <div>{currentAnimalData.habitat}</div>
                </div>
                <div className="bg-orange-100 rounded-lg p-3">
                  <div className="font-bold text-orange-800">{t("eat")}</div>
                  <div>{currentAnimalData.food}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold mb-6 text-center">{getQuestionText()}</h3>
            <div className="grid grid-cols-2 gap-4">
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
                      : "bg-lime-500 hover:bg-lime-600 text-white"
                  }`}
                >
                  {animals.find((a) => a.name === option)?.emoji} {option}
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
                  <h3 className="text-2xl font-bold">{t("perfect")}</h3>
                  <p>{t("correct_animal_sound", { animal: currentAnimalData.name, sound: currentAnimalData.sound })}</p>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="text-6xl mb-2">🤔</div>
                  <h3 className="text-2xl font-bold">{t("try_again")}</h3>
                  <p>{t("correct_answer_is", { animal: currentAnimalData.name })}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Animal Progress */}
        <div className="bg-white/80 rounded-lg p-4 mb-6">
          <h3 className="text-xl font-bold mb-3 text-center">{t("animal_progress")}</h3>
          <div className="grid grid-cols-4 gap-2">
            {animals.map((animal, index) => (
              <div
                key={animal.name}
                className={`p-3 rounded-lg text-center font-bold cursor-pointer transition-all ${
                  index === currentAnimal
                    ? "bg-lime-500 text-white"
                    : completedAnimals.includes(animal.name)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => {
                  setCurrentAnimal(index)
                  playSound("click")
                }}
              >
                <div className="text-2xl mb-1">{animal.emoji}</div>
                <div className="text-xs">{animal.name}</div>
                {completedAnimals.includes(animal.name) && <div className="text-xs">✓</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-center">{t("how_to_play")}</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• {t("instruction_1")}</li>
            <li>• {t("instruction_2")}</li>
            <li>• {t("instruction_3")}</li>
            <li>• {t("instruction_4")}</li>
            <li>• {t("instruction_5")}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
