"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAudio } from "@/contexts/audio-context"
import { useUser } from "@/contexts/user-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Star, Volume2, Target } from "lucide-react"
import Link from "next/link"

interface LevelChallenge {
  type: "letters" | "sounds" | "words" | "spelling" | "phonics"
  target: string[]
  description: string
  instruction: string
}

export default function AlphabetsGame() {
  const { t, alphabetData, language, isRTL } = useLanguage()
  const { playSound, speakText, speakArabic } = useAudio()
  const { updateScore } = useUser()
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [clickedLetters, setClickedLetters] = useState<Set<string>>(new Set())
  const [showFact, setShowFact] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState<LevelChallenge | null>(null)
  const [challengeProgress, setChallengeProgress] = useState<Set<string>>(new Set())
  const [userInput, setUserInput] = useState("")

  const generateLevelChallenge = (level: number): LevelChallenge => {
    const { letters, simpleWords } = alphabetData

    if (level <= 2) {
      // Basic letters
      const shuffledAlphabet = [...letters].sort(() => Math.random() - 0.5)
      const targetLetters = shuffledAlphabet.slice(0, Math.min(5 + level * 2, letters.length))
      return {
        type: "letters",
        target: targetLetters,
        description: `${t("learn")} ${targetLetters.length} ${t("letters")}`,
        instruction: t("clickLetter"),
      }
    } else if (level <= 5) {
      // Letter sounds challenge
      const targetLetters = [...letters].sort(() => Math.random() - 0.5).slice(0, 8)
      return {
        type: "sounds",
        target: targetLetters,
        description: t("letterSoundsChallenge"),
        instruction: t("listenAndFind"),
      }
    } else if (level <= 10) {
      // Simple words
      const levelWords = simpleWords.filter((word) => word.length <= Math.floor(level / 2) + 2)
      const targetWords = levelWords.sort(() => Math.random() - 0.5).slice(0, 5)
      return {
        type: "words",
        target: targetWords,
        description: t("wordRecognition"),
        instruction: t("spellWords"),
      }
    } else if (level <= 15) {
      // Spelling challenge
      const targetWords = simpleWords.sort(() => Math.random() - 0.5).slice(0, 3)
      return {
        type: "spelling",
        target: targetWords,
        description: t("spellingChallenge"),
        instruction: t("typeWord"),
      }
    } else {
      // Advanced phonics
      const complexWords = simpleWords.filter((word) => word.length >= 4)
      const targetWords = complexWords.sort(() => Math.random() - 0.5).slice(0, Math.min(level - 10, 8))
      return {
        type: "phonics",
        target: targetWords,
        description: t("advancedPhonics"),
        instruction: t("breakDownWords"),
      }
    }
  }

  useEffect(() => {
    setCurrentChallenge(generateLevelChallenge(level))
    setChallengeProgress(new Set())
    setUserInput("")
    setClickedLetters(new Set())
  }, [level, language]) // Reset when language changes

  const handleLetterClick = (letter: string) => {
    if (!currentChallenge) return

    setSelectedLetter(letter)
    setShowFact(false)

    // Play the letter sound with appropriate language
    if (language === "ar") {
      // For Arabic, use the Arabic TTS
      speakArabic(letter, letter)
    } else {
      playSound("letter", letter)
    }

    if (currentChallenge.type === "letters") {
      if (currentChallenge.target.includes(letter) && !challengeProgress.has(letter)) {
        setChallengeProgress((prev) => new Set([...prev, letter]))
        setScore((prev) => prev + 10 * level)
        playSound("correct")
      }
    } else if (currentChallenge.type === "words") {
      setUserInput((prev) => prev + letter)
    }

    // Show the letter for a moment
    setTimeout(() => {
      setSelectedLetter(null)
    }, 2000)
  }

  const handleWordComplete = () => {
    if (!currentChallenge || currentChallenge.type !== "words") return

    const currentWord = currentChallenge.target.find((word) => word === userInput && !challengeProgress.has(word))

    if (currentWord) {
      setChallengeProgress((prev) => new Set([...prev, currentWord]))
      setScore((prev) => prev + 25 * level)
      playSound("correct")

      // Speak in appropriate language
      if (language === "ar") {
        speakArabic(`أحسنت! لقد هجيت ${currentWord} بشكل صحيح!`, `Excellent! You spelled ${currentWord} correctly!`)
      } else if (language === "so") {
        speakText(`Si fiican! Waad qortay ${currentWord} si sax ah!`)
      } else {
        speakText(`Excellent! You spelled ${currentWord} correctly!`)
      }
    } else {
      playSound("wrong")
    }
    setUserInput("")
  }

  const handleSpellingSubmit = () => {
    if (!currentChallenge || currentChallenge.type !== "spelling") return

    const currentWord = currentChallenge.target.find(
      (word) => word.toLowerCase() === userInput.toLowerCase() && !challengeProgress.has(word),
    )

    if (currentWord) {
      setChallengeProgress((prev) => new Set([...prev, currentWord]))
      setScore((prev) => prev + 30 * level)
      playSound("correct")

      if (language === "ar") {
        speakArabic("إملاء مثالي!", "Perfect spelling!")
      } else if (language === "so") {
        speakText("Qoraal fiican!")
      } else {
        speakText("Perfect spelling!")
      }
    } else {
      playSound("wrong")
      speakText(t("tryAgain"))
    }
    setUserInput("")
  }

  const handleNextLevel = () => {
    if (challengeProgress.size >= currentChallenge?.target.length!) {
      setLevel((prev) => prev + 1)
      updateScore("alphabets", score, level)
      playSound("correct")

      if (language === "ar") {
        speakArabic(`المستوى ${level + 1} مفتوح! عمل رائع!`, `Level ${level + 1} unlocked! Great job!`)
      } else if (language === "so") {
        speakText(`Heerka ${level + 1} la furay! Shaqo fiican!`)
      } else {
        speakText(`Level ${level + 1} unlocked! Great job!`)
      }
    }
  }

  const handleShowFact = (letter: string) => {
    setShowFact(true)
    const fact = alphabetData.letterFacts[letter]
    if (fact) {
      if (language === "ar") {
        speakArabic(fact, fact)
      } else {
        speakText(fact, { rate: 0.8, pitch: 1.1 })
      }
    }
  }

  const handleRestart = () => {
    playSound("click")
    setScore(0)
    setLevel(1)
    setClickedLetters(new Set())
    setSelectedLetter(null)
    setShowFact(false)
    setChallengeProgress(new Set())
    setUserInput("")
  }

  const isLevelComplete = currentChallenge && challengeProgress.size >= currentChallenge.target.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-pink-50 to-orange-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className={`flex items-center justify-between mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Link href="/">
            <Button variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <ArrowLeft className={`w-4 h-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              {t("back")}
            </Button>
          </Link>

          <div className={`flex items-center space-x-4 ${isRTL ? "space-x-reverse" : ""}`}>
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
              <RotateCcw className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t("restart")}
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🔤 {t("alphabets")} 🔤
          </h1>
          {currentChallenge && (
            <div className="bg-white rounded-xl p-4 shadow-lg max-w-2xl mx-auto">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{currentChallenge.description}</h2>
              <p className="text-gray-600">{currentChallenge.instruction}</p>
              <div className="mt-2">
                <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-500 to-pink-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(challengeProgress.size / currentChallenge.target.length) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {t("progress")}: {challengeProgress.size}/{currentChallenge.target.length}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Challenge Content */}
        {currentChallenge?.type === "spelling" && (
          <div className="text-center mb-8">
            <Card className="bg-white shadow-lg max-w-md mx-auto">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">{t("listenAndType")}:</h3>
                {currentChallenge.target.map(
                  (word, index) =>
                    !challengeProgress.has(word) && (
                      <div key={word} className="mb-4">
                        <Button
                          onClick={() => {
                            if (language === "ar") {
                              speakArabic(word, word)
                            } else {
                              speakText(word, { rate: 0.6 })
                            }
                          }}
                          className="mb-2 bg-blue-500 hover:bg-blue-600"
                        >
                          <Volume2 className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                          {t("playWord")} {index + 1}
                        </Button>
                        <input
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                          className={`w-full p-2 border-2 border-gray-300 rounded-lg text-center text-lg font-bold ${isRTL ? "text-right" : "text-left"}`}
                          placeholder={t("typeWhatYouHear")}
                          onKeyPress={(e) => e.key === "Enter" && handleSpellingSubmit()}
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                        <Button onClick={handleSpellingSubmit} className="mt-2 kid-button" disabled={!userInput}>
                          {t("submit")}
                        </Button>
                      </div>
                    ),
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Word Building for word challenges */}
        {currentChallenge?.type === "words" && (
          <div className="text-center mb-8">
            <Card className="bg-white shadow-lg max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">{t("buildTheseWords")}:</h3>
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 ${isRTL ? "text-right" : "text-left"}`}>
                  {currentChallenge.target.map((word) => (
                    <div
                      key={word}
                      className={`p-3 rounded-lg border-2 ${
                        challengeProgress.has(word)
                          ? "border-green-500 bg-green-100 text-green-800"
                          : "border-gray-300 bg-gray-50"
                      }`}
                    >
                      <span className={`font-bold text-lg ${language === "ar" ? "font-arabic" : ""}`}>{word}</span>
                      {challengeProgress.has(word) && (
                        <Star className={`w-4 h-4 inline ${isRTL ? "mr-2" : "ml-2"} text-green-600`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">{t("yourWord")}:</p>
                  <p className={`text-2xl font-bold text-blue-600 ${language === "ar" ? "font-arabic" : ""}`}>
                    {userInput || "..."}
                  </p>
                  <div className="mt-2 space-x-2">
                    <Button
                      onClick={handleWordComplete}
                      disabled={!userInput}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      {t("completeWord")}
                    </Button>
                    <Button onClick={() => setUserInput("")} variant="outline">
                      {t("clear")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Selected Letter Display */}
        {selectedLetter && (
          <div className="text-center mb-8">
            <div className="inline-block bg-white rounded-3xl shadow-2xl p-8 animate-bounce">
              <span className={`text-8xl font-bold text-red-500 mb-4 block ${language === "ar" ? "font-arabic" : ""}`}>
                {selectedLetter}
              </span>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    if (language === "ar") {
                      speakArabic(selectedLetter, selectedLetter)
                    } else {
                      playSound("letter", selectedLetter)
                    }
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    if (language === "ar") {
                      speakArabic(selectedLetter, selectedLetter)
                    } else {
                      playSound("letter", selectedLetter)
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full active:scale-95"
                >
                  <Volume2 className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {t("hearAgain")}
                </Button>
                <Button
                  onClick={() => handleShowFact(selectedLetter)}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    handleShowFact(selectedLetter)
                  }}
                  variant="outline"
                  className={`${isRTL ? "mr-2" : "ml-2"} px-4 py-2 rounded-full active:scale-95`}
                >
                  {t("funFact")}!
                </Button>
              </div>
              {showFact && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                  <p className={`text-lg text-gray-700 ${language === "ar" ? "font-arabic text-right" : ""}`}>
                    {alphabetData.letterFacts[selectedLetter]}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Alphabet Grid */}
        <div
          className={`grid gap-4 max-w-4xl mx-auto mb-8 ${
            language === "ar"
              ? "grid-cols-4 sm:grid-cols-6 lg:grid-cols-7"
              : language === "so"
                ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
                : "grid-cols-4 sm:grid-cols-6 lg:grid-cols-8"
          }`}
        >
          {alphabetData.letters.map((letter) => (
            <Card
              key={letter}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                currentChallenge?.target.includes(letter) && challengeProgress.has(letter)
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg"
                  : currentChallenge?.target.includes(letter)
                    ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg"
                    : "bg-white hover:shadow-xl"
              } ${selectedLetter === letter ? "scale-125 animate-pulse" : ""}`}
              onClick={() => handleLetterClick(letter)}
              onTouchStart={(e) => {
                e.preventDefault()
                handleLetterClick(letter)
              }}
            >
              <CardContent className="p-4 text-center">
                <span className={`text-3xl font-bold ${language === "ar" ? "font-arabic" : ""}`}>{letter}</span>
                {currentChallenge?.target.includes(letter) && challengeProgress.has(letter) && (
                  <Star className="w-4 h-4 mx-auto mt-1 text-yellow-300" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Level Complete */}
        {isLevelComplete && (
          <div className="text-center mt-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto animate-bounce">
              <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 {t("levelComplete")}! 🎉</h2>
              <p className="text-lg text-gray-600 mb-4">
                {t("amazingWork")} {level}!
              </p>
              <Button onClick={handleNextLevel} className="kid-button">
                <Target className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t("nextLevel")}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
