"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Volume2, Star, Play } from "lucide-react"

interface SoundRecognitionGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
}

export default function SoundRecognitionGame({ onScore, playSound, onBack }: SoundRecognitionGameProps) {
  const letterSounds = [
    { letter: "A", sound: "ay", phonetic: "/eɪ/" },
    { letter: "B", sound: "bee", phonetic: "/biː/" },
    { letter: "C", sound: "see", phonetic: "/siː/" },
    { letter: "D", sound: "dee", phonetic: "/diː/" },
    { letter: "E", sound: "ee", phonetic: "/iː/" },
    { letter: "F", sound: "eff", phonetic: "/ɛf/" },
    { letter: "G", sound: "gee", phonetic: "/dʒiː/" },
    { letter: "H", sound: "aitch", phonetic: "/eɪtʃ/" },
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)

  useEffect(() => {
    generateQuestion()
  }, [currentQuestion])

  const generateQuestion = () => {
    const correct = letterSounds[currentQuestion % letterSounds.length]
    const wrongOptions = letterSounds
      .filter((item) => item.letter !== correct.letter)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    const allOptions = [correct, ...wrongOptions].sort(() => Math.random() - 0.5).map((item) => item.letter)

    setOptions(allOptions)
    setShowFeedback(null)
  }

  const playLetterSound = (letter?: string) => {
    const targetLetter = letter || letterSounds[currentQuestion % letterSounds.length].letter
    const letterData = letterSounds.find((item) => item.letter === targetLetter)

    if (letterData) {
      // Create a more sophisticated sound for each letter
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Different frequencies for different letters
      const baseFreq = 200 + (letterData.letter.charCodeAt(0) - 65) * 50
      oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(baseFreq * 1.5, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.5)
    }

    playSound("click")
  }

  const handleAnswer = (selectedLetter: string) => {
    const correctLetter = letterSounds[currentQuestion % letterSounds.length].letter

    if (selectedLetter === correctLetter) {
      playSound("success")
      setScore(score + 25)
      onScore(25)
      setCorrectAnswers(correctAnswers + 1)
      setShowFeedback("correct")
    } else {
      playSound("wrong")
      setShowFeedback("wrong")
    }

    setTimeout(() => {
      if (currentQuestion < letterSounds.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        playSound("complete")
        alert(
          `🎉 Game Complete! You got ${correctAnswers + (selectedLetter === correctLetter ? 1 : 0)} out of ${letterSounds.length} correct!`,
        )
        setCurrentQuestion(0)
        setCorrectAnswers(0)
      }
    }, 2000)
  }

  const resetGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setCorrectAnswers(0)
    setShowFeedback(null)
    generateQuestion()
  }

  const currentLetter = letterSounds[currentQuestion % letterSounds.length]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-indigo-800 mb-2">🔊 Sound Recognition</h1>
            <p className="text-lg text-gray-700">Listen and match the sounds!</p>
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

        {/* Progress */}
        <div className="text-center mb-6">
          <div className="bg-white/80 rounded-lg p-4 inline-block">
            <span className="text-lg font-bold">
              Question {currentQuestion + 1} of {letterSounds.length}
            </span>
            <div className="w-64 bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / letterSounds.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Sound Player */}
        <Card className="mb-8">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Listen to the sound and pick the correct letter!</h2>
              <Button
                onClick={() => playLetterSound()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl px-8 py-4 rounded-full"
              >
                <Volume2 className="w-8 h-8 mr-3" />
                Play Sound
              </Button>
            </div>

            {/* Visual representation */}
            <div className="mb-4">
              <div className="text-6xl mb-2">🎵</div>
              <p className="text-gray-600">Sound: "{currentLetter.sound}"</p>
              <p className="text-sm text-gray-500">Phonetic: {currentLetter.phonetic}</p>
            </div>
          </CardContent>
        </Card>

        {/* Answer Options */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 text-center">Choose the correct letter:</h3>
            <div className="grid grid-cols-2 gap-4">
              {options.map((letter) => (
                <Button
                  key={letter}
                  onClick={() => handleAnswer(letter)}
                  disabled={showFeedback !== null}
                  className={`h-20 text-4xl font-bold transition-all ${
                    showFeedback === "correct" && letter === currentLetter.letter
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : showFeedback === "wrong" && letter === currentLetter.letter
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : showFeedback === "wrong" && letter !== currentLetter.letter
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-purple-500 hover:bg-purple-600 text-white"
                  }`}
                >
                  {letter}
                  <Play
                    className="w-4 h-4 ml-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      playLetterSound(letter)
                    }}
                  />
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
                  <h3 className="text-2xl font-bold">Correct!</h3>
                  <p>
                    Great job! The letter "{currentLetter.letter}" sounds like "{currentLetter.sound}"
                  </p>
                </div>
              ) : (
                <div className="text-red-600">
                  <div className="text-6xl mb-2">😅</div>
                  <h3 className="text-2xl font-bold">Try Again!</h3>
                  <p>
                    The correct answer is "{currentLetter.letter}" which sounds like "{currentLetter.sound}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="text-center mb-6">
          <Button onClick={resetGame} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg">
            🔄 Restart Game
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-center">📚 How to Play</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Click "Play Sound" to hear the letter pronunciation</li>
            <li>• Choose the correct letter from the four options</li>
            <li>• You can click the play icon next to each letter to hear how it sounds</li>
            <li>• Complete all questions to finish the game</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
