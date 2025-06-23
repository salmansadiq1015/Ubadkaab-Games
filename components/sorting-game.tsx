"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, RefreshCw } from "lucide-react"
import { useTranslations } from "next-intl"

interface SortingGameProps {
  onScore: (points: number) => void
  playSound: (type: "click" | "success" | "wrong" | "complete") => void
  onBack: () => void
  language: string
}

export default function SortingGame({ onScore, playSound, onBack, language }: SortingGameProps) {
  const t = useTranslations("SortingGame")

  const sortingCategories = [
    {
      name: "Colors",
      items: [
        { item: "🔴", category: "Red", color: "bg-red-200" },
        { item: "🔵", category: "Blue", color: "bg-blue-200" },
        { item: "🟢", category: "Green", color: "bg-green-200" },
        { item: "🟡", category: "Yellow", color: "bg-yellow-200" },
      ],
    },
    {
      name: "Sizes",
      items: [
        { item: "🐭", category: "Small", color: "bg-purple-200" },
        { item: "🐱", category: "Medium", color: "bg-blue-200" },
        { item: "🐘", category: "Large", color: "bg-green-200" },
        { item: "🦎", category: "Small", color: "bg-purple-200" },
        { item: "🐶", category: "Medium", color: "bg-blue-200" },
        { item: "🦏", category: "Large", color: "bg-green-200" },
      ],
    },
    {
      name: "Shapes",
      items: [
        { item: "⭐", category: "Stars", color: "bg-yellow-200" },
        { item: "❤️", category: "Hearts", color: "bg-red-200" },
        { item: "🔶", category: "Diamonds", color: "bg-orange-200" },
        { item: "🌟", category: "Stars", color: "bg-yellow-200" },
        { item: "💖", category: "Hearts", color: "bg-red-200" },
        { item: "🔸", category: "Diamonds", color: "bg-orange-200" },
      ],
    },
  ]

  const [currentCategory, setCurrentCategory] = useState(0)
  const [itemsToSort, setItemsToSort] = useState<Array<{ item: string; category: string; color: string }>>([])
  const [sortedItems, setSortedItems] = useState<{
    [key: string]: Array<{ item: string; category: string; color: string }>
  }>({})
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [draggedItem, setDraggedItem] = useState<{ item: string; category: string; color: string } | null>(null)

  useEffect(() => {
    resetSorting()
  }, [currentCategory])

  const resetSorting = () => {
    const categoryData = sortingCategories[currentCategory]
    const shuffledItems = [...categoryData.items].sort(() => Math.random() - 0.5)
    setItemsToSort(shuffledItems)

    // Initialize empty sorting bins
    const uniqueCategories = [...new Set(categoryData.items.map((item) => item.category))]
    const emptySorted: { [key: string]: Array<{ item: string; category: string; color: string }> } = {}
    uniqueCategories.forEach((cat) => {
      emptySorted[cat] = []
    })
    setSortedItems(emptySorted)
    setIsComplete(false)
  }

  const handleItemClick = (
    item: { item: string; category: string; color: string },
    fromUnsorted: boolean,
    fromCategory?: string,
  ) => {
    playSound("click")

    if (fromUnsorted) {
      // Move from unsorted to a category (we'll put it in the correct category automatically for simplicity)
      const newSorted = { ...sortedItems }
      newSorted[item.category] = [...newSorted[item.category], item]
      setSortedItems(newSorted)

      const newUnsorted = itemsToSort.filter((i) => i !== item)
      setItemsToSort(newUnsorted)

      // Check if sorting is complete
      if (newUnsorted.length === 0) {
        setTimeout(() => {
          playSound("success")
          setScore(score + 40)
          onScore(40)
          setIsComplete(true)

          setTimeout(() => {
            if (currentCategory < sortingCategories.length - 1) {
              setCurrentCategory(currentCategory + 1)
            } else {
              playSound("complete")
              alert(t("completeMessage"))
              setCurrentCategory(0)
            }
          }, 2000)
        }, 100)
      }
    } else {
      // Move back to unsorted
      if (fromCategory) {
        const newSorted = { ...sortedItems }
        newSorted[fromCategory] = newSorted[fromCategory].filter((i) => i !== item)
        setSortedItems(newSorted)
        setItemsToSort([...itemsToSort, item])
      }
    }
  }

  const nextCategory = () => {
    if (currentCategory < sortingCategories.length - 1) {
      setCurrentCategory(currentCategory + 1)
      playSound("click")
    }
  }

  const previousCategory = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1)
      playSound("click")
    }
  }

  const currentCategoryData = sortingCategories[currentCategory]
  const uniqueCategories = [...new Set(currentCategoryData.items.map((item) => item.category))]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-pink-200 via-rose-200 to-red-200 p-4 ${language === "ar" ? "rtl" : "ltr"}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onBack} variant="outline" className="bg-white/80">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToMenu")}
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-pink-800 mb-2">{t("gameTitle")}</h1>
            <p className="text-lg text-gray-700">{t("gameDescription")}</p>
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

        {/* Category Display */}
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t("sortBy")} {currentCategoryData.name}
            </h2>
            <p className="text-lg text-gray-600">{t("instruction")}</p>
          </CardContent>
        </Card>

        {/* Items to Sort */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 text-center">{t("itemsToSort")}</h3>
            <div className="flex justify-center gap-2 md:gap-4 flex-wrap min-h-[100px] bg-gray-100 rounded-lg p-2 md:p-4">
              {itemsToSort.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => handleItemClick(item, true)}
                  className="w-12 h-12 md:w-16 md:h-16 text-2xl md:text-4xl bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 transition-all hover:scale-110"
                >
                  {item.item}
                </Button>
              ))}
              {itemsToSort.length === 0 && <div className="text-gray-500 text-lg">{t("allItemsSorted")} 🎉</div>}
            </div>
          </CardContent>
        </Card>

        {/* Sorting Bins */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {uniqueCategories.map((category) => {
            const categoryItems = sortedItems[category] || []
            const sampleItem = currentCategoryData.items.find((item) => item.category === category)

            return (
              <Card key={category} className={`${sampleItem?.color} border-2 border-dashed border-gray-400`}>
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-xl font-bold text-center mb-4">{category}</h3>
                  <div className="min-h-[80px] md:min-h-[120px] bg-white/50 rounded-lg p-2 md:p-4 flex flex-wrap justify-center items-center gap-1 md:gap-2">
                    {categoryItems.map((item, index) => (
                      <Button
                        key={index}
                        onClick={() => handleItemClick(item, false, category)}
                        className="w-10 h-10 md:w-12 md:h-12 text-2xl md:text-3xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-300"
                      >
                        {item.item}
                      </Button>
                    ))}
                    {categoryItems.length === 0 && (
                      <div className="text-gray-400 text-sm">
                        {t("dropItemsHere", { category: category.toLowerCase() })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Completion Message */}
        {isComplete && (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-green-600 mb-2">{t("perfectSorting")}!</h2>
              <p className="text-lg text-gray-700">
                {t("sortedCorrectly", { category: currentCategoryData.name.toLowerCase() })}!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-2 md:gap-4 mb-6">
          <Button
            onClick={previousCategory}
            disabled={currentCategory === 0}
            className="bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-50"
          >
            {t("previousCategory")}
          </Button>
          <Button onClick={resetSorting} className="bg-pink-600 hover:bg-pink-700 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("reset")}
          </Button>
          <Button
            onClick={nextCategory}
            disabled={currentCategory === sortingCategories.length - 1}
            className="bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-50"
          >
            {t("nextCategory")}
          </Button>
        </div>

        {/* Progress */}
        <div className="bg-white/80 rounded-lg p-4 mb-6">
          <h3 className="text-xl font-bold mb-3 text-center">{t("sortingProgress")}</h3>
          <div className="grid grid-cols-3 gap-2">
            {sortingCategories.map((category, index) => (
              <div
                key={category.name}
                className={`p-3 rounded-lg text-center font-bold cursor-pointer transition-all ${
                  index === currentCategory ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => {
                  setCurrentCategory(index)
                  playSound("click")
                }}
              >
                <div className="text-lg mb-1">{category.name}</div>
                <div className="text-xs">{index === currentCategory ? t("current") : t("available")}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/80 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3 text-center">{t("howToPlay")}</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• {t("instruction1")}</li>
            <li>• {t("instruction2")}</li>
            <li>• {t("instruction3")}</li>
            <li>• {t("instruction4")}</li>
            <li>• {t("instruction5")}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
