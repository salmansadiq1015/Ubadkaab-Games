"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

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
  isAudioReady: boolean
  debugInfo: string
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voicePreference, setVoicePreference] = useState<"male" | "female">("male")
  const [currentVoice, setCurrentVoice] = useState<string>("Loading...")
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [debugInfo, setDebugInfo] = useState("Initializing...")

  // Force audio initialization on component mount
  useEffect(() => {
    const initAudio = async () => {
      try {
        setDebugInfo("Starting audio initialization...")

        // Initialize Web Audio Context immediately
        if (typeof window !== "undefined") {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext

          if (AudioContextClass) {
            const ctx = new AudioContextClass()
            setAudioContext(ctx)
            setDebugInfo(`Audio context created: ${ctx.state}`)

            // Try to resume immediately (will work after user interaction)
            ctx
              .resume()
              .then(() => {
                setDebugInfo(`Audio context resumed: ${ctx.state}`)
                setIsAudioReady(true)
              })
              .catch(() => {
                setDebugInfo("Audio context needs user interaction")
              })
          } else {
            setDebugInfo("Web Audio API not supported")
          }

          // Initialize Speech Synthesis
          if ("speechSynthesis" in window) {
            setSpeechSynthesis(window.speechSynthesis)
            setDebugInfo((prev) => prev + " | Speech API available")

            // Load voices immediately
            const loadVoices = () => {
              const availableVoices = window.speechSynthesis.getVoices()
              setVoices(availableVoices)

              if (availableVoices.length > 0) {
                updateCurrentVoice(availableVoices)
                setDebugInfo((prev) => prev + ` | ${availableVoices.length} voices loaded`)
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
      } catch (error) {
        setDebugInfo(`Audio init error: ${error}`)
        console.error("Audio initialization failed:", error)
      }
    }

    initAudio()
  }, [])

  // Set up user interaction listeners for mobile
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleUserInteraction = async () => {
      if (hasUserInteracted) return

      setHasUserInteracted(true)
      setDebugInfo("User interaction detected")

      try {
        if (audioContext && audioContext.state === "suspended") {
          await audioContext.resume()
          setDebugInfo(`Audio resumed after interaction: ${audioContext.state}`)
          setIsAudioReady(true)
        }
      } catch (error) {
        setDebugInfo(`Resume error: ${error}`)
      }
    }

    // Comprehensive event listeners
    const events = ["click", "touchstart", "touchend", "keydown", "pointerdown", "mousedown"]
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { once: true, passive: true })
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction)
      })
    }
  }, [audioContext, hasUserInteracted])

  const updateCurrentVoice = (availableVoices: SpeechSynthesisVoice[]) => {
    const selectedVoice = getPreferredVoice(availableVoices)
    if (selectedVoice) {
      setCurrentVoice(selectedVoice.name)
    } else {
      setCurrentVoice("Default System Voice")
    }
  }

  const getPreferredVoice = (availableVoices: SpeechSynthesisVoice[]) => {
    if (availableVoices.length === 0) return null

    // Try to find English voice first
    const englishVoices = availableVoices.filter((voice) => voice.lang.startsWith("en"))

    if (englishVoices.length > 0) {
      return englishVoices[0]
    }

    return availableVoices[0]
  }

  // Simple beep function using multiple methods
  const createBeep = useCallback(
    (frequency = 800, duration = 200, volume = 0.3) => {
      if (isMuted) return

      try {
        // Method 1: Web Audio API
        if (audioContext && audioContext.state === "running") {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
          oscillator.type = "sine"

          gainNode.gain.setValueAtTime(0, audioContext.currentTime)
          gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)

          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + duration / 1000)

          setDebugInfo(`Beep played: ${frequency}Hz`)
          return
        }

        // Method 2: HTML5 Audio with data URL
        const audioData = generateBeepDataURL(frequency, duration, volume)
        const audio = new Audio(audioData)
        audio.volume = volume
        audio.play().catch(() => {
          setDebugInfo("HTML5 audio failed")
        })
      } catch (error) {
        setDebugInfo(`Beep error: ${error}`)

        // Method 3: Fallback - try to speak a sound
        if (speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance("beep")
          utterance.rate = 2
          utterance.pitch = 2
          utterance.volume = 0.1
          speechSynthesis.speak(utterance)
        }
      }
    },
    [audioContext, isMuted, speechSynthesis],
  )

  // Generate beep sound as data URL
  const generateBeepDataURL = (frequency: number, duration: number, volume: number) => {
    const sampleRate = 44100
    const samples = Math.floor((sampleRate * duration) / 1000)
    const buffer = new ArrayBuffer(44 + samples * 2)
    const view = new DataView(buffer)

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(0, "RIFF")
    view.setUint32(4, 36 + samples * 2, true)
    writeString(8, "WAVE")
    writeString(12, "fmt ")
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    writeString(36, "data")
    view.setUint32(40, samples * 2, true)

    // Generate sine wave
    for (let i = 0; i < samples; i++) {
      const sample = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * volume * 32767
      view.setInt16(44 + i * 2, sample, true)
    }

    const blob = new Blob([buffer], { type: "audio/wav" })
    return URL.createObjectURL(blob)
  }

  const speakText = useCallback(
    (text: string, options: { rate?: number; pitch?: number; volume?: number; lang?: string } = {}) => {
      if (!speechSynthesis || isMuted) return

      try {
        speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        const preferredVoice = getPreferredVoice(voices)

        if (preferredVoice) {
          utterance.voice = preferredVoice
        }

        utterance.rate = options.rate || 0.8
        utterance.pitch = options.pitch || 1.0
        utterance.volume = options.volume || 0.9

        if (options.lang) {
          utterance.lang = options.lang
        }

        utterance.onerror = (event) => {
          setDebugInfo(`Speech error: ${event.error}`)
        }

        speechSynthesis.speak(utterance)
        setDebugInfo(`Speaking: ${text.substring(0, 20)}...`)
      } catch (error) {
        setDebugInfo(`Speech failed: ${error}`)
      }
    },
    [speechSynthesis, isMuted, voices],
  )

  const speakArabic = useCallback(
    (arabic: string, transliteration: string) => {
      speakText(transliteration, { rate: 0.6, lang: "ar" })
    },
    [speakText],
  )

  const playSound = useCallback(
    (soundType: "click" | "correct" | "wrong" | "letter" | "music", text?: string) => {
      if (isMuted) return

      setDebugInfo(`Playing sound: ${soundType}`)

      switch (soundType) {
        case "click":
          createBeep(800, 100, 0.2)
          break

        case "correct":
          createBeep(523, 150, 0.3)
          setTimeout(() => createBeep(659, 150, 0.3), 100)
          setTimeout(() => createBeep(784, 200, 0.3), 200)

          setTimeout(() => {
            const encouragements = ["Excellent!", "Great job!", "Perfect!", "Well done!"]
            const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
            speakText(randomEncouragement, { rate: 0.8 })
          }, 400)
          break

        case "wrong":
          createBeep(300, 300, 0.2)
          setTimeout(() => {
            speakText("Try again!", { rate: 0.7 })
          }, 300)
          break

        case "letter":
          if (text) {
            createBeep(660, 200, 0.2)
            setTimeout(() => {
              speakText(`The letter ${text}`, { rate: 0.6 })
            }, 200)
          }
          break

        case "music":
          const notes = [261, 294, 329, 349, 392, 440, 494]
          const randomNote = notes[Math.floor(Math.random() * notes.length)]
          createBeep(randomNote, 400, 0.3)
          break
      }
    },
    [isMuted, createBeep, speakText],
  )

  const playBackgroundMusic = useCallback(() => {
    if (isMuted) return
    setDebugInfo("Background music started")
  }, [isMuted])

  const stopBackgroundMusic = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel()
    }
    setDebugInfo("Background music stopped")
  }, [speechSynthesis])

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    localStorage.setItem("audioMuted", JSON.stringify(newMuted))
    setDebugInfo(`Audio ${newMuted ? "muted" : "unmuted"}`)

    if (newMuted) {
      stopBackgroundMusic()
    }
  }, [isMuted, stopBackgroundMusic])

  const handleSetVoicePreference = useCallback(
    (preference: "male" | "female") => {
      setVoicePreference(preference)
      localStorage.setItem("voicePreference", preference)
      updateCurrentVoice(voices)
      setDebugInfo(`Voice preference: ${preference}`)
    },
    [voices],
  )

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
        isAudioReady,
        debugInfo,
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
