"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAudio } from "@/contexts/audio-context"
import { useUser } from "@/contexts/user-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Play, BookOpen, Star, Volume2 } from "lucide-react"
import Link from "next/link"

interface Surah {
  id: number
  name: string
  nameArabic: string
  meaning: string
  verses: { id: number; arabic: string; english: string; transliteration: string }[]
}

const surahs: Surah[] = [
  {
    id: 1,
    name: "Al-Fatiha",
    nameArabic: "الفاتحة",
    meaning: "The Opening",
    verses: [
      {
        id: 1,
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        english: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        transliteration: "Bismillahi ar-rahmani ar-raheem",
      },
      {
        id: 2,
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        english: "All praise is due to Allah, Lord of the worlds.",
        transliteration: "Alhamdu lillahi rabbil alameen",
      },
      {
        id: 3,
        arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
        english: "The Entirely Merciful, the Especially Merciful,",
        transliteration: "Ar-rahmani ar-raheem",
      },
      {
        id: 4,
        arabic: "مَالِكِ يَوْمِ الدِّينِ",
        english: "Sovereign of the Day of Recompense.",
        transliteration: "Maliki yawmi ad-deen",
      },
      {
        id: 5,
        arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        english: "It is You we worship and You we ask for help.",
        transliteration: "Iyyaka na'budu wa iyyaka nasta'een",
      },
      {
        id: 6,
        arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        english: "Guide us to the straight path",
        transliteration: "Ihdina as-sirata al-mustaqeem",
      },
      {
        id: 7,
        arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        english:
          "The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.",
        transliteration: "Sirata allatheena an'amta alayhim ghayri al-maghdoobi alayhim wa la ad-dalleen",
      },
    ],
  },
  {
    id: 112,
    name: "Al-Ikhlas",
    nameArabic: "الإخلاص",
    meaning: "The Sincerity",
    verses: [
      {
        id: 1,
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        english: "Say, He is Allah, [who is] One,",
        transliteration: "Qul huwa Allahu ahad",
      },
      {
        id: 2,
        arabic: "اللَّهُ الصَّمَدُ",
        english: "Allah, the Eternal Refuge.",
        transliteration: "Allahu as-samad",
      },
      {
        id: 3,
        arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        english: "He neither begets nor is born,",
        transliteration: "Lam yalid wa lam yulad",
      },
      {
        id: 4,
        arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        english: "Nor is there to Him any equivalent.",
        transliteration: "Wa lam yakun lahu kufuwan ahad",
      },
    ],
  },
  {
    id: 113,
    name: "Al-Falaq",
    nameArabic: "الفلق",
    meaning: "The Daybreak",
    verses: [
      {
        id: 1,
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        english: "Say, I seek refuge in the Lord of daybreak",
        transliteration: "Qul a'oodhu bi rabbil falaq",
      },
      {
        id: 2,
        arabic: "مِن شَرِّ مَا خَلَقَ",
        english: "From the evil of that which He created",
        transliteration: "Min sharri ma khalaq",
      },
      {
        id: 3,
        arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        english: "And from the evil of darkness when it settles",
        transliteration: "Wa min sharri ghasiqin itha waqab",
      },
      {
        id: 4,
        arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        english: "And from the evil of the blowers in knots",
        transliteration: "Wa min sharri an-naffathati fil uqad",
      },
      {
        id: 5,
        arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        english: "And from the evil of an envier when he envies.",
        transliteration: "Wa min sharri hasidin itha hasad",
      },
    ],
  },
  {
    id: 114,
    name: "An-Nas",
    nameArabic: "الناس",
    meaning: "Mankind",
    verses: [
      {
        id: 1,
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        english: "Say, I seek refuge in the Lord of mankind,",
        transliteration: "Qul a'oodhu bi rabbin nas",
      },
      {
        id: 2,
        arabic: "مَلِكِ النَّاسِ",
        english: "The Sovereign of mankind.",
        transliteration: "Malikin nas",
      },
      {
        id: 3,
        arabic: "إِلَٰهِ النَّاسِ",
        english: "The God of mankind,",
        transliteration: "Ilahin nas",
      },
      {
        id: 4,
        arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        english: "From the evil of the retreating whisperer",
        transliteration: "Min sharril waswasil khannas",
      },
      {
        id: 5,
        arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        english: "Who whispers [evil] into the breasts of mankind",
        transliteration: "Allathee yuwaswisu fee sudoorin nas",
      },
      {
        id: 6,
        arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        english: "From among the jinn and mankind.",
        transliteration: "Minal jinnati wan nas",
      },
    ],
  },
  {
    id: 111,
    name: "Al-Masad",
    nameArabic: "المسد",
    meaning: "The Palm Fibre",
    verses: [
      {
        id: 1,
        arabic: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ",
        english: "May the hands of Abu Lahab be ruined, and ruined is he.",
        transliteration: "Tabbat yada abee lahabin wa tabb",
      },
      {
        id: 2,
        arabic: "مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ",
        english: "His wealth will not avail him or that which he gained.",
        transliteration: "Ma aghna anhu maluhu wa ma kasab",
      },
      {
        id: 3,
        arabic: "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ",
        english: "He will [enter to] burn in a Fire of [blazing] flame",
        transliteration: "Sayasla naran thata lahab",
      },
      {
        id: 4,
        arabic: "وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ",
        english: "And his wife [as well] - the carrier of firewood.",
        transliteration: "Wamra-atuhu hammalatal hatab",
      },
      {
        id: 5,
        arabic: "فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ",
        english: "Around her neck is a rope of [twisted] fiber.",
        transliteration: "Fee jeedihaa hablum min masad",
      },
    ],
  },
  {
    id: 110,
    name: "An-Nasr",
    nameArabic: "النصر",
    meaning: "The Divine Support",
    verses: [
      {
        id: 1,
        arabic: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
        english: "When the victory of Allah has come and the conquest,",
        transliteration: "Itha jaa nasrullahi wal fath",
      },
      {
        id: 2,
        arabic: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
        english: "And you see the people entering into the religion of Allah in multitudes,",
        transliteration: "Wa ra-aytan nasa yadkhuloona fee deenil lahi afwaja",
      },
      {
        id: 3,
        arabic: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا",
        english:
          "Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance.",
        transliteration: "Fasabbih bihamdi rabbika wastaghfirh, innahu kana tawwaba",
      },
    ],
  },
  {
    id: 109,
    name: "Al-Kafirun",
    nameArabic: "الكافرون",
    meaning: "The Disbelievers",
    verses: [
      {
        id: 1,
        arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ",
        english: "Say, O disbelievers,",
        transliteration: "Qul ya ayyuhal kafiroon",
      },
      {
        id: 2,
        arabic: "لَا أَعْبُدُ مَا تَعْبُدُونَ",
        english: "I do not worship what you worship.",
        transliteration: "La a'budu ma ta'budoon",
      },
      {
        id: 3,
        arabic: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
        english: "Nor are you worshippers of what I worship.",
        transliteration: "Wa la antum abidoona ma a'bud",
      },
      {
        id: 4,
        arabic: "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ",
        english: "Nor will I be a worshipper of what you worship.",
        transliteration: "Wa la ana abidun ma abadtum",
      },
      {
        id: 5,
        arabic: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ",
        english: "Nor will you be worshippers of what I worship.",
        transliteration: "Wa la antum abidoona ma a'bud",
      },
      {
        id: 6,
        arabic: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
        english: "For you is your religion, and for me is my religion.",
        transliteration: "Lakum deenukum wa liya deen",
      },
    ],
  },
  {
    id: 108,
    name: "Al-Kawthar",
    nameArabic: "الكوثر",
    meaning: "The Abundance",
    verses: [
      {
        id: 1,
        arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
        english: "Indeed, We have granted you, [O Muhammad], al-Kawthar.",
        transliteration: "Inna a'taynaka al-kawthar",
      },
      {
        id: 2,
        arabic: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
        english: "So pray to your Lord and sacrifice [to Him alone].",
        transliteration: "Fasalli li rabbika wanhar",
      },
      {
        id: 3,
        arabic: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
        english: "Indeed, your enemy is the one cut off.",
        transliteration: "Inna shani-aka huwal abtar",
      },
    ],
  },
  {
    id: 107,
    name: "Al-Ma'un",
    nameArabic: "الماعون",
    meaning: "The Small Kindnesses",
    verses: [
      {
        id: 1,
        arabic: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ",
        english: "Have you seen the one who denies the Recompense?",
        transliteration: "Ara-aytal lathee yukaththibu bid-deen",
      },
      {
        id: 2,
        arabic: "فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ",
        english: "For that is the one who drives away the orphan",
        transliteration: "Fathalika allathee yadu'ul yateem",
      },
      {
        id: 3,
        arabic: "وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ",
        english: "And does not encourage the feeding of the poor.",
        transliteration: "Wa la yahuddu ala ta'amil miskeen",
      },
      {
        id: 4,
        arabic: "فَوَيْلٌ لِّلْمُصَلِّينَ",
        english: "So woe to those who pray",
        transliteration: "Fawaylun lil musalleen",
      },
      {
        id: 5,
        arabic: "الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ",
        english: "[But] who are heedless of their prayer",
        transliteration: "Allatheena hum an salatihim sahoon",
      },
      {
        id: 6,
        arabic: "الَّذِينَ هُمْ يُرَاءُونَ",
        english: "Those who make show [of their deeds]",
        transliteration: "Allatheena hum yura-oon",
      },
      {
        id: 7,
        arabic: "وَيَمْنَعُونَ الْمَاعُونَ",
        english: "But refuse [to give] small kindnesses.",
        transliteration: "Wa yamna'oonal ma'oon",
      },
    ],
  },
  {
    id: 106,
    name: "Quraysh",
    nameArabic: "قريش",
    meaning: "Quraysh",
    verses: [
      {
        id: 1,
        arabic: "لِإِيلَافِ قُرَيْشٍ",
        english: "For the accustomed security of the Quraysh",
        transliteration: "Li-eelafi quraysh",
      },
      {
        id: 2,
        arabic: "إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ",
        english: "Their accustomed security [in] the caravan of winter and summer",
        transliteration: "Eelafihim rihlata ash-shita-i was-sayf",
      },
      {
        id: 3,
        arabic: "فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ",
        english: "Let them worship the Lord of this House,",
        transliteration: "Falyabudoo rabba hatha al-bayt",
      },
      {
        id: 4,
        arabic: "الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ",
        english: "Who has fed them, [saving them] from hunger and made them safe from fear.",
        transliteration: "Allathee at'amahum min joo'in wa amanahum min khawf",
      },
    ],
  },
]

export default function QuranGame() {
  const { t } = useLanguage()
  const { playSound, speakText, speakArabic } = useAudio()
  const { updateScore } = useUser()
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null)
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)
  const [memorizedVerses, setMemorizedVerses] = useState<Set<string>>(new Set())
  const [isPlaying, setIsPlaying] = useState(false)

  const handleSurahSelect = (surah: Surah) => {
    playSound("click")
    setSelectedSurah(surah)
    setCurrentVerseIndex(0)
    setShowTranslation(false)
  }

  const handlePlayVerse = async () => {
    if (!selectedSurah || isPlaying) return

    setIsPlaying(true)
    const currentVerse = selectedSurah.verses[currentVerseIndex]

    // Play a gentle tone first
    playSound("music")

    // Then speak the Arabic text using improved pronunciation
    setTimeout(() => {
      speakArabic(currentVerse.arabic, currentVerse.transliteration)
    }, 500)

    // Update score
    setScore((prev) => prev + 5)

    // Reset playing state after speech
    setTimeout(() => {
      setIsPlaying(false)
    }, 4000)
  }

  const handlePlayFullSurah = async () => {
    if (!selectedSurah || isPlaying) return

    setIsPlaying(true)

    for (let i = 0; i < selectedSurah.verses.length; i++) {
      setCurrentVerseIndex(i)
      const verse = selectedSurah.verses[i]

      // Play tone
      playSound("music")

      // Speak verse with improved Arabic pronunciation
      await new Promise((resolve) => {
        speakArabic(verse.arabic, verse.transliteration)
        setTimeout(resolve, 5000) // Wait for speech to complete
      })

      // Pause between verses
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    setIsPlaying(false)
    setScore((prev) => prev + 50)
    playSound("correct")
  }

  const handleNextVerse = () => {
    if (!selectedSurah) return

    playSound("click")
    if (currentVerseIndex < selectedSurah.verses.length - 1) {
      setCurrentVerseIndex((prev) => prev + 1)
    } else {
      // Surah completed
      updateScore("quran", score, selectedSurah.id)
      playSound("correct")
      setTimeout(() => {
        speakText(`Congratulations! You have completed Surah ${selectedSurah.name}. May Allah bless you!`, {
          rate: 0.8,
          pitch: 1.1,
        })
      }, 500)
    }
  }

  const handlePrevVerse = () => {
    playSound("click")
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex((prev) => prev - 1)
    }
  }

  const handleMemorize = () => {
    if (!selectedSurah) return

    const verseKey = `${selectedSurah.id}-${currentVerseIndex}`
    setMemorizedVerses((prev) => new Set([...prev, verseKey]))
    setScore((prev) => prev + 20)
    playSound("correct")

    setTimeout(() => {
      speakText("Excellent! You have memorized this verse. Keep up the great work!", {
        rate: 0.8,
        pitch: 1.2,
      })
    }, 300)
  }

  const handleRestart = () => {
    playSound("click")
    setSelectedSurah(null)
    setCurrentVerseIndex(0)
    setScore(0)
    setShowTranslation(false)
    setMemorizedVerses(new Set())
    setIsPlaying(false)
  }

  const currentVerse = selectedSurah?.verses[currentVerseIndex]
  const isVerseMemorized = selectedSurah ? memorizedVerses.has(`${selectedSurah.id}-${currentVerseIndex}`) : false

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100">
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
              <span className="font-bold text-gray-800">Memorized: {memorizedVerses.size}</span>
            </div>
            <Button onClick={handleRestart} variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("restart")}
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
            📖 {t("quran")} 📖
          </h1>
          <p className="text-xl text-gray-600">Learn and memorize beautiful verses from the Quran</p>
        </div>

        {!selectedSurah ? (
          /* Surah Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {surahs.map((surah) => (
              <Card
                key={surah.id}
                className="cursor-pointer transition-all duration-300 transform hover:scale-105 bg-white shadow-lg hover:shadow-xl"
                onClick={() => handleSurahSelect(surah)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{surah.name}</h3>
                  <p className="text-2xl text-emerald-600 mb-2 font-arabic">{surah.nameArabic}</p>
                  <p className="text-sm text-gray-500 mb-4 italic">({surah.meaning})</p>
                  <p className="text-sm text-gray-600">{surah.verses.length} verses</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Verse Display */
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-2xl mb-6">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {t("surah")} {selectedSurah.name}
                  </h2>
                  <p className="text-3xl text-emerald-600 font-arabic mb-2">{selectedSurah.nameArabic}</p>
                  <p className="text-lg text-gray-600 italic mb-4">({selectedSurah.meaning})</p>
                  <p className="text-gray-600">
                    {t("verse")} {currentVerseIndex + 1} of {selectedSurah.verses.length}
                  </p>
                </div>

                {currentVerse && (
                  <div className="space-y-6">
                    {/* Arabic Text */}
                    <div className="text-center p-6 bg-emerald-50 rounded-xl">
                      <p className="text-3xl md:text-4xl text-emerald-800 font-arabic leading-relaxed mb-4">
                        {currentVerse.arabic}
                      </p>
                      {isVerseMemorized && (
                        <div className="mt-2">
                          <Star className="w-6 h-6 text-yellow-500 mx-auto" />
                          <p className="text-sm text-yellow-600 font-bold">Memorized!</p>
                        </div>
                      )}
                    </div>

                    {/* Transliteration */}
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className="text-lg text-gray-700 italic font-semibold">{currentVerse.transliteration}</p>
                    </div>

                    {/* Translation */}
                    {showTranslation && (
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <p className="text-lg text-blue-800">{currentVerse.english}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Controls */}
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <Button
                    onClick={handlePlayVerse}
                    disabled={isPlaying}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    {isPlaying ? "Playing..." : "Listen to Verse"}
                  </Button>

                  <Button
                    onClick={handlePlayFullSurah}
                    disabled={isPlaying}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play Full Surah
                  </Button>

                  <Button
                    onClick={() => setShowTranslation(!showTranslation)}
                    variant="outline"
                    className="px-6 py-3 rounded-full"
                  >
                    {showTranslation ? "Hide Translation" : "Show Translation"}
                  </Button>

                  <Button
                    onClick={handleMemorize}
                    disabled={isVerseMemorized}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full disabled:opacity-50"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    {isVerseMemorized ? "Memorized" : "Mark as Memorized"}
                  </Button>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <Button
                    onClick={handlePrevVerse}
                    disabled={currentVerseIndex === 0 || isPlaying}
                    variant="outline"
                    className="px-6 py-3"
                  >
                    Previous Verse
                  </Button>

                  <Button onClick={() => setSelectedSurah(null)} variant="outline" className="px-6 py-3">
                    Back to Surahs
                  </Button>

                  <Button
                    onClick={handleNextVerse}
                    disabled={isPlaying}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3"
                  >
                    {currentVerseIndex < selectedSurah.verses.length - 1 ? "Next Verse" : "Complete Surah"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <div className="bg-white rounded-full p-2 shadow-lg">
              <div className="bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-green-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${((currentVerseIndex + 1) / selectedSurah.verses.length) * 100}%` }}
                />
              </div>
              <p className="text-center mt-2 font-bold text-gray-700">
                Progress: {currentVerseIndex + 1}/{selectedSurah.verses.length} verses
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
