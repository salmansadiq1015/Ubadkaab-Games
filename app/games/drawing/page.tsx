"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAudio } from "@/contexts/audio-context";
import { useUser } from "@/contexts/user-context";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  RotateCcw,
  Download,
  Palette,
  Target,
  Star,
  Volume2,
} from "lucide-react";
import Link from "next/link";

const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#85C1E9",
  "#D7BDE2",
  "#000000",
  "#FFFFFF",
  "#8B4513",
];

const brushSizes = [2, 5, 10, 15, 20, 25, 30];

interface DrawingChallenge {
  type:
    | "free"
    | "shape"
    | "object"
    | "pattern"
    | "color"
    | "story"
    | "alphabet"
    | "letter";
  title: string;
  description: string;
  prompt: string;
  targetColors?: string[];
  requiredShapes?: string[];
  targetLetter?: string;
  targetWord?: string;
  timeLimit?: number;
}

export default function DrawingGame() {
  const { t, language, alphabetData, isRTL } = useLanguage();
  const { playSound, speakText, speakArabic } = useAudio();
  const { updateScore } = useUser();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [brushSize, setBrushSize] = useState(5);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentChallenge, setCurrentChallenge] =
    useState<DrawingChallenge | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [usedColors, setUsedColors] = useState<Set<string>>(new Set());
  const [strokeCount, setStrokeCount] = useState(0);

  // Language-specific drawing prompts
  const getDrawingPrompts = () => {
    const prompts = {
      en: {
        objects: [
          "house",
          "tree",
          "car",
          "flower",
          "sun",
          "moon",
          "star",
          "cat",
          "dog",
          "fish",
          "bird",
          "butterfly",
          "rainbow",
          "cloud",
          "mountain",
          "ocean",
          "castle",
          "rocket",
          "robot",
          "dinosaur",
          "pizza",
          "cake",
          "ice cream",
          "balloon",
          "kite",
          "boat",
        ],
        patterns: [
          "stripes",
          "dots",
          "zigzag",
          "spirals",
          "checkerboard",
          "waves",
          "hearts",
          "stars",
          "triangles",
          "circles",
          "squares",
          "diamonds",
          "flowers",
          "leaves",
        ],
        stories: [
          "a magical forest",
          "underwater adventure",
          "space journey",
          "fairy tale castle",
          "jungle safari",
          "winter wonderland",
          "summer beach",
          "city skyline",
          "farm scene",
          "birthday party",
          "playground fun",
          "garden party",
        ],
      },
      ar: {
        objects: [
          "بيت",
          "شجرة",
          "سيارة",
          "وردة",
          "شمس",
          "قمر",
          "نجمة",
          "قط",
          "كلب",
          "سمك",
          "طائر",
          "فراشة",
          "قوس قزح",
          "سحابة",
          "جبل",
          "بحر",
          "قلعة",
          "صاروخ",
          "روبوت",
          "ديناصور",
          "بيتزا",
          "كعكة",
          "آيس كريم",
          "بالون",
          "طائرة ورقية",
          "قارب",
        ],
        patterns: [
          "خطوط",
          "نقاط",
          "متعرج",
          "حلزونات",
          "رقعة شطرنج",
          "أمواج",
          "قلوب",
          "نجوم",
          "مثلثات",
          "دوائر",
          "مربعات",
          "معينات",
          "زهور",
          "أوراق",
        ],
        stories: [
          "غابة سحرية",
          "مغامرة تحت الماء",
          "رحلة فضائية",
          "قلعة خيالية",
          "رحلة سفاري",
          "عجائب الشتاء",
          "شاطئ الصيف",
          "أفق المدينة",
          "مشهد المزرعة",
          "حفلة عيد ميلاد",
          "متعة الملعب",
          "حفلة الحديقة",
        ],
      },
      so: {
        objects: [
          "guri",
          "geed",
          "baabuur",
          "ubax",
          "qorax",
          "dayax",
          "xiddig",
          "bisad",
          "ey",
          "kalluun",
          "shimbir",
          "balanbaalis",
          "qaws-qorax",
          "daruur",
          "buur",
          "bad",
          "qalcad",
          "gacmeed",
          "robot",
          "dinasoor",
          "pizza",
          "keeg",
          "baraf macaan",
          "buufin",
          "shimbir waraq",
          "doon",
        ],
        patterns: [
          "xariiqo",
          "dhibco",
          "qallooc",
          "wareeg",
          "shatranj",
          "hiraro",
          "wadnaha",
          "xiddigaha",
          "saddexagal",
          "goobo",
          "afargees",
          "dheeman",
          "ubaxyo",
          "caleemo",
        ],
        stories: [
          "kayn sixir leh",
          "tacab badda hoose",
          "safar hawada sare",
          "qalcad sheeko",
          "safari kayn",
          "yaab jiilaal",
          "xeeb xagaa",
          "magaalo muuqaal",
          "beero meel",
          "dabbaaldeg dhalasho",
          "ciyaar meel",
          "dabbaaldeg beero",
        ],
      },
    };
    return prompts[language] || prompts.en;
  };

  const generateDrawingChallenge = (level: number): DrawingChallenge => {
    const prompts = getDrawingPrompts();

    if (level <= 2) {
      return {
        type: "free",
        title: t("freeDrawing"),
        description: t("drawAnything"),
        prompt: t("letCreativityFlow"),
      };
    } else if (level <= 4) {
      // Alphabet practice
      const letters = alphabetData.letters;
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      return {
        type: "letter",
        title: t("letterPractice"),
        description: `${t("drawLetter")} ${randomLetter}`,
        prompt: `${t("practiceWriting")} ${randomLetter}. ${t("makeItBig")}!`,
        targetLetter: randomLetter,
        timeLimit: 120,
      };
    } else if (level <= 6) {
      // Word practice
      const words = alphabetData.simpleWords;
      const randomWord = words[Math.floor(Math.random() * words.length)];
      return {
        type: "alphabet",
        title: t("wordPractice"),
        description: `${t("drawWord")} "${randomWord}"`,
        prompt: `${t("writeWord")} "${randomWord}" ${t("inBeautifulLetters")}!`,
        targetWord: randomWord,
        timeLimit: 180,
      };
    } else if (level <= 10) {
      const shapes = [
        t("circle"),
        t("square"),
        t("triangle"),
        t("rectangle"),
        t("star"),
        t("heart"),
      ];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      return {
        type: "shape",
        title: t("shapeChallenge"),
        description: `${t("drawA")} ${shape}`,
        prompt: `${t("canYouDraw")} ${shape}? ${t("makeItColorful")}!`,
        requiredShapes: [shape],
      };
    } else if (level <= 15) {
      const objects = prompts.objects;
      const object = objects[Math.floor(Math.random() * objects.length)];
      return {
        type: "object",
        title: t("objectDrawing"),
        description: `${t("drawA")} ${object}`,
        prompt: `${t("drawCreative")} ${object}! ${t("addDetails")}.`,
        timeLimit: 240,
      };
    } else if (level <= 20) {
      const patterns = prompts.patterns;
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      const colorCount = Math.min(3 + Math.floor(level / 3), 6);
      const challengeColors = colors
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, colorCount);
      return {
        type: "pattern",
        title: t("patternChallenge"),
        description: `${t("createPattern")} ${pattern}`,
        prompt: `${t("fillCanvas")} ${pattern} ${t("usingColors")}!`,
        targetColors: challengeColors,
        timeLimit: 300,
      };
    } else {
      const stories = prompts.stories;
      const story = stories[Math.floor(Math.random() * stories.length)];
      const colorCount = Math.min(5 + Math.floor(level / 10), colors.length);
      const challengeColors = colors
        .slice()
        .sort(() => Math.random() - 0.5)
        .slice(0, colorCount);
      return {
        type: "story",
        title: t("storyIllustration"),
        description: `${t("illustrate")}: ${story}`,
        prompt: `${t("drawScene")} ${story}. ${t("tellStory")}!`,
        targetColors: challengeColors,
        timeLimit: 420,
      };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth - 32; // Account for padding
      const containerHeight = Math.min(
        containerWidth * 0.6,
        window.innerHeight * 0.4,
        400
      );

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  useEffect(() => {
    setCurrentChallenge(generateDrawingChallenge(level));
    setUsedColors(new Set());
    setStrokeCount(0);
    setIsLevelComplete(false);
    clearCanvas();
  }, [level, language]);

  useEffect(() => {
    if (currentChallenge?.timeLimit && timeLeft === null) {
      setTimeLeft(currentChallenge.timeLimit);
    }
  }, [currentChallenge]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft]);

  const getEventPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    setLastPoint(pos);
    setUsedColors((prev) => new Set([...prev, currentColor]));
    draw(e);
    playSound("click");
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentPos = getEventPos(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;

    if (lastPoint) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(currentPos.x, currentPos.y);
      ctx.stroke();
    }

    setLastPoint(currentPos);
    setScore((prev) => prev + 1);
  };

  const stopDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    if (!isDrawing) return;
    setIsDrawing(false);
    setLastPoint(null);
    setStrokeCount((prev) => prev + 1);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setUsedColors(new Set());
    setStrokeCount(0);
    playSound("click");
  };

  const handleCompleteDrawing = () => {
    if (!currentChallenge) return;

    let bonusScore = 0;
    let feedback = t("greatArtwork") + " ";

    if (currentChallenge.targetColors) {
      const targetColorUsage = currentChallenge.targetColors.filter((color) =>
        usedColors.has(color)
      ).length;
      bonusScore += targetColorUsage * 20;

      if (targetColorUsage === currentChallenge.targetColors.length) {
        feedback += t("perfectColorUsage") + " ";
        bonusScore += 50;
      }
    }

    if (
      currentChallenge.type === "letter" ||
      currentChallenge.type === "alphabet"
    ) {
      bonusScore += 30;
      feedback += t("excellentPractice") + " ";
    }

    if (timeLeft && currentChallenge.timeLimit) {
      const timeBonus = Math.floor(
        (timeLeft / currentChallenge.timeLimit) * 30
      );
      bonusScore += timeBonus;
      feedback += `${t("timeBonus")}: ${timeBonus} ${t("points")}! `;
    }

    const creativityBonus = Math.min(
      strokeCount * 2 + usedColors.size * 5,
      100
    );
    bonusScore += creativityBonus;

    setScore((prev) => prev + bonusScore);
    updateScore("drawing", bonusScore, level);
    setIsLevelComplete(true);
    playSound("correct");

    setTimeout(() => {
      if (language === "ar") {
        speakArabic(
          feedback + `لقد حصلت على ${bonusScore} نقطة إضافية!`,
          feedback + `You earned ${bonusScore} bonus points!`
        );
      } else {
        speakText(
          feedback + `${t("youEarned")} ${bonusScore} ${t("bonusPoints")}!`
        );
      }
    }, 500);
  };

  const handleTimeUp = () => {
    handleCompleteDrawing();
  };

  const handleNextLevel = () => {
    setLevel((prev) => prev + 1);
    playSound("correct");
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `level-${level}-artwork.png`;
    link.href = canvas.toDataURL();
    link.click();
    playSound("correct");
  };

  const handleColorSelect = (color: string) => {
    setCurrentColor(color);
    playSound("click");
  };

  const handleBrushSizeSelect = (size: number) => {
    setBrushSize(size);
    playSound("click");
  };

  const handleRestart = () => {
    playSound("click");
    setScore(0);
    setLevel(1);
    setTimeLeft(null);
    setIsLevelComplete(false);
    clearCanvas();
  };

  const playLetterSound = () => {
    if (!currentChallenge?.targetLetter) return;

    if (language === "ar") {
      speakArabic(currentChallenge.targetLetter, currentChallenge.targetLetter);
    } else {
      playSound("letter", currentChallenge.targetLetter);
    }
  };

  const playWordSound = () => {
    if (!currentChallenge?.targetWord) return;

    if (language === "ar") {
      speakArabic(currentChallenge.targetWord, currentChallenge.targetWord);
    } else {
      speakText(currentChallenge.targetWord, { rate: 0.7 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100">
      <Header />

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 ${
            isRTL ? "sm:flex-row-reverse" : ""
          }`}
        >
          {/* <Link href="/">
            <Button variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <ArrowLeft className={`w-4 h-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              {t("back")}
            </Button>
          </Link> */}

          <div
            className={`flex flex-wrap items-center gap-2 sm:gap-4 ${
              isRTL ? "sm:flex-row-reverse" : ""
            }`}
          >
            <div className="bg-white rounded-full px-3 py-1 sm:px-4 sm:py-2 shadow-lg">
              <span className="font-bold text-gray-800 text-sm sm:text-base">
                {t("score")}: {score}
              </span>
            </div>
            <div className="bg-white rounded-full px-3 py-1 sm:px-4 sm:py-2 shadow-lg">
              <span className="font-bold text-gray-800 text-sm sm:text-base">
                {t("level")}: {level}
              </span>
            </div>
            {timeLeft !== null && (
              <div
                className={`rounded-full px-3 py-1 sm:px-4 sm:py-2 shadow-lg text-sm sm:text-base ${
                  timeLeft <= 30
                    ? "bg-red-100 text-red-800"
                    : "bg-white text-gray-800"
                }`}
              >
                <span className="font-bold">
                  {t("time")}: {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={clearCanvas}
                variant="outline"
                size="sm"
                className="bg-white text-gray-700 hover:bg-gray-100"
              >
                <RotateCcw
                  className={`w-4 h-4 ${isRTL ? "ml-1" : "mr-1"} sm:mr-2`}
                />
                <span className="hidden sm:inline">{t("clear")}</span>
              </Button>
              <Button
                onClick={downloadDrawing}
                variant="outline"
                size="sm"
                className="bg-white text-gray-700 hover:bg-gray-100"
              >
                <Download
                  className={`w-4 h-4 ${isRTL ? "ml-1" : "mr-1"} sm:mr-2`}
                />
                <span className="hidden sm:inline">{t("save")}</span>
              </Button>
              <Button
                onClick={handleRestart}
                variant="outline"
                size="sm"
                className="bg-white text-gray-700 hover:bg-gray-100"
              >
                <RotateCcw
                  className={`w-4 h-4 ${isRTL ? "ml-1" : "mr-1"} sm:mr-2`}
                />
                <span className="hidden sm:inline">{t("restart")}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="responsive-title font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎨 {t("drawing")} 🎨
          </h1>
          {currentChallenge && (
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg max-w-2xl mx-auto">
              <h2
                className={`text-lg sm:text-xl font-bold text-gray-800 mb-2 ${
                  language === "ar" ? "font-arabic" : ""
                }`}
              >
                {currentChallenge.title}
              </h2>
              <p
                className={`text-gray-600 mb-2 text-sm sm:text-base ${
                  language === "ar" ? "font-arabic" : ""
                }`}
              >
                {currentChallenge.description}
              </p>
              <p
                className={`text-xs sm:text-sm text-gray-500 italic ${
                  language === "ar" ? "font-arabic" : ""
                }`}
              >
                {currentChallenge.prompt}
              </p>

              {/* Letter/Word Practice Audio */}
              {(currentChallenge.type === "letter" ||
                currentChallenge.type === "alphabet") && (
                <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                  {currentChallenge.targetLetter && (
                    <div className="text-center">
                      <div
                        className={`text-4xl sm:text-6xl font-bold text-blue-600 mb-2 ${
                          language === "ar" ? "font-arabic" : ""
                        }`}
                      >
                        {currentChallenge.targetLetter}
                      </div>
                      <Button
                        onClick={playLetterSound}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Volume2
                          className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`}
                        />
                        {t("hearLetter")}
                      </Button>
                    </div>
                  )}
                  {currentChallenge.targetWord && (
                    <div className="text-center">
                      <div
                        className={`text-2xl sm:text-3xl font-bold text-green-600 mb-2 ${
                          language === "ar" ? "font-arabic" : ""
                        }`}
                      >
                        {currentChallenge.targetWord}
                      </div>
                      <Button
                        onClick={playWordSound}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Volume2
                          className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`}
                        />
                        {t("hearWord")}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {currentChallenge.targetColors && (
                <div className="mt-3">
                  <p className="text-sm font-bold text-gray-700 mb-2">
                    {t("requiredColors")}:
                  </p>
                  <div className="flex justify-center space-x-2">
                    {currentChallenge.targetColors.map((color, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full border-2 ${
                          usedColors.has(color)
                            ? "border-green-500"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {usedColors.has(color) && (
                          <Star className="w-4 h-4 text-green-500 m-0.5" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("used")}:{" "}
                    {
                      currentChallenge.targetColors.filter((color) =>
                        usedColors.has(color)
                      ).length
                    }
                    /{currentChallenge.targetColors.length}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {!isLevelComplete ? (
          <div
            className={`grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 ${
              isRTL ? "lg:grid-cols-4" : ""
            }`}
          >
            {/* Tools Panel */}
            <div
              className={`lg:col-span-1 order-2 lg:order-1 ${
                isRTL ? "lg:order-2" : ""
              }`}
            >
              <Card className="bg-white shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <h3
                    className={`text-lg sm:text-xl font-bold mb-4 flex items-center ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Palette className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {t("colors")}
                  </h3>

                  {/* Color Palette */}
                  <div className="grid grid-cols-6 sm:grid-cols-3 gap-2 mb-6">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full border-4 transition-all duration-300 hover:scale-110 active:scale-95 ${
                          currentColor === color
                            ? "border-gray-800 scale-110"
                            : "border-gray-300"
                        } ${
                          usedColors.has(color) ? "ring-2 ring-green-400" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          handleColorSelect(color);
                        }}
                      />
                    ))}
                  </div>

                  {/* Brush Size */}
                  <h4 className="text-base sm:text-lg font-bold mb-3">
                    {t("brushSize")}
                  </h4>
                  <div className="space-y-2">
                    {brushSizes.map((size) => (
                      <button
                        key={size}
                        className={`w-full p-2 rounded-lg border-2 transition-all duration-300 active:scale-95 ${
                          brushSize === size
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => handleBrushSizeSelect(size)}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          handleBrushSizeSelect(size);
                        }}
                      >
                        <div
                          className="mx-auto rounded-full bg-gray-800"
                          style={{
                            width: Math.max(size * 1.5, 8),
                            height: Math.max(size * 1.5, 8),
                          }}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      {t("colorsUsed")}: {usedColors.size}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t("strokes")}: {strokeCount}
                    </p>
                  </div>

                  {/* Complete Button */}
                  <Button
                    onClick={handleCompleteDrawing}
                    className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
                    disabled={strokeCount < 5}
                  >
                    {t("completeDrawing")}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Canvas */}
            <div
              className={`lg:col-span-3 order-1 lg:order-2 ${
                isRTL ? "lg:order-1" : ""
              }`}
            >
              <Card className="bg-white shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <canvas
                    ref={canvasRef}
                    className="w-full border-2 border-gray-300 rounded-lg cursor-crosshair touch-none"
                    style={{
                      touchAction: "none",
                      minHeight: "250px",
                      maxHeight: "400px",
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onTouchCancel={stopDrawing}
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center">
                    🖱️ {t("useMouseOrTouch")}!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Level Complete */
          <div className="text-center">
            <Card className="bg-white shadow-2xl max-w-2xl mx-auto">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-green-600 mb-4">
                  🎨 {t("artworkComplete")}! 🎨
                </h2>
                <div className="space-y-2 text-base sm:text-lg text-gray-700 mb-6">
                  <p className={language === "ar" ? "font-arabic" : ""}>
                    {t("level")} {level} {t("challenge")}:{" "}
                    {currentChallenge?.title}
                  </p>
                  <p>
                    {t("colorsUsed")}: {usedColors.size}
                  </p>
                  <p>
                    {t("totalStrokes")}: {strokeCount}
                  </p>
                  <p>
                    {t("finalScore")}: {score} {t("points")}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={downloadDrawing}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Download
                      className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    {t("saveArtwork")}
                  </Button>
                  <Button
                    onClick={handleNextLevel}
                    className="kid-button w-full sm:w-auto"
                  >
                    <Target className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {t("nextChallenge")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
