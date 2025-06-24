"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface GameScore {
  game: string
  score: number
  level: number
  timestamp: number
}

interface UserProfile {
  name: string
  totalScore: number
  gamesPlayed: number
  scores: GameScore[]
  favoriteGame: string
}

interface UserContextType {
  profile: UserProfile
  updateScore: (game: string, score: number, level: number) => void
  resetProfile: () => void
}

const defaultProfile: UserProfile = {
  name: "Player",
  totalScore: 0,
  gamesPlayed: 0,
  scores: [],
  favoriteGame: "alphabets",
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [])

  const updateScore = (game: string, score: number, level: number) => {
    setProfile((prev) => {
      const newScore: GameScore = {
        game,
        score,
        level,
        timestamp: Date.now(),
      }

      const updatedProfile = {
        ...prev,
        totalScore: prev.totalScore + score,
        gamesPlayed: prev.gamesPlayed + 1,
        scores: [...prev.scores, newScore],
      }

      // Update favorite game based on most played
      const gameCount = updatedProfile.scores.reduce(
        (acc, s) => {
          acc[s.game] = (acc[s.game] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      updatedProfile.favoriteGame = Object.keys(gameCount).reduce((a, b) => (gameCount[a] > gameCount[b] ? a : b))

      localStorage.setItem("userProfile", JSON.stringify(updatedProfile))
      return updatedProfile
    })
  }

  const resetProfile = () => {
    setProfile(defaultProfile)
    localStorage.removeItem("userProfile")
  }

  return <UserContext.Provider value={{ profile, updateScore, resetProfile }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
