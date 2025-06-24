"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AudioContextType {
  playSound: (soundType: "click" | "correct" | "wrong" | "letter" | "music", text?: string) => void
  playBackgroundMusic: () => void
  stopBackgroundMusic: () => void
  speakText: (text: string, options?: { rate?: number; pitch?: number; volume?: number; lang?: string }) => void
  speakArabic: (arabic: string, transliteration: string) => void
  isMuted: boolean
  toggleMute: () => void
  currentVoice: string
  setVoicePreference: (preference: "male" | "female") => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voicePreference, setVoicePreference] = useState<"male" | "female">("male")
  const [currentVoice, setCurrentVoice] = useState<string>("Loading...")
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize Web Audio Context for sound effects
    if (typeof window !== "undefined") {
      // Create audio context on user interaction
      const initAudio = () => {
        if (!audioContext && !isInitialized) {
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
            setAudioContext(ctx)
            setIsInitialized(true)

            // Resume context immediately
            if (ctx.state === "suspended") {
              ctx.resume().catch(console.warn)
            }
          } catch (error) {
            console.warn("Audio context initialization failed:", error)
          }
        }
      }

      // Initialize on first user interaction - comprehensive event coverage
      const handleFirstInteraction = (event: Event) => {
        initAudio()
        // Remove all listeners after first interaction
        document.removeEventListener("click", handleFirstInteraction, true)
        document.removeEventListener("touchstart", handleFirstInteraction, true)
        document.removeEventListener("touchend", handleFirstInteraction, true)
        document.removeEventListener("keydown", handleFirstInteraction, true)
        document.removeEventListener("pointerdown", handleFirstInteraction, true)
      }

      // Add listeners with capture phase for better mobile support
      document.addEventListener("click", handleFirstInteraction, true)
      document.addEventListener("touchstart", handleFirstInteraction, true)
      document.addEventListener("touchend", handleFirstInteraction, true)
      document.addEventListener("keydown", handleFirstInteraction, true)
      document.addEventListener("pointerdown", handleFirstInteraction, true)

      // Initialize Speech Synthesis
      if ("speechSynthesis" in window) {
        setSpeechSynthesis(window.speechSynthesis)

        // Load voices with retry mechanism
        const loadVoices = () => {
          const availableVoices = window.speechSynthesis.getVoices()
          if (availableVoices.length > 0) {
            setVoices(availableVoices)
            updateCurrentVoice(availableVoices)
          } else {
            // Retry after a short delay
            setTimeout(loadVoices, 100)
          }
        }

        loadVoices()
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }

    // Load preferences
    const savedMute = localStorage.getItem("audioMuted")
    if (savedMute) {
      setIsMuted(JSON.parse(savedMute))
    }

    const savedVoicePreference = localStorage.getItem("voicePreference") as "male" | "female"
    if (savedVoicePreference) {
      setVoicePreference(savedVoicePreference)
    }
  }, [])

  const updateCurrentVoice = (availableVoices: SpeechSynthesisVoice[]) => {
    const selectedVoice = getPreferredVoice(availableVoices)
    if (selectedVoice) {
      setCurrentVoice(selectedVoice.name)
    }
  }

  const getPreferredVoice = (availableVoices: SpeechSynthesisVoice[]) => {
    // Male voice keywords
    const maleKeywords = [
      "male",
      "man",
      "david",
      "alex",
      "daniel",
      "mark",
      "tom",
      "james",
      "john",
      "michael",
      "paul",
      "richard",
      "robert",
      "william",
      "masculine",
    ]

    // Female voice keywords
    const femaleKeywords = [
      "female",
      "woman",
      "samantha",
      "karen",
      "susan",
      "victoria",
      "zira",
      "hazel",
      "kate",
      "serena",
      "allison",
      "ava",
      "feminine",
    ]

    const keywords = voicePreference === "male" ? maleKeywords : femaleKeywords

    // First, try to find a voice with preferred gender in English
    let preferredVoice = availableVoices.find(
      (voice) =>
        voice.lang.startsWith("en") &&
        keywords.some((keyword) => voice.name.toLowerCase().includes(keyword.toLowerCase())),
    )

    // If no gender-specific voice found, try any English voice
    if (!preferredVoice) {
      preferredVoice = availableVoices.find((voice) => voice.lang.startsWith("en"))
    }

    // If still no voice, use the first available
    if (!preferredVoice) {
      preferredVoice = availableVoices[0]
    }

    return preferredVoice
  }

  const createTone = (frequency: number, duration: number, type: OscillatorType = "sine", volume = 0.3) => {
    if (!audioContext || isMuted) return

    try {
      // Ensure audio context is running
      if (audioContext.state === "suspended") {
        audioContext.resume().catch(console.warn)
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = type

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) {
      console.warn("Audio tone creation failed:", error)
    }
  }

  const speakText = (text: string, options: { rate?: number; pitch?: number; volume?: number; lang?: string } = {}) => {
    if (!speechSynthesis || isMuted) return

    try {
      // Cancel any ongoing speech
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)

      // Get preferred voice
      const preferredVoice = getPreferredVoice(voices)

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      // Set language if specified
      if (options.lang) {
        utterance.lang = options.lang
      }

      // Set speech parameters - adjusted for better clarity
      utterance.rate = options.rate || 0.7 // Slower for better understanding
      utterance.pitch = voicePreference === "male" ? options.pitch || 0.8 : options.pitch || 1.2 // Lower pitch for male
      utterance.volume = options.volume || 0.9

      // Add error handling
      utterance.onerror = (event) => {
        console.warn("Speech synthesis error:", event.error)
      }

      utterance.onend = () => {
        // Speech completed successfully
      }

      speechSynthesis.speak(utterance)
    } catch (error) {
      console.warn("Speech synthesis not available:", error)
    }
  }

  const speakArabic = (arabic: string, transliteration: string) => {
    if (!speechSynthesis || isMuted) return

    try {
      // Cancel any ongoing speech
      speechSynthesis.cancel()

      // Improve Arabic pronunciation by using phonetic spelling
      const improvedTransliteration = improveArabicPronunciation(transliteration)

      const utterance = new SpeechSynthesisUtterance(improvedTransliteration)

      // Try to find Arabic voice first, then fall back to English
      const arabicVoice = voices.find((voice) => voice.lang.startsWith("ar"))
      const preferredVoice = arabicVoice || getPreferredVoice(voices)

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      // Set language
      utterance.lang = arabicVoice ? "ar" : "en"

      // Slower rate for Arabic pronunciation
      utterance.rate = 0.5
      utterance.pitch = voicePreference === "male" ? 0.8 : 1.1
      utterance.volume = 0.9

      utterance.onerror = (event) => {
        console.warn("Arabic speech synthesis error:", event.error)
      }

      speechSynthesis.speak(utterance)
    } catch (error) {
      console.warn("Arabic speech synthesis failed:", error)
    }
  }

  const improveArabicPronunciation = (transliteration: string): string => {
    // Improve pronunciation by replacing common transliteration patterns
    let improved = transliteration

    // Common Arabic pronunciation improvements
    const replacements = [
      // Allah
      ["Allah", "Ah-lah"],
      ["allah", "ah-lah"],

      // Common words
      ["bismillah", "bis-mil-lah"],
      ["rahman", "rah-maan"],
      ["raheem", "ra-heem"],
      ["alhamdu", "al-ham-du"],
      ["lillahi", "lil-lah-hi"],
      ["rabbil", "rab-bil"],
      ["alameen", "ah-la-meen"],

      // Letters and sounds
      ["kh", "k"],
      ["gh", "g"],
      ["'", ""],
      ["aa", "ah"],
      ["ee", "ee"],
      ["oo", "oo"],
      ["dh", "th"],
      ["th", "s"],

      // Common endings
      ["een", "een"],
      ["oon", "oon"],
      ["aan", "aan"],
    ]

    replacements.forEach(([from, to]) => {
      const regex = new RegExp(from, "gi")
      improved = improved.replace(regex, to)
    })

    // Add pauses for better pronunciation
    improved = improved.replace(/\s+/g, " . ")

    return improved
  }

  const playSound = (soundType: "click" | "correct" | "wrong" | "letter" | "music", text?: string) => {
    if (isMuted) return

    // Ensure audio context is ready
    if (audioContext) {
      if (audioContext.state === "suspended") {
        audioContext.resume().catch(console.warn)
      }
    }

    switch (soundType) {
      case "click":
        // Gentle click sound
        createTone(800, 0.1, "sine", 0.2)
        break

      case "correct":
        // Happy sound with voice
        createTone(523, 0.15, "sine", 0.3)
        setTimeout(() => createTone(659, 0.15, "sine", 0.3), 100)
        setTimeout(() => createTone(784, 0.2, "sine", 0.3), 200)

        // Add encouraging voice
        setTimeout(() => {
          const encouragements = [
            "Excellent work!",
            "Outstanding!",
            "Well done!",
            "Perfect!",
            "Amazing job!",
            "Fantastic!",
            "You got it!",
            "Wonderful!",
            "Super job!",
            "Brilliant!",
          ]
          const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
          speakText(randomEncouragement, { rate: 0.8, pitch: voicePreference === "male" ? 0.9 : 1.3 })
        }, 300)
        break

      case "wrong":
        // Gentle wrong sound
        createTone(300, 0.3, "sine", 0.2)

        // Encouraging voice for wrong answers
        setTimeout(() => {
          const encouragements = [
            "Try again, you can do it!",
            "Keep trying, you're learning!",
            "Almost there, don't give up!",
            "Good effort, try once more!",
            "You're doing great, keep going!",
          ]
          const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
          speakText(randomEncouragement, { rate: 0.7, pitch: voicePreference === "male" ? 0.8 : 1.1 })
        }, 200)
        break

      case "letter":
        // Speak the letter with phonetic sound
        if (text) {
          // First play a gentle tone
          createTone(660, 0.2, "sine", 0.2)

          // Then speak the letter clearly
          setTimeout(() => {
            // Speak the letter name clearly
            speakText(`The letter ${text}`, { rate: 0.6, pitch: voicePreference === "male" ? 0.8 : 1.2 })

            // Then speak the phonetic sound
            setTimeout(() => {
              const phoneticSounds: { [key: string]: string } = {
                A: "A says ah, like in apple",
                B: "B says buh, like in ball",
                C: "C says kuh, like in cat",
                D: "D says duh, like in dog",
                E: "E says eh, like in elephant",
                F: "F says fuh, like in fish",
                G: "G says guh, like in goat",
                H: "H says huh, like in house",
                I: "I says ih, like in igloo",
                J: "J says juh, like in jump",
                K: "K says kuh, like in kite",
                L: "L says luh, like in lion",
                M: "M says muh, like in moon",
                N: "N says nuh, like in nest",
                O: "O says oh, like in octopus",
                P: "P says puh, like in pizza",
                Q: "Q says kwuh, like in queen",
                R: "R says ruh, like in rabbit",
                S: "S says sss, like in snake",
                T: "T says tuh, like in tree",
                U: "U says uh, like in umbrella",
                V: "V says vuh, like in violin",
                W: "W says wuh, like in water",
                X: "X says ks, like in box",
                Y: "Y says yuh, like in yellow",
                Z: "Z says zzz, like in zebra",
              }

              const phoneticSound = phoneticSounds[text.toUpperCase()]
              if (phoneticSound) {
                speakText(phoneticSound, { rate: 0.5, pitch: voicePreference === "male" ? 0.8 : 1.1 })
              }
            }, 2000)
          }, 100)
        }
        break

      case "music":
        // Musical note with voice
        const notes = [261, 294, 329, 349, 392, 440, 494]
        const randomNote = notes[Math.floor(Math.random() * notes.length)]
        createTone(randomNote, 0.4, "triangle", 0.3)

        // Sometimes add musical encouragement
        if (Math.random() > 0.7) {
          setTimeout(() => {
            const musicalPhrases = [
              "Beautiful music!",
              "Keep playing!",
              "Lovely sound!",
              "Musical magic!",
              "Great rhythm!",
            ]
            const randomPhrase = musicalPhrases[Math.floor(Math.random() * musicalPhrases.length)]
            speakText(randomPhrase, { rate: 0.8, pitch: voicePreference === "male" ? 0.9 : 1.2 })
          }, 500)
        }
        break
    }
  }

  const playBackgroundMusic = () => {
    if (isMuted || !audioContext) return

    // Resume audio context if needed
    if (audioContext.state === "suspended") {
      audioContext.resume()
    }

    // Gentle background melody
    const playMelody = () => {
      const melody = [523, 587, 659, 698, 784, 880, 988, 1047]
      let noteIndex = 0

      const playNextNote = () => {
        if (isMuted || !audioContext) return

        const frequency = melody[noteIndex % melody.length]
        createTone(frequency, 0.5, "sine", 0.05) // Very quiet background

        noteIndex++
        setTimeout(playNextNote, 2000) // Slower tempo
      }

      playNextNote()
    }

    playMelody()
  }

  const stopBackgroundMusic = () => {
    // Stop any ongoing speech and music
    if (speechSynthesis) {
      speechSynthesis.cancel()
    }
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    localStorage.setItem("audioMuted", JSON.stringify(newMuted))

    if (newMuted) {
      stopBackgroundMusic()
      if (speechSynthesis) {
        speechSynthesis.cancel()
      }
    }
  }

  const handleSetVoicePreference = (preference: "male" | "female") => {
    setVoicePreference(preference)
    localStorage.setItem("voicePreference", preference)
    updateCurrentVoice(voices)
  }

  return (
    <AudioContext.Provider
      value={{
        playSound,
        playBackgroundMusic,
        stopBackgroundMusic,
        speakText,
        speakArabic,
        isMuted,
        toggleMute,
        currentVoice,
        setVoicePreference: handleSetVoicePreference,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}
