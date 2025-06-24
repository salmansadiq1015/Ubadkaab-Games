"use client"

import { useState, useEffect } from "react"

interface GameProgress {
  score: number
  level: number
  gamesPlayed: number
  bestScores: Record<string, number>
  achievements: string[]
}

const defaultProgress: GameProgress = {
  score: 0,
  level: 1,
  gamesPlayed: 0,
  bestScores: {},
  achievements: [],
}

export function useProgress() {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress)

  useEffect(() => {
    const saved = localStorage.getItem("kids-learning-progress")
    if (saved) {
      setProgress(JSON.parse(saved))
    }
  }, [])

  const updateProgress = (gameType: string, points: number, completed = false) => {
    setProgress((prev) => {
      const newProgress = {
        ...prev,
        score: prev.score + points,
        gamesPlayed: completed ? prev.gamesPlayed + 1 : prev.gamesPlayed,
        bestScores: {
          ...prev.bestScores,
          [gameType]: Math.max(prev.bestScores[gameType] || 0, points),
        },
      }

      // Level up logic
      if (newProgress.score >= prev.level * 100) {
        newProgress.level = prev.level + 1
        newProgress.achievements = [...prev.achievements, `Level ${newProgress.level} Reached!`]
      }

      localStorage.setItem("kids-learning-progress", JSON.stringify(newProgress))
      return newProgress
    })
  }

  const resetProgress = () => {
    setProgress(defaultProgress)
    localStorage.removeItem("kids-learning-progress")
  }

  return { progress, updateProgress, resetProgress }
}
