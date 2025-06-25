"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAudio } from "@/contexts/audio-context";
import { useUser } from "@/contexts/user-context";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  RotateCcw,
  Lightbulb,
  Microscope,
  Atom,
} from "lucide-react";
import Link from "next/link";

interface Experiment {
  id: number;
  title: string;
  category: string;
  description: string;
  materials: string[];
  steps: string[];
  fact: string;
  icon: string;
}

const experiments: Experiment[] = [
  {
    id: 1,
    title: "Rainbow in a Glass",
    category: "Physics",
    description: "Create a beautiful rainbow using water and light!",
    materials: [
      "Clear glass of water",
      "White paper",
      "Sunlight or flashlight",
    ],
    steps: [
      "Fill a clear glass with water",
      "Place the glass near a window with sunlight",
      "Hold white paper behind the glass",
      "Watch the rainbow appear on the paper!",
      "Try moving the paper closer or farther away",
    ],
    fact: "White light is actually made up of many colors! When light passes through water, it bends and separates into all the colors of the rainbow.",
    icon: "🌈",
  },
  {
    id: 2,
    title: "Volcano Eruption",
    category: "Chemistry",
    description: "Make a safe volcano that erupts with fizzy foam!",
    materials: [
      "Baking soda",
      "Vinegar",
      "Food coloring",
      "Dish soap",
      "Small bottle",
    ],
    steps: [
      "Put 2 tablespoons of baking soda in the bottle",
      "Add a few drops of food coloring",
      "Add a squirt of dish soap",
      "Quickly pour in 1/4 cup of vinegar",
      "Watch your volcano erupt!",
    ],
    fact: "When baking soda and vinegar mix, they create carbon dioxide gas, which causes the fizzy eruption!",
    icon: "🌋",
  },
  {
    id: 3,
    title: "Floating Egg",
    category: "Physics",
    description: "Make an egg float in water like magic!",
    materials: ["2 glasses of water", "1 egg", "Salt"],
    steps: [
      "Fill both glasses with water",
      "Try putting the egg in the first glass - it sinks!",
      "In the second glass, add lots of salt and stir",
      "Now put the egg in the salty water",
      "Watch it float!",
    ],
    fact: "Salt water is denser than regular water, so the egg floats! This is why it's easier to float in the ocean than in a swimming pool.",
    icon: "🥚",
  },
  {
    id: 4,
    title: "Invisible Ink",
    category: "Chemistry",
    description: "Write secret messages that appear when heated!",
    materials: [
      "Lemon juice",
      "Cotton swab",
      "White paper",
      "Heat source (adult help needed)",
    ],
    steps: [
      "Squeeze fresh lemon juice into a small bowl",
      "Dip the cotton swab in lemon juice",
      "Write a message on white paper",
      "Let the paper dry completely",
      "Ask an adult to hold the paper near a light bulb or iron",
      "Watch your secret message appear!",
    ],
    fact: "Lemon juice contains citric acid. When heated, the acid turns brown, revealing your hidden message!",
    icon: "✍️",
  },
];

export default function ScienceGame() {
  const { t } = useLanguage();
  const { playSound } = useAudio();
  const { updateScore } = useUser();
  const [selectedExperiment, setSelectedExperiment] =
    useState<Experiment | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [completedExperiments, setCompletedExperiments] = useState<Set<number>>(
    new Set()
  );

  const handleExperimentSelect = (experiment: Experiment) => {
    playSound("click");
    setSelectedExperiment(experiment);
    setCurrentStep(0);
    setCompletedSteps(new Set());
  };

  const handleStepComplete = (stepIndex: number) => {
    playSound("correct");
    setCompletedSteps((prev) => new Set([...prev, stepIndex]));
    setScore((prev) => prev + 20);

    if (
      selectedExperiment &&
      completedSteps.size + 1 === selectedExperiment.steps.length
    ) {
      // Experiment completed
      setCompletedExperiments(
        (prev) => new Set([...prev, selectedExperiment.id])
      );
      updateScore("science", score + 20, selectedExperiment.id);
      playSound("correct");
    }
  };

  const handleNextStep = () => {
    if (!selectedExperiment) return;
    playSound("click");
    if (currentStep < selectedExperiment.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    playSound("click");
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    playSound("click");
    setSelectedExperiment(null);
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setScore(0);
    setCompletedExperiments(new Set());
  };

  const isExperimentCompleted = selectedExperiment
    ? completedExperiments.has(selectedExperiment.id)
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-cyan-50 to-blue-100">
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
            <div className="bg-white rounded-full px-4 py-2 shadow-lg">
              <span className="font-bold text-gray-800">
                {t("score")}: {score}
              </span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow-lg">
              <span className="font-bold text-gray-800">
                Experiments: {completedExperiments.size}/{experiments.length}
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            🔬 {t("science")} 🔬
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing science with fun experiments!
          </p>
        </div>

        {!selectedExperiment ? (
          /* Experiment Selection */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {experiments.map((experiment) => (
              <Card
                key={experiment.id}
                className="cursor-pointer transition-all duration-300 transform hover:scale-105 bg-white shadow-lg hover:shadow-xl"
                onClick={() => handleExperimentSelect(experiment)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{experiment.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {experiment.title}
                      </h3>
                      <span className="text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                        {experiment.category}
                      </span>
                    </div>
                    {completedExperiments.has(experiment.id) && (
                      <div className="ml-auto text-green-500">✅</div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{experiment.description}</p>
                  <div className="text-center">
                    <span className="kid-button inline-block">
                      Start Experiment
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Experiment Instructions */
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white shadow-2xl mb-6">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{selectedExperiment.icon}</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {selectedExperiment.title}
                  </h2>
                  <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-bold">
                    {selectedExperiment.category}
                  </span>
                  <p className="text-gray-600 mt-4">
                    {selectedExperiment.description}
                  </p>
                </div>

                {/* Materials Needed */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Atom className="w-5 h-5 mr-2" />
                    Materials Needed:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedExperiment.materials.map((material, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 flex items-center"
                      >
                        <span className="w-6 h-6 bg-teal-500 text-white rounded-full text-sm flex items-center justify-center mr-3">
                          {index + 1}
                        </span>
                        {material}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Microscope className="w-5 h-5 mr-2" />
                    Experiment Steps:
                  </h3>
                  <div className="space-y-4">
                    {selectedExperiment.steps.map((step, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          index === currentStep
                            ? "border-teal-500 bg-teal-50"
                            : completedSteps.has(index)
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span
                              className={`w-8 h-8 rounded-full text-white text-sm flex items-center justify-center mr-3 ${
                                completedSteps.has(index)
                                  ? "bg-green-500"
                                  : index === currentStep
                                  ? "bg-teal-500"
                                  : "bg-gray-400"
                              }`}
                            >
                              {completedSteps.has(index) ? "✓" : index + 1}
                            </span>
                            <span className="text-gray-800">{step}</span>
                          </div>
                          {index === currentStep &&
                            !completedSteps.has(index) && (
                              <Button
                                onClick={() => handleStepComplete(index)}
                                size="sm"
                                className="bg-teal-500 hover:bg-teal-600 text-white"
                              >
                                Done!
                              </Button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fun Fact */}
                <div className="mb-8 bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-500">
                  <h4 className="text-lg font-bold text-yellow-800 mb-2 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    Cool Science Fact:
                  </h4>
                  <p className="text-yellow-700">{selectedExperiment.fact}</p>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                    variant="outline"
                    className="px-6 py-3"
                  >
                    Previous Step
                  </Button>

                  <Button
                    onClick={() => setSelectedExperiment(null)}
                    variant="outline"
                    className="px-6 py-3"
                  >
                    Back to Experiments
                  </Button>

                  <Button
                    onClick={handleNextStep}
                    disabled={
                      currentStep === selectedExperiment.steps.length - 1
                    }
                    className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3"
                  >
                    Next Step
                  </Button>
                </div>

                {/* Completion Message */}
                {isExperimentCompleted && (
                  <div className="text-center mt-8">
                    <div className="bg-green-100 rounded-xl p-6">
                      <h3 className="text-2xl font-bold text-green-600 mb-2">
                        🧪 Experiment Complete! 🧪
                      </h3>
                      <p className="text-green-700">
                        Great job scientist! You've completed the experiment and
                        learned something new!
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
