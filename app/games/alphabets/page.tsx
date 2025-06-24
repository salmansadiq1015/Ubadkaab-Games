"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAudio } from "@/contexts/audio-context"
import { useUser } from "@/contexts/user-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Star, Volume2 } from "lucide-react"
import Link from "next/link"

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

// Fun facts about each letter
const letterFacts: { [key: string]: string } = {
  A: "A is for Apple! Apples are red, green, or yellow fruits.",
  B: "B is for Ball! Balls are round and fun to play with.",
  C: "C is for Cat! Cats say meow and love to purr.",
  D: "D is for Dog! Dogs are loyal friends who wag their tails.",
  E: "E is for Elephant! Elephants are big and have long trunks.",
  F: "F is for Fish! Fish swim in water and have fins.",
  G: "G is for Giraffe! Giraffes have very long necks.",
  H: "H is for House! Houses are where families live.",
  I: "I is for Ice cream! Ice cream is cold and sweet.",
  J: "J is for Jump! Jumping is fun exercise.",
  K: "K is for Kite! Kites fly high in the sky.",
  L: "L is for Lion! Lions are brave and strong.",
  M: "M is for Moon! The moon shines at night.",
  N: "N is for Nest! Birds build nests in trees.",
  O: "O is for Ocean! Oceans are big bodies of water.",
  P: "P is for Pizza! Pizza is a yummy food.",
  Q: "Q is for Queen! Queens wear beautiful crowns.",
  R: "R is for Rainbow! Rainbows have many colors.",
  S: "S is for Sun! The sun gives us light and warmth.",
  T: "T is for Tree! Trees give us shade and oxygen.",
  U: "U is for Umbrella! Umbrellas keep us dry in the rain.",
  V: "V is for Violin! Violins make beautiful music.",
  W: "W is for Water! Water is important for life.",
  X: "X is for Xylophone! Xylophones make musical sounds.",
  Y: "Y is for Yellow! Yellow is a bright, happy color.",
  Z: "Z is for Zebra! Zebras have black and white stripes.",
}

export default function AlphabetsGame() {
  const { t } = useLanguage()
  const { playSound, speakText } = useAudio()
  const { updateScore } = useUser()
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [clickedLetters, setClickedLetters] = useState<Set<string>>(new Set())
  const [showFact, setShowFact] = useState(false)

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter)
    setShowFact(false)

    // Play the letter sound with human voice
    playSound("letter", letter)

    if (!clickedLetters.has(letter)) {
      setClickedLetters((prev) => new Set([...prev, letter]))
      setScore((prev) => prev + 10)

      // Level up every 5 new letters
      if (clickedLetters.size % 5 === 4) {
        setLevel((prev) => prev + 1)
        playSound("correct")
      }
    }

    // Show the letter for a moment
    setTimeout(() => {
      setSelectedLetter(null)
    }, 3000) // Longer duration to allow voice to finish
  }

  const handleShowFact = (letter: string) => {
    setShowFact(true)
    const fact = letterFacts[letter]
    if (fact) {
      speakText(fact, { rate: 0.8, pitch: 1.1 })
    }
  }

  const handleRestart = () => {
    playSound("click")
    setScore(0)
    setLevel(1)
    setClickedLetters(new Set())
    setSelectedLetter(null)
    setShowFact(false)
  }

  useEffect(() => {
    if (clickedLetters.size === alphabet.length) {
      updateScore("alphabets", score, level)
      playSound("correct")
      setTimeout(() => {
        speakText("Congratulations! You've learned all the letters of the alphabet! You're amazing!", {
          rate: 0.9,
          pitch: 1.3,
        })
      }, 500)
    }
  }, [clickedLetters, score, level, updateScore])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-pink-50 to-orange-100">
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
            <Button onClick={handleRestart} variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("restart")}
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🔤 {t("alphabets")} 🔤
          </h1>
          <p className="text-xl text-gray-600">{t("clickLetter")}</p>
          <p className="text-lg text-gray-500 mt-2">👆 Tap letters to hear their sounds!</p>
        </div>

        {/* Selected Letter Display */}
        {selectedLetter && (
          <div className="text-center mb-8">
            <div className="inline-block bg-white rounded-3xl shadow-2xl p-8 animate-bounce">
              <span className="text-8xl font-bold text-red-500 mb-4 block">{selectedLetter}</span>
              <div className="space-y-2">
                <Button
                  onClick={() => playSound("letter", selectedLetter)}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    playSound("letter", selectedLetter)
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full active:scale-95"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Hear Again
                </Button>
                <Button
                  onClick={() => handleShowFact(selectedLetter)}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    handleShowFact(selectedLetter)
                  }}
                  variant="outline"
                  className="ml-2 px-4 py-2 rounded-full active:scale-95"
                >
                  Fun Fact!
                </Button>
              </div>
              {showFact && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                  <p className="text-lg text-gray-700">{letterFacts[selectedLetter]}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Alphabet Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 max-w-4xl mx-auto mb-8">
          {alphabet.map((letter) => (
            <Card
              key={letter}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                clickedLetters.has(letter)
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg"
                  : "bg-white hover:shadow-xl"
              } ${selectedLetter === letter ? "scale-125 animate-pulse" : ""}`}
              onClick={() => handleLetterClick(letter)}
              onTouchStart={(e) => {
                e.preventDefault()
                handleLetterClick(letter)
              }}
            >
              <CardContent className="p-4 text-center">
                <span className="text-3xl font-bold">{letter}</span>
                {clickedLetters.has(letter) && <Star className="w-4 h-4 mx-auto mt-1 text-yellow-300" />}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-full p-2 shadow-lg">
            <div className="bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(clickedLetters.size / alphabet.length) * 100}%` }}
              />
            </div>
            <p className="text-center mt-2 font-bold text-gray-700">
              {clickedLetters.size} / {alphabet.length} letters learned
            </p>
          </div>
        </div>

        {/* Completion Message */}
        {clickedLetters.size === alphabet.length && (
          <div className="text-center mt-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto animate-bounce">
              <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 {t("wellDone")} 🎉</h2>
              <p className="text-lg text-gray-600">You've learned all the letters!</p>
              <p className="text-sm text-gray-500 mt-2">You're ready to start reading!</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
