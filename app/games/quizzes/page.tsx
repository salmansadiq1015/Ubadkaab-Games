"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAudio } from "@/contexts/audio-context";
import { useUser } from "@/contexts/user-context";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Lightbulb, Star } from "lucide-react";
import Link from "next/link";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  category: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What color do you get when you mix red and blue?",
    options: ["Green", "Purple", "Orange", "Yellow"],
    correctAnswer: 1,
    hint: "Think about the colors in a rainbow!",
    category: "Colors",
  },
  {
    id: 2,
    question: "How many legs does a spider have?",
    options: ["6", "8", "10", "4"],
    correctAnswer: 1,
    hint: "Count the legs on both sides!",
    category: "Animals",
  },
  {
    id: 3,
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 2,
    hint: "It's known for its Great Red Spot!",
    category: "Space",
  },
  {
    id: 4,
    question: "Which animal is known as the King of the Jungle?",
    options: ["Tiger", "Lion", "Elephant", "Bear"],
    correctAnswer: 1,
    hint: "It has a magnificent mane!",
    category: "Animals",
  },
  {
    id: 5,
    question: "What do plants need to make their own food?",
    options: ["Water only", "Sunlight only", "Sunlight and water", "Soil only"],
    correctAnswer: 2,
    hint: "They need energy from above and liquid from below!",
    category: "Nature",
  },
];

export default function QuizzesGame() {
  const { t } = useLanguage();
  const { playSound } = useAudio();
  const { updateScore } = useUser();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;

    playSound("click");
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setShowResult(true);

    if (isCorrect) {
      playSound("correct");
      setScore((prev) => prev + 100);
    } else {
      playSound("wrong");
    }

    setAnsweredQuestions((prev) => new Set([...prev, currentQuestion.id]));
  };

  const handleNext = () => {
    playSound("click");
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Quiz completed
      updateScore("quizzes", score, Math.ceil(answeredQuestions.size / 5));
    }
  };

  const handleRestart = () => {
    playSound("click");
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setShowHint(false);
    setAnsweredQuestions(new Set());
  };

  const handleShowHint = () => {
    playSound("click");
    setShowHint(true);
  };

  const isQuizCompleted =
    currentQuestionIndex === quizQuestions.length - 1 && showResult;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100">
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
                Question: {currentQuestionIndex + 1}/{quizQuestions.length}
              </span>
            </div>
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            🧠 {t("quizzes")} 🧠
          </h1>
          <p className="text-xl text-gray-600">
            Test your knowledge with fun questions!
          </p>
        </div>

        {!isQuizCompleted ? (
          <div className="max-w-3xl mx-auto">
            {/* Question Card */}
            <Card className="bg-white shadow-2xl mb-6">
              <CardContent className="p-8">
                <div className="mb-6">
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                    {currentQuestion.category}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                  {currentQuestion.question}
                </h2>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`p-6 text-lg font-bold rounded-2xl transition-all duration-300 ${
                        selectedAnswer === index
                          ? showResult
                            ? index === currentQuestion.correctAnswer
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                            : "bg-purple-500 text-white"
                          : showResult &&
                            index === currentQuestion.correctAnswer
                          ? "bg-green-500 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {option}
                      {showResult &&
                        index === currentQuestion.correctAnswer && (
                          <Star className="w-5 h-5 ml-2 inline" />
                        )}
                    </Button>
                  ))}
                </div>

                {/* Hint */}
                {showHint && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded">
                    <div className="flex items-center">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="text-yellow-800 font-bold">
                        Hint: {currentQuestion.hint}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  {!showResult ? (
                    <>
                      <Button
                        onClick={handleShowHint}
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Show Hint
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null}
                        className="kid-button"
                      >
                        Submit Answer
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleNext} className="kid-button">
                      {currentQuestionIndex < quizQuestions.length - 1
                        ? t("next")
                        : "Finish Quiz"}
                    </Button>
                  )}
                </div>

                {/* Result Feedback */}
                {showResult && (
                  <div className="mt-6 text-center">
                    <div
                      className={`text-2xl font-bold ${
                        selectedAnswer === currentQuestion.correctAnswer
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedAnswer === currentQuestion.correctAnswer
                        ? `🎉 ${t("correct")}! +100 points`
                        : `❌ ${t("tryAgain")}! The correct answer was: ${
                            currentQuestion.options[
                              currentQuestion.correctAnswer
                            ]
                          }`}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Bar */}
            <div className="bg-white rounded-full p-2 shadow-lg">
              <div className="bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      ((currentQuestionIndex + (showResult ? 1 : 0)) /
                        quizQuestions.length) *
                      100
                    }%`,
                  }}
                />
              </div>
              <p className="text-center mt-2 font-bold text-gray-700">
                Progress: {currentQuestionIndex + (showResult ? 1 : 0)}/
                {quizQuestions.length}
              </p>
            </div>
          </div>
        ) : (
          /* Quiz Completion */
          <div className="text-center">
            <Card className="bg-white shadow-2xl max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-4xl font-bold text-green-600 mb-4">
                  🎉 Quiz Completed! 🎉
                </h2>
                <p className="text-2xl text-gray-700 mb-6">
                  Final Score: {score} points
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  You answered {answeredQuestions.size} questions correctly!
                </p>
                <Button onClick={handleRestart} className="kid-button">
                  Play Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
