"use client";

import { useLanguage } from "@/contexts/language-context";
import { useAudio } from "@/contexts/audio-context";
import { Button } from "@/components/ui/button";
import {
  Volume2,
  VolumeX,
  Home,
  User,
  Settings,
  Play,
  Zap,
  Menu,
  X,
} from "lucide-react";
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
    debugInfo,
  } = useAudio();
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLanguageChange = (lang: "en" | "ar" | "so") => {
    playSound("click");
    setLanguage(lang);
    setShowMobileMenu(false);
  };

  const handleMuteToggle = () => {
    toggleMute();
    if (isMuted) {
      setTimeout(() => playSound("click"), 100);
    }
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

  const testAllSounds = () => {
    playSound("click");
    setTimeout(() => playSound("correct"), 500);
    setTimeout(() => playSound("letter", "A"), 2000);
    setTimeout(() => playSound("music"), 4000);
  };

  const testBeep = () => {
    playSound("click");
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-yellow-300 relative">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Always visible */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-xl">
                🎓
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              {t("home")}
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
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
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  } font-bold rounded-full px-4 py-2 transition-all duration-300`}
                >
                  {lang.toUpperCase()}
                </Button>
              ))}
            </div>

            {/* Quick Test Buttons */}
            <div className="flex space-x-1">
              <Button
                onClick={testBeep}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs"
                title="Test Beep"
              >
                🔊
              </Button>
            </div>

            {/* Audio Controls */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSettingsToggle}
                className={`rounded-full p-2 ${
                  isAudioReady
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                <Settings className="w-5 h-5" />
              </Button>

              {/* Settings Dropdown */}
              {showSettings && (
                <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 z-50 min-w-80">
                  <h3 className="font-bold text-gray-800 mb-3">
                    🔊 Audio Debug Panel
                  </h3>

                  {/* Debug Info */}
                  <div className="mb-4 p-3 bg-gray-50 rounded text-xs">
                    <p className="font-bold mb-1">Status:</p>
                    <p className="text-gray-600 break-words">{debugInfo}</p>
                    <p className="mt-1">
                      Ready: {isAudioReady ? "✅ Yes" : "❌ No"}
                    </p>
                    <p>Muted: {isMuted ? "🔇 Yes" : "🔊 No"}</p>
                  </div>

                  {/* Test Buttons */}
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <Button
                      onClick={testBeep}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Beep
                    </Button>
                    <Button
                      onClick={() => playSound("correct")}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white text-xs"
                    >
                      ✅ Correct
                    </Button>
                    <Button
                      onClick={() => playSound("wrong")}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white text-xs"
                    >
                      ❌ Wrong
                    </Button>
                    <Button
                      onClick={() => playSound("music")}
                      size="sm"
                      className="bg-purple-500 hover:bg-purple-600 text-white text-xs"
                    >
                      🎵 Music
                    </Button>
                  </div>

                  <Button
                    onClick={testAllSounds}
                    size="sm"
                    className="w-full mb-4 bg-indigo-500 hover:bg-indigo-600 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Test All Sounds
                  </Button>

                  {/* Voice Preference */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Voice Type:</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleVoiceChange("male")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs"
                      >
                        👨 Male
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleVoiceChange("female")}
                        variant="outline"
                        className="px-3 py-1 text-xs"
                      >
                        👩 Female
                      </Button>
                    </div>
                  </div>

                  {/* Current Voice Info */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Current Voice:</p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentVoice}
                    </p>
                  </div>

                  {/* Mute Toggle */}
                  <Button
                    onClick={handleMuteToggle}
                    size="sm"
                    className={`w-full ${
                      isMuted
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-4 h-4 mr-2" />
                        Unmute Sound
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        Mute Sound
                      </>
                    )}
                  </Button>

                  {/* Instructions */}
                  <div className="mt-4 p-2 bg-blue-50 rounded text-xs">
                    <p className="font-bold text-blue-800">
                      💡 Troubleshooting:
                    </p>
                    <p className="text-blue-700">
                      1. Click any test button above
                    </p>
                    <p className="text-blue-700">
                      2. Check browser console for errors
                    </p>
                    <p className="text-blue-700">3. Try refreshing the page</p>
                    <p className="text-blue-700">4. Ensure volume is up</p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex space-x-2">
              {/* <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-gray-700 hover:bg-gray-100 rounded-full p-2"
                >
                  <Home className="w-5 h-5" />
                </Button>
              </Link> */}
              {/* <Link href="/profile">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-gray-700 hover:bg-gray-100 rounded-full p-2"
                >
                  <User className="w-5 h-5" />
                </Button>
              </Link> */}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Quick Audio Toggle for Mobile */}
            <Button
              onClick={handleMuteToggle}
              size="sm"
              className={`rounded-full p-2 ${
                isMuted
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>

            <Button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              variant="outline"
              size="sm"
              className="rounded-full p-2"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t-2 border-gray-200 z-50">
            <div className="p-4 space-y-4">
              {/* Language Switcher Mobile */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">
                  Language:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(["en", "ar", "so"] as const).map((lang) => (
                    <Button
                      key={lang}
                      variant={language === lang ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleLanguageChange(lang)}
                      className={`${
                        language === lang
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      } font-bold rounded-lg py-3`}
                    >
                      {lang.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Navigation Mobile */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">
                  Navigation:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/" onClick={() => setShowMobileMenu(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <Home className="w-4 h-4 mr-2" />
                      {t("home")}
                    </Button>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Button variant="outline" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      {t("profile")}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Audio Controls Mobile */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Audio:</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">
                      Status: {isAudioReady ? "✅ Ready" : "❌ Not Ready"}
                    </span>
                    <Button
                      onClick={testBeep}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Test 🔊
                    </Button>
                  </div>

                  <Button
                    onClick={handleMuteToggle}
                    className={`w-full ${
                      isMuted
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-4 h-4 mr-2" />
                        Unmute Sound
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        Mute Sound
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Quick Test Buttons Mobile */}
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">
                  Quick Tests:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => playSound("correct")}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    ✅ Correct
                  </Button>
                  <Button
                    onClick={() => playSound("wrong")}
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    ❌ Wrong
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
