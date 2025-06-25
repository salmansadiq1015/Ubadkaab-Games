"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAudio } from "@/contexts/audio-context";
import { useUser } from "@/contexts/user-context";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  RotateCcw,
  Plus,
  Minus,
  X,
  Divide,
  Target,
} from "lucide-react";
import Link from "next/link";

type Operation = "addition" | "subtraction" | "multiplication" | "division";

interface Question {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  difficulty: number;
}

interface LevelConfig {
  operations: Operation[];
  maxNumber: number;
  questionCount: number;
  timeLimit?: number;
  specialRules?: string[];
}

export default function MathGame() {
  const { t } = useLanguage();
  const { playSound, speakText } = useAudio();
  const { updateScore } = useUser();
  const [currentOperation, setCurrentOperation] =
    useState<Operation>("addition");
  const [question, setQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  const generateLevelConfig = (level: number): LevelConfig => {
    if (level <= 3) {
      return {
        operations: ["addition"],
        maxNumber: Math.min(10 + level * 5, 25),
        questionCount: 5 + level,
        specialRules: ["Single digit addition"],
      };
    } else if (level <= 6) {
      return {
        operations: ["addition", "subtraction"],
        maxNumber: Math.min(15 + level * 5, 50),
        questionCount: 8 + level,
        specialRules: ["Addition and subtraction"],
      };
    } else if (level <= 10) {
      return {
        operations: ["addition", "subtraction", "multiplication"],
        maxNumber: Math.min(20 + level * 3, 100),
        questionCount: 10 + level,
        specialRules: ["Basic operations"],
      };
    } else if (level <= 15) {
      return {
        operations: ["addition", "subtraction", "multiplication", "division"],
        maxNumber: Math.min(25 + level * 5, 200),
        questionCount: 12 + level,
        timeLimit: Math.max(60 - level, 30),
        specialRules: ["All operations", "Time challenge"],
      };
    } else if (level <= 25) {
      return {
        operations: ["addition", "subtraction", "multiplication", "division"],
        maxNumber: Math.min(50 + level * 10, 500),
        questionCount: 15 + level,
        timeLimit: Math.max(45 - Math.floor(level / 2), 20),
        specialRules: ["Large numbers", "Speed challenge"],
      };
    } else {
      // Infinite scaling for levels 25+
      return {
        operations: ["addition", "subtraction", "multiplication", "division"],
        maxNumber: 100 + level * 20,
        questionCount: 20 + Math.floor(level / 2),
        timeLimit: Math.max(30 - Math.floor(level / 5), 15),
        specialRules: ["Expert mode", "Lightning fast", "Huge numbers"],
      };
    }
  };

  const generateQuestion = (
    operations: Operation[],
    maxNum: number,
    level: number
  ): Question => {
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1: number, num2: number, answer: number;

    switch (operation) {
      case "addition":
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * maxNum) + 1;
        answer = num1 + num2;
        break;
      case "subtraction":
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        break;
      case "multiplication":
        const maxMult = Math.min(Math.floor(maxNum / 5), 20);
        num1 = Math.floor(Math.random() * maxMult) + 1;
        num2 = Math.floor(Math.random() * maxMult) + 1;
        answer = num1 * num2;
        break;
      case "division":
        // Generate division that results in whole numbers
        answer = Math.floor(Math.random() * Math.min(maxNum / 2, 50)) + 1;
        num2 = Math.floor(Math.random() * 10) + 2;
        num1 = answer * num2;
        break;
    }

    return { num1, num2, operation, answer, difficulty: level };
  };

  const getOperationSymbol = (operation: Operation) => {
    switch (operation) {
      case "addition":
        return "+";
      case "subtraction":
        return "-";
      case "multiplication":
        return "×";
      case "division":
        return "÷";
    }
  };

  const getOperationIcon = (operation: Operation) => {
    switch (operation) {
      case "addition":
        return Plus;
      case "subtraction":
        return Minus;
      case "multiplication":
        return X;
      case "division":
        return Divide;
    }
  };

  useEffect(() => {
    const config = generateLevelConfig(level);
    setLevelConfig(config);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setIsLevelComplete(false);

    if (config.timeLimit) {
      setTimeLeft(config.timeLimit);
    }

    setQuestion(generateQuestion(config.operations, config.maxNumber, level));
  }, [level]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleLevelComplete();
    }
  }, [timeLeft]);

  const handleSubmit = () => {
    if (!question || !userAnswer || !levelConfig) return;

    const isCorrect = Number.parseInt(userAnswer) === question.answer;
    setQuestionsAnswered((prev) => prev + 1);

    if (isCorrect) {
      playSound("correct");
      setScore((prev) => prev + 10 * level + streak * 5);
      setStreak((prev) => prev + 1);
      setCorrectAnswers((prev) => prev + 1);
      setFeedback(t("correct"));
    } else {
      playSound("wrong");
      setStreak(0);
      setFeedback(`${t("tryAgain")} (Answer: ${question.answer})`);
    }

    setTimeout(() => {
      setFeedback(null);
      setUserAnswer("");

      if (questionsAnswered + 1 >= levelConfig.questionCount) {
        handleLevelComplete();
      } else {
        setQuestion(
          generateQuestion(levelConfig.operations, levelConfig.maxNumber, level)
        );
      }
    }, 1500);
  };

  const handleLevelComplete = () => {
    setIsLevelComplete(true);
    const accuracy = correctAnswers / Math.max(questionsAnswered, 1);
    const bonusScore = Math.floor(accuracy * 100 * level);
    setScore((prev) => prev + bonusScore);
    updateScore("math", score + bonusScore, level);

    if (accuracy >= 0.7) {
      playSound("correct");
      speakText(
        `Level ${level} complete! Great job with ${Math.round(
          accuracy * 100
        )}% accuracy!`
      );
    } else {
      speakText(
        `Level ${level} complete! Keep practicing to improve your accuracy!`
      );
    }
  };

  const handleNextLevel = () => {
    setLevel((prev) => prev + 1);
    playSound("correct");
  };

  const handleRestart = () => {
    playSound("click");
    setScore(0);
    setLevel(1);
    setStreak(0);
    setUserAnswer("");
    setFeedback(null);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setTimeLeft(null);
    setIsLevelComplete(false);
  };

  if (!question || !levelConfig) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* <Link href="/">
            <Button variant="outline" className="bg-white text-gray-700 hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("back")}
            </Button>
          </Link> */}

          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-md px-4 py-2 shadow-lg">
              <span className="font-bold text-gray-800">
                {t("score")}: {score}
              </span>
            </div>
            <div className="bg-white rounded-md px-4 py-2 shadow-lg">
              <span className="font-bold text-gray-800">
                {t("level")}: {level}
              </span>
            </div>
            <div className="bg-white rounded-md px-4 py-2 shadow-lg">
              <span className="font-bold text-gray-800">Streak: {streak}</span>
            </div>
            {timeLeft !== null && (
              <div
                className={`rounded-full px-4 py-2 shadow-lg ${
                  timeLeft <= 10
                    ? "bg-red-100 text-red-800"
                    : "bg-white text-gray-800"
                }`}
              >
                <span className="font-bold">Time: {timeLeft}s</span>
              </div>
            )}
            <Button
              onClick={handleRestart}
              variant="outline"
              className="bg-white text-gray-700 hover:bg-gray-100"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("restart")}
            </Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
            🔢 {t("math")} 🔢
          </h1>
          <div className="bg-white rounded-xl p-4 shadow-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Level {level} Challenge
            </h2>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {levelConfig.specialRules?.map((rule, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm"
                >
                  {rule}
                </span>
              ))}
            </div>
            <p className="text-gray-600">
              Questions: {questionsAnswered}/{levelConfig.questionCount} |
              Correct: {correctAnswers} | Max Number: {levelConfig.maxNumber}
            </p>
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (questionsAnswered / levelConfig.questionCount) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {!isLevelComplete ? (
          /* Question Card */
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white shadow-2xl">
              <CardContent className="p-8 text-center">
                <div className="text-6xl font-bold text-gray-800 mb-8">
                  {question.num1} {getOperationSymbol(question.operation)}{" "}
                  {question.num2} = ?
                </div>

                <div className="mb-6">
                  <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="text-4xl font-bold text-center border-4 border-gray-300 rounded-2xl px-6 py-4 w-48 focus:border-yellow-500 focus:outline-none"
                    placeholder="?"
                    onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!userAnswer}
                  className="kid-button text-2xl px-8 py-4"
                >
                  Check Answer
                </Button>

                {/* Feedback */}
                {feedback && (
                  <div
                    className={`mt-6 text-2xl font-bold ${
                      feedback === t("correct")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {feedback}
                    {feedback === t("correct") && " 🎉"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Level Complete */
          <div className="text-center">
            <Card className="bg-white shadow-2xl max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-4xl font-bold text-green-600 mb-4">
                  🎉 Level {level} Complete! 🎉
                </h2>
                <div className="space-y-2 text-lg text-gray-700 mb-6">
                  <p>Questions Answered: {questionsAnswered}</p>
                  <p>Correct Answers: {correctAnswers}</p>
                  <p>
                    Accuracy:{" "}
                    {Math.round(
                      (correctAnswers / Math.max(questionsAnswered, 1)) * 100
                    )}
                    %
                  </p>
                  <p>Final Score: {score} points</p>
                </div>
                <Button onClick={handleNextLevel} className="kid-button">
                  <Target className="w-4 h-4 mr-2" />
                  Next Level
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
