"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Shuffle } from "lucide-react"

interface WordBuildingGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
}

export default function WordBuildingGame({ onScore, playSound, onBack }: WordBuildingGameProps) {
  const words = [
    { word: "CAT", image: "🐱", hint: "A furry pet that says meow" },
    { word: "DOG", image: "🐶", hint: "A loyal pet that barks" },
    { word: "SUN", image: "☀️", hint: "Bright light in the sky" },
    { word: "TREE", image: "🌳", hint: "Tall plant with leaves" },
    { word: "FISH", image: "🐟", hint: "Swims in water" },
    { word: "BIRD", image: "🐦", hint: "Flies in the sky" },
    { word: "BOOK", image: "📚", hint: "You read this" },
    { word: "BALL", image: "⚽", hint: "Round toy to play with" },
  ]

  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([])
  const [selectedLetters, setSelectedLetters] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [completedWords, setCompletedWords] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)

  const currentWord = words[currentWordIndex]

  useEffect(() => {
    shuffleLetters()
  }, [currentWordIndex])

  const shuffleLetters = () => {
    const wordLetters = currentWord.word.split("")
    const extraLetters = ["X", "Y", "Z", "Q", "J", "K"].slice(0, 3)
    const allLetters = [...wordLetters, ...extraLetters]
    setShuffledLetters(allLetters.sort(() => Math.random() - 0.5))
    setSelectedLetters([])
    setShowHint(false)
  }

  const selectLetter = (letter: string, index: number) => {
    if (selectedLetters.length < currentWord.word.length) {
      playSound("click")
      setSelectedLetters([...selectedLetters, letter])
      setShuffledLetters(shuffledLetters.filter((_, i) => i !== index))
    }
  }

  const removeLetter = (index: number) => {
    playSound("click")
    const letter = selectedLetters[index]
    setSelectedLetters(selectedLetters.filter((_, i) => i !== index))
    setShuffledLetters([...shuffledLetters, letter])
  }

  const checkWord = () => {
    const builtWord = selectedLetters.join("")
    if (builtWord === currentWord.word) {
      playSound("success")
      if (!completedWords.includes(currentWord.word)) {
        setCompletedWords([...completedWords, currentWord.word])
        setScore(score + 20)
        onScore(20)
      }
      setTimeout(() => {
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(currentWordIndex + 1)
        } else {
          playSound("complete")
          alert("🎉 Congratulations! You completed all words!")
        }
      }, 1000)
    } else {
      playSound("wrong")
      // Shake animation could be added here
    }
  }

  const nextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
      playSound("click")
    }
  }

  const previousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1)
      playSound("click")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-yellow-200 to-red-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-orange-800 mb-2">🔤 Word Building</h1>
            <p className="text-lg text-gray-700">Build words from letters!</p>
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

        {/* Current Word Display */}
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <div className="text-8xl mb-4">{currentWord.image}</div>
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: currentWord.word.length }).map((_, index) => (
                <div
                  key={index}
                  className="w-16 h-16 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-2xl font-bold bg-white/50"
                >
                  {selectedLetters[index] || ""}
                </div>
              ))}
            </div>
            <Button onClick={() => setShowHint(!showHint)} variant="outline" className="mb-4 bg-white/80">
              💡 {showHint ? "Hide" : "Show"} Hint
            </Button>
            {showHint && <p className="text-lg text-gray-700 bg-yellow-100 p-3 rounded-lg">{currentWord.hint}</p>}
          </CardContent>
        </Card>

        {/* Selected Letters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="text-xl font-bold mb-3 text-center">Your Word</h3>
            <div className="flex justify-center gap-2 mb-4">
              {selectedLetters.map((letter, index) => (
                <Button
                  key={index}
                  onClick={() => removeLetter(index)}
                  className="w-12 h-12 text-xl font-bold bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {letter}
                </Button>
              ))}
            </div>
            <div className="text-center">
              <Button
                onClick={checkWord}
                disabled={selectedLetters.length !== currentWord.word.length}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg disabled:opacity-50"
              >
                ✓ Check Word
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Letters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold">Available Letters</h3>
              <Button onClick={shuffleLetters} variant="outline" className="bg-white/80">
                <Shuffle className="w-4 h-4 mr-2" />
                Shuffle
              </Button>
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              {shuffledLetters.map((letter, index) => (
                <Button
                  key={index}
                  onClick={() => selectLetter(letter, index)}
                  className="w-12 h-12 text-xl font-bold bg-purple-500 hover:bg-purple-600 text-white"
                >
                  {letter}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            onClick={previousWord}
            disabled={currentWordIndex === 0}
            className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
          >
            ← Previous Word
          </Button>
          <div className="bg-white/80 rounded-lg px-4 py-2 flex items-center">
            <span className="font-bold">
              {currentWordIndex + 1} / {words.length}
            </span>
          </div>
          <Button
            onClick={nextWord}
            disabled={currentWordIndex === words.length - 1}
            className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
          >
            Next Word →
          </Button>
        </div>

        {/* Progress */}
        <div className="bg-white/80 rounded-lg p-4">
          <h3 className="text-xl font-bold mb-3 text-center">📈 Progress</h3>
          <div className="grid grid-cols-4 gap-2">
            {words.map((word, index) => (
              <div
                key={word.word}
                className={`p-3 rounded-lg text-center font-bold cursor-pointer transition-all ${
                  index === currentWordIndex
                    ? "bg-orange-500 text-white"
                    : completedWords.includes(word.word)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => {
                  setCurrentWordIndex(index)
                  playSound("click")
                }}
              >
                <div className="text-2xl mb-1">{word.image}</div>
                <div className="text-xs">{word.word}</div>
                {completedWords.includes(word.word) && <div className="text-xs">✓</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
