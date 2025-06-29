"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ar" | "so"

interface AlphabetData {
  letters: string[]
  letterFacts: { [key: string]: string }
  simpleWords: string[]
  numbers: string[]
  colors: string[]
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
  alphabetData: AlphabetData
}

const translations = {
  en: {
    // Navigation
    home: "Home",
    games: "Games",
    profile: "Profile",
    settings: "Settings",

    // Game Categories
    alphabets: "Alphabets",
    drawing: "Drawing",
    quizzes: "Quizzes",
    math: "Math Games",
    science: "Science",
    puzzles: "Puzzles",
    music: "Music",
    quran: "Quran Learning",

    // Common
    play: "Play",
    start: "Start",
    next: "Next",
    back: "Back",
    score: "Score",
    level: "Level",
    restart: "Restart",
    correct: "Correct!",
    tryAgain: "Try Again",
    wellDone: "Well Done!",
    time: "Time",
    points: "points",
    save: "Save",
    clear: "Clear",

    // Alphabets
    clickLetter: "Click on a letter to hear its sound!",
    learn: "Learn",
    letters: "letters",
    letterSoundsChallenge: "Letter Sounds Challenge",
    listenAndFind: "Listen and find the correct letter!",
    wordRecognition: "Word Recognition",
    spellWords: "Spell these words using the letters!",
    spellingChallenge: "Spelling Challenge",
    typeWord: "Type the word you hear!",
    advancedPhonics: "Advanced Phonics",
    breakDownWords: "Break down these words into sounds!",
    progress: "Progress",
    listenAndType: "Listen and Type",
    playWord: "Play Word",
    typeWhatYouHear: "Type what you hear...",
    submit: "Submit",
    buildTheseWords: "Build These Words",
    yourWord: "Your word",
    completeWord: "Complete Word",
    hearAgain: "Hear Again",
    funFact: "Fun Fact",
    levelComplete: "Level Complete",
    amazingWork: "Amazing work on level",
    nextLevel: "Next Level",

    // Drawing
    freeDrawing: "Free Drawing",
    drawAnything: "Draw anything you like!",
    letCreativityFlow: "Let your creativity flow! Draw whatever makes you happy.",
    letterPractice: "Letter Practice",
    drawLetter: "Draw the letter",
    practiceWriting: "Practice writing the letter",
    makeItBig: "Make it big and colorful",
    wordPractice: "Word Practice",
    drawWord: "Draw the word",
    writeWord: "Write the word",
    inBeautifulLetters: "in beautiful letters",
    shapeChallenge: "Shape Challenge",
    drawA: "Draw a",
    canYouDraw: "Can you draw a",
    makeItColorful: "Make it colorful",
    objectDrawing: "Object Drawing",
    drawCreative: "Draw a creative",
    addDetails: "Add details and colors to make it special",
    patternChallenge: "Pattern Challenge",
    createPattern: "Create a",
    fillCanvas: "Fill the canvas with a",
    usingColors: "using these specific colors",
    storyIllustration: "Story Illustration",
    illustrate: "Illustrate",
    drawScene: "Draw a scene showing",
    tellStory: "Tell a story with your art",
    colors: "Colors",
    brushSize: "Brush Size",
    colorsUsed: "Colors Used",
    strokes: "Strokes",
    completeDrawing: "Complete Drawing",
    useMouseOrTouch: "Use mouse or touch to draw",
    artworkComplete: "Artwork Complete",
    challenge: "Challenge",
    totalStrokes: "Total Strokes",
    finalScore: "Final Score",
    saveArtwork: "Save Artwork",
    nextChallenge: "Next Challenge",
    greatArtwork: "Great artwork!",
    perfectColorUsage: "Perfect color usage!",
    excellentPractice: "Excellent practice!",
    timeBonus: "Time bonus",
    youEarned: "You earned",
    bonusPoints: "bonus points",
    hearLetter: "Hear Letter",
    hearWord: "Hear Word",
    requiredColors: "Required Colors",
    used: "Used",

    // Math
    addition: "Addition",
    subtraction: "Subtraction",
    multiplication: "Multiplication",
    division: "Division",

    // Quran
    surah: "Surah",
    verse: "Verse",
    listen: "Listen",

    // Profile
    totalScore: "Total Score",
    gamesPlayed: "Games Played",
    favoriteGame: "Favorite Game",

    // Shapes
    circle: "circle",
    square: "square",
    triangle: "triangle",
    rectangle: "rectangle",
    star: "star",
    heart: "heart",
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    games: "الألعاب",
    profile: "الملف الشخصي",
    settings: "الإعدادات",

    // Game Categories
    alphabets: "الحروف الأبجدية",
    drawing: "الرسم",
    quizzes: "الاختبارات",
    math: "ألعاب الرياضيات",
    science: "العلوم",
    puzzles: "الألغاز",
    music: "الموسيقى",
    quran: "تعلم القرآن",

    // Common
    play: "العب",
    start: "ابدأ",
    next: "التالي",
    back: "رجوع",
    score: "النقاط",
    level: "المستوى",
    restart: "إعادة البدء",
    correct: "صحيح!",
    tryAgain: "حاول مرة أخرى",
    wellDone: "أحسنت!",
    time: "الوقت",
    points: "نقاط",
    save: "حفظ",
    clear: "مسح",

    // Alphabets
    clickLetter: "انقر على حرف لسماع صوته!",
    learn: "تعلم",
    letters: "حروف",
    letterSoundsChallenge: "تحدي أصوات الحروف",
    listenAndFind: "استمع وابحث عن الحرف الصحيح!",
    wordRecognition: "التعرف على الكلمات",
    spellWords: "اهجي هذه الكلمات باستخدام الحروف!",
    spellingChallenge: "تحدي الإملاء",
    typeWord: "اكتب الكلمة التي تسمعها!",
    advancedPhonics: "علم الأصوات المتقدم",
    breakDownWords: "قسم هذه الكلمات إلى أصوات!",
    progress: "التقدم",
    listenAndType: "استمع واكتب",
    playWord: "شغل الكلمة",
    typeWhatYouHear: "اكتب ما تسمعه...",
    submit: "إرسال",
    buildTheseWords: "اصنع هذه الكلمات",
    yourWord: "كلمتك",
    completeWord: "أكمل الكلمة",
    hearAgain: "استمع مرة أخرى",
    funFact: "حقيقة ممتعة",
    levelComplete: "المستوى مكتمل",
    amazingWork: "عمل رائع في المستوى",
    nextLevel: "المستوى التالي",

    // Drawing
    freeDrawing: "الرسم الحر",
    drawAnything: "ارسم أي شيء تحبه!",
    letCreativityFlow: "دع إبداعك يتدفق! ارسم ما يجعلك سعيداً.",
    letterPractice: "تدريب الحروف",
    drawLetter: "ارسم الحرف",
    practiceWriting: "تدرب على كتابة الحرف",
    makeItBig: "اجعله كبيراً وملوناً",
    wordPractice: "تدريب الكلمات",
    drawWord: "ارسم الكلمة",
    writeWord: "اكتب الكلمة",
    inBeautifulLetters: "بحروف جميلة",
    shapeChallenge: "تحدي الأشكال",
    drawA: "ارسم",
    canYouDraw: "هل يمكنك رسم",
    makeItColorful: "اجعله ملوناً",
    objectDrawing: "رسم الأشياء",
    drawCreative: "ارسم",
    addDetails: "أضف التفاصيل والألوان لتجعله مميزاً",
    patternChallenge: "تحدي الأنماط",
    createPattern: "أنشئ نمط",
    fillCanvas: "املأ اللوحة بنمط",
    usingColors: "باستخدام هذه الألوان المحددة",
    storyIllustration: "رسم القصص",
    illustrate: "ارسم",
    drawScene: "ارسم مشهداً يُظهر",
    tellStory: "احك قصة بفنك",
    colors: "الألوان",
    brushSize: "حجم الفرشاة",
    colorsUsed: "الألوان المستخدمة",
    strokes: "الضربات",
    completeDrawing: "أكمل الرسم",
    useMouseOrTouch: "استخدم الماوس أو اللمس للرسم",
    artworkComplete: "العمل الفني مكتمل",
    challenge: "تحدي",
    totalStrokes: "إجمالي الضربات",
    finalScore: "النتيجة النهائية",
    saveArtwork: "احفظ العمل الفني",
    nextChallenge: "التحدي التالي",
    greatArtwork: "عمل فني رائع!",
    perfectColorUsage: "استخدام مثالي للألوان!",
    excellentPractice: "تدريب ممتاز!",
    timeBonus: "مكافأة الوقت",
    youEarned: "لقد حصلت على",
    bonusPoints: "نقاط إضافية",
    hearLetter: "استمع للحرف",
    hearWord: "استمع للكلمة",
    requiredColors: "الألوان المطلوبة",
    used: "مستخدم",

    // Math
    addition: "الجمع",
    subtraction: "الطرح",
    multiplication: "الضرب",
    division: "القسمة",

    // Quran
    surah: "سورة",
    verse: "آية",
    listen: "استمع",

    // Profile
    totalScore: "مجموع النقاط",
    gamesPlayed: "الألعاب المُلعبة",
    favoriteGame: "اللعبة المفضلة",

    // Shapes
    circle: "دائرة",
    square: "مربع",
    triangle: "مثلث",
    rectangle: "مستطيل",
    star: "نجمة",
    heart: "قلب",
  },
  so: {
    // Navigation
    home: "Guriga",
    games: "Ciyaaraha",
    profile: "Xogta Shakhsiga",
    settings: "Dejinta",

    // Game Categories
    alphabets: "Xarfaha",
    drawing: "Sawirka",
    quizzes: "Imtixaannada",
    math: "Ciyaaraha Xisaabta",
    science: "Sayniska",
    puzzles: "Halxiraale",
    music: "Muusiga",
    quran: "Barashada Quraanka",

    // Common
    play: "Ciyaar",
    start: "Bilow",
    next: "Xiga",
    back: "Dib u noqo",
    score: "Dhibcaha",
    level: "Heerka",
    restart: "Dib u bilow",
    correct: "Sax!",
    tryAgain: "Mar kale isku day",
    wellDone: "Si fiican!",
    time: "Waqtiga",
    points: "dhibco",
    save: "Kaydi",
    clear: "Nadiifi",

    // Alphabets
    clickLetter: "Riix xaraf si aad u maqasho codkiisa!",
    learn: "Baro",
    letters: "xarfo",
    letterSoundsChallenge: "Tartanka Codadka Xarfaha",
    listenAndFind: "Dhegayso oo hel xarfka saxda ah!",
    wordRecognition: "Aqoonsiga Erayada",
    spellWords: "Qor erayadan adoo isticmaalaya xarfaha!",
    spellingChallenge: "Tartanka Qoraalka",
    typeWord: "Qor erayga aad maqasho!",
    advancedPhonics: "Codadka Horumarsan",
    breakDownWords: "U kala qaybi erayadan codadka!",
    progress: "Horumar",
    listenAndType: "Dhegayso oo Qor",
    playWord: "Ciyaar Erayga",
    typeWhatYouHear: "Qor waxa aad maqasho...",
    submit: "Dir",
    buildTheseWords: "Dhis Erayadan",
    yourWord: "Eraygaaga",
    completeWord: "Dhamaystir Erayga",
    hearAgain: "Maqal Mar Kale",
    funFact: "Xaqiiqo Xiiso leh",
    levelComplete: "Heerka Dhamaaday",
    amazingWork: "Shaqo cajiib ah heerka",
    nextLevel: "Heerka Xiga",

    // Drawing
    freeDrawing: "Sawir Xor",
    drawAnything: "Sawiir wax kasta oo aad jeceshahay!",
    letCreativityFlow: "Ha daadato hal-abuurkaaga! Sawiir waxa ku farxiya.",
    letterPractice: "Tababarka Xarfaha",
    drawLetter: "Sawiir xarfka",
    practiceWriting: "Ku celceli qorista xarfka",
    makeItBig: "Ka dhig mid weyn oo midab leh",
    wordPractice: "Tababarka Erayada",
    drawWord: "Sawiir erayga",
    writeWord: "Qor erayga",
    inBeautifulLetters: "xarfo qurux badan",
    shapeChallenge: "Tartanka Qaabka",
    drawA: "Sawiir",
    canYouDraw: "Ma sawiiri kartaa",
    makeItColorful: "Ka dhig mid midab leh",
    objectDrawing: "Sawirka Walxaha",
    drawCreative: "Sawiir",
    addDetails: "Ku dar faahfaahin iyo midabyo si aad uga dhigto mid gaar ah",
    patternChallenge: "Tartanka Qaabka",
    createPattern: "Samee qaab",
    fillCanvas: "Buuxi sawirka qaab",
    usingColors: "adoo isticmaalaya midabadan gaarka ah",
    storyIllustration: "Sawirka Sheekooyinka",
    illustrate: "Sawiir",
    drawScene: "Sawiir muuqaal muujinaya",
    tellStory: "Sheeg sheeko farshaxaadaada",
    colors: "Midabada",
    brushSize: "Cabbirka Brushka",
    colorsUsed: "Midabada la isticmaalay",
    strokes: "Xariiqaha",
    completeDrawing: "Dhamaystir Sawirka",
    useMouseOrTouch: "Isticmaal jiirka ama taabashada si aad u sawirto",
    artworkComplete: "Farshaxanku Dhamaaday",
    challenge: "Tartanka",
    totalStrokes: "Wadarta Xariiqaha",
    finalScore: "Natiijooyinka Dhammaadka",
    saveArtwork: "Kaydi Farshaxanka",
    nextChallenge: "Tartanka Xiga",
    greatArtwork: "Farshaxan weyn!",
    perfectColorUsage: "Isticmaal midab oo fiican!",
    excellentPractice: "Tababar fiican!",
    timeBonus: "Gunno waqti",
    youEarned: "Waad kasabtay",
    bonusPoints: "dhibco dheeraad ah",
    hearLetter: "Maqal Xarfka",
    hearWord: "Maqal Erayga",
    requiredColors: "Midabada Loo Baahan Yahay",
    used: "La isticmaalay",

    // Math
    addition: "Isku darka",
    subtraction: "Ka goynta",
    multiplication: "Isku dhufashada",
    division: "U qaybinta",

    // Quran
    surah: "Suurad",
    verse: "Aayad",
    listen: "Dhegayso",

    // Profile
    totalScore: "Wadarta Dhibcaha",
    gamesPlayed: "Ciyaaraha la ciyaaray",
    favoriteGame: "Ciyaarta la jecel yahay",

    // Shapes
    circle: "goobo",
    square: "afargees",
    triangle: "saddexagal",
    rectangle: "afargees dheer",
    star: "xiddig",
    heart: "wadne",
  },
}

const alphabetData: { [key in Language]: AlphabetData } = {
  en: {
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    letterFacts: {
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
    },
    simpleWords: ["CAT", "DOG", "SUN", "CAR", "BAT", "HAT", "BOOK", "MOON", "TREE", "FISH"],
    numbers: ["ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"],
    colors: ["RED", "BLUE", "GREEN", "YELLOW", "ORANGE", "PURPLE", "PINK", "BLACK", "WHITE", "BROWN"],
  },
  ar: {
    letters: [
      "ا",
      "ب",
      "ت",
      "ث",
      "ج",
      "ح",
      "خ",
      "د",
      "ذ",
      "ر",
      "ز",
      "س",
      "ش",
      "ص",
      "ض",
      "ط",
      "ظ",
      "ع",
      "غ",
      "ف",
      "ق",
      "ك",
      "ل",
      "م",
      "ن",
      "ه",
      "و",
      "ي",
    ],
    letterFacts: {
      ا: "ا للأسد! الأسد ملك الغابة.",
      ب: "ب للبطة! البطة تسبح في الماء.",
      ت: "ت للتفاح! التفاح فاكهة لذيذة.",
      ث: "ث للثعلب! الثعلب حيوان ذكي.",
      ج: "ج للجمل! الجمل سفينة الصحراء.",
      ح: "ح للحصان! الحصان سريع وقوي.",
      خ: "خ للخروف! الخروف له صوف أبيض.",
      د: "د للدب! الدب حيوان كبير.",
      ذ: "ذ للذئب! الذئب يعيش في الغابة.",
      ر: "ر للرمان! الرمان فاكهة حمراء.",
      ز: "ز للزرافة! الزرافة لها رقبة طويلة.",
      س: "س للسمك! السمك يسبح في البحر.",
      ش: "ش للشمس! الشمس تضيء النهار.",
      ص: "ص للصقر! الصقر طائر سريع.",
      ض: "ض للضفدع! الضفدع يقفز عالياً.",
      ط: "ط للطائر! الطائر يطير في السماء.",
      ظ: "ظ للظبي! الظبي سريع الجري.",
      ع: "ع للعصفور! العصفور صغير وجميل.",
      غ: "غ للغزال! الغزال رشيق وسريع.",
      ف: "ف للفيل! الفيل له خرطوم طويل.",
      ق: "ق للقط! القط يحب اللعب.",
      ك: "ك للكلب! الكلب صديق وفي.",
      ل: "ل للليمون! الليمون حامض ومفيد.",
      م: "م للماء! الماء ضروري للحياة.",
      ن: "ن للنحلة! النحلة تصنع العسل.",
      ه: "ه للهدهد! الهدهد طائر جميل.",
      و: "و للوردة! الوردة جميلة ومعطرة.",
      ي: "ي لليمامة! اليمامة طائر أبيض.",
    },
    simpleWords: ["بيت", "قط", "كلب", "شمس", "قمر", "ماء", "نار", "ورد", "عين", "يد"],
    numbers: ["واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة", "عشرة"],
    colors: ["أحمر", "أزرق", "أخضر", "أصفر", "برتقالي", "بنفسجي", "وردي", "أسود", "أبيض", "بني"],
  },
  so: {
    letters: [
      "A",
      "B",
      "T",
      "J",
      "X",
      "KH",
      "D",
      "R",
      "S",
      "SH",
      "DH",
      "C",
      "G",
      "F",
      "Q",
      "K",
      "L",
      "M",
      "N",
      "W",
      "H",
      "Y",
    ],
    letterFacts: {
      A: "A waa Awr! Awrku waa xayawaan weyn.",
      B: "B waa Baabuur! Baabuurku dadka ayuu qaada.",
      T: "T waa Tufaax! Tufaaxu waa miro macaan.",
      J: "J waa Jiir! Jiirku waa xayawaan adag.",
      X: "X waa Xaabo! Xaabadu waa cunto fiican.",
      KH: "KH waa Khamiis! Khamiiska maalinta shanaad.",
      D: "D waa Dooro! Dooradu waa shimbirro.",
      R: "R waa Rooti! Rootiga waa cunto muhiim ah.",
      S: "S waa Sac! Sacu waa xayawaan dheer.",
      SH: "SH waa Shaah! Shaahdu waa cabitaan kulul.",
      DH: "DH waa Dhagax! Dhagaxu waa adag.",
      C: "C waa Caano! Caanadu waa cunto caafimaad leh.",
      G: "G waa Geel! Geelu waa xayawaan Soomaali ah.",
      F: "F waa Farax! Faraxu waa magac qurux badan.",
      Q: "Q waa Qoryo! Qoryaha waa muhiim.",
      K: "K waa Kalluun! Kalluunku badda ayuu ku nool yahay.",
      L: "L waa Libaax! Libaaxu waa boqorka xayawaanka.",
      M: "M waa Moos! Moosku waa miro macaan.",
      N: "N waa Naag! Naagtuna waa hooyada.",
      W: "W waa Wiil! Wiilku waa ilmo lab ah.",
      H: "H waa Hilib! Hilibku waa cunto laga helo xayawaanka.",
      Y: "Y waa Yurub! Yurubtu waa qaarad weyn.",
    },
    simpleWords: ["BAABUUR", "GURI", "BISAD", "EY", "QORAX", "DAYAX", "BIYO", "DUUR", "GEED", "KALLUUN"],
    numbers: ["KOW", "LABA", "SADDEX", "AFAR", "SHAN", "LIX", "TODOBO", "SIDEED", "SAGAAL", "TOBAN"],
    colors: ["CAS", "BULUUG", "CAGAAR", "JAALLE", "ORANJO", "GUDUUD", "CASAAN", "MADOW", "CADDAAN", "BUNNI"],
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["en", "ar", "so"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  const isRTL = language === "ar"

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        isRTL,
        alphabetData: alphabetData[language],
      }}
    >
      <div className={isRTL ? "rtl" : "ltr"}>{children}</div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
