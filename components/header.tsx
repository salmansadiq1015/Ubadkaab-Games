"use client";

import { useLanguage } from "@/contexts/language-context";
import { useAudio } from "@/contexts/audio-context";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Home, User, Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Header() {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const {
    isMuted,
    toggleMute,
    playSound,
    currentVoice,
    setVoicePreference,
    isAudioReady,
  } = useAudio();
  const [showSettings, setShowSettings] = useState(false);

  const handleLanguageChange = (lang: "en" | "ar" | "so") => {
    playSound("click");
    setLanguage(lang);
  };

  const handleMuteToggle = () => {
    playSound("click");
    toggleMute();
  };

  const handleVoiceChange = (preference: "male" | "female") => {
    playSound("click");
    setVoicePreference(preference);
    setShowSettings(false);
  };

  const handleSettingsToggle = () => {
    playSound("click");
    setShowSettings(!showSettings);
  };

  const testAudio = () => {
    playSound("correct");
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-yellow-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🎓</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("home")}
            </h1>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex space-x-2">
              {(["en", "ar", "so"] as const).map((lang) => (
                <Button
                  key={lang}
                  variant={language === lang ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLanguageChange(lang)}
                  className={`${
                    language === lang
                      ? "bg-gradient-to-r text-sm from-blue-500 to-purple-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } font-bold rounded-full px-4 py-2 transition-all duration-300`}
                >
                  {lang.toUpperCase()}
                </Button>
              ))}
            </div>

            {/* Audio Controls */}

            {/* Navigation */}
            {/* <div className="flex space-x-2">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-gray-700 hover:bg-gray-100 rounded-full p-2"
                >
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-gray-700 hover:bg-gray-100 rounded-full p-2"
                >
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
}
