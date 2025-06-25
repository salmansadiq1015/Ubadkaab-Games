"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAudio } from "@/contexts/audio-context";
import { useUser } from "@/contexts/user-context";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Play, Music, Volume2 } from "lucide-react";
import Link from "next/link";

interface Note {
  id: string;
  name: string;
  color: string;
  sound: string;
}

interface Song {
  id: number;
  name: string;
  notes: string[];
  tempo: number;
}

const pianoNotes: Note[] = [
  { id: "C", name: "C", color: "bg-white border-gray-300", sound: "C" },
  { id: "C#", name: "C#", color: "bg-gray-800", sound: "C#" },
  { id: "D", name: "D", color: "bg-white border-gray-300", sound: "D" },
  { id: "D#", name: "D#", color: "bg-gray-800", sound: "D#" },
  { id: "E", name: "E", color: "bg-white border-gray-300", sound: "E" },
  { id: "F", name: "F", color: "bg-white border-gray-300", sound: "F" },
  { id: "F#", name: "F#", color: "bg-gray-800", sound: "F#" },
  { id: "G", name: "G", color: "bg-white border-gray-300", sound: "G" },
  { id: "G#", name: "G#", color: "bg-gray-800", sound: "G#" },
  { id: "A", name: "A", color: "bg-white border-gray-300", sound: "A" },
  { id: "A#", name: "A#", color: "bg-gray-800", sound: "A#" },
  { id: "B", name: "B", color: "bg-white border-gray-300", sound: "B" },
];

const simpleSongs: Song[] = [
  {
    id: 1,
    name: "Twinkle Twinkle",
    notes: ["C", "C", "G", "G", "A", "A", "G"],
    tempo: 500,
  },
  {
    id: 2,
    name: "Happy Birthday",
    notes: ["C", "C", "D", "C", "F", "E"],
    tempo: 400,
  },
  {
    id: 3,
    name: "Mary Had a Little Lamb",
    notes: ["E", "D", "C", "D", "E", "E", "E"],
    tempo: 450,
  },
];

export default function MusicGame() {
  const { t } = useLanguage();
  const { playSound } = useAudio();
  const { updateScore } = useUser();
  const [currentMode, setCurrentMode] = useState<"piano" | "songs">("piano");
  const [playedNotes, setPlayedNotes] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [learnedSongs, setLearnedSongs] = useState<Set<number>>(new Set());

  const handleNotePress = (note: Note) => {
    playSound("music");
    setPlayedNotes((prev) => [...prev, note.id]);
    setScore((prev) => prev + 5);

    // Visual feedback
    setTimeout(() => {
      // Remove visual feedback after animation
    }, 200);
  };

  const handleClearNotes = () => {
    playSound("click");
    setPlayedNotes([]);
  };

  const playSong = async (song: Song) => {
    setIsPlayingSong(true);
    setSelectedSong(song);
    setCurrentNoteIndex(0);

    for (let i = 0; i < song.notes.length; i++) {
      setCurrentNoteIndex(i);
      playSound("music");
      await new Promise((resolve) => setTimeout(resolve, song.tempo));
    }

    setIsPlayingSong(false);
    setCurrentNoteIndex(0);
  };

  const handleLearnSong = (song: Song) => {
    playSound("click");
    setSelectedSong(song);
    setPlayedNotes([]);
  };

  const handleSongComplete = (song: Song) => {
    if (JSON.stringify(playedNotes) === JSON.stringify(song.notes)) {
      playSound("correct");
      setLearnedSongs((prev) => new Set([...prev, song.id]));
      setScore((prev) => prev + 100);
      updateScore("music", 100, song.id);
    } else {
      playSound("wrong");
    }
  };

  const handleRestart = () => {
    playSound("click");
    setPlayedNotes([]);
    setScore(0);
    setSelectedSong(null);
    setIsPlayingSong(false);
    setCurrentNoteIndex(0);
    setLearnedSongs(new Set());
  };

  const isBlackKey = (noteId: string) => noteId.includes("#");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
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
                Songs Learned: {learnedSongs.size}/{simpleSongs.length}
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
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎵 {t("music")} 🎵
          </h1>
          <p className="text-xl text-gray-600">
            Create beautiful music and learn popular songs!
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            onClick={() => setCurrentMode("piano")}
            className={`${
              currentMode === "piano"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } font-bold rounded-full px-8 py-3 shadow-lg transition-all duration-300`}
          >
            🎹 Free Play Piano
          </Button>
          <Button
            onClick={() => setCurrentMode("songs")}
            className={`${
              currentMode === "songs"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            } font-bold rounded-full px-8 py-3 shadow-lg transition-all duration-300`}
          >
            🎼 Learn Songs
          </Button>
        </div>

        {currentMode === "piano" ? (
          /* Piano Mode */
          <div className="max-w-6xl mx-auto">
            <Card className="bg-white shadow-2xl mb-6">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Virtual Piano
                  </h2>
                  <p className="text-gray-600">
                    Click on the keys to play beautiful music!
                  </p>
                </div>

                {/* Piano Keys */}
                <div
                  className="relative mx-auto"
                  style={{ width: "fit-content" }}
                >
                  <div className="flex">
                    {pianoNotes
                      .filter((note) => !isBlackKey(note.id))
                      .map((note, index) => (
                        <button
                          key={note.id}
                          className={`${note.color} border-2 border-gray-300 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 w-16 h-40 relative`}
                          onClick={() => handleNotePress(note)}
                        >
                          <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600 font-bold">
                            {note.name}
                          </span>
                        </button>
                      ))}
                  </div>

                  {/* Black Keys */}
                  <div className="absolute top-0 flex">
                    {pianoNotes.map((note, index) => {
                      if (!isBlackKey(note.id)) return null;

                      const whiteKeysBefore = pianoNotes
                        .slice(0, index)
                        .filter((n) => !isBlackKey(n.id)).length;
                      const leftOffset = whiteKeysBefore * 64 - 20; // 64px width, -20px to center

                      return (
                        <button
                          key={note.id}
                          className={`${note.color} text-white hover:bg-gray-700 active:bg-gray-600 transition-all duration-150 w-10 h-24 absolute z-10`}
                          style={{ left: `${leftOffset}px` }}
                          onClick={() => handleNotePress(note)}
                        >
                          <span className="text-xs font-bold mt-16 block">
                            {note.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Played Notes Display */}
                <div className="mt-8 text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Notes Played:
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 min-h-16 flex items-center justify-center">
                    {playedNotes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {playedNotes.map((note, index) => (
                          <span
                            key={index}
                            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        Start playing to see your notes here!
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleClearNotes}
                    variant="outline"
                    className="mt-4"
                    disabled={playedNotes.length === 0}
                  >
                    Clear Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Songs Mode */
          <div className="max-w-4xl mx-auto">
            {!selectedSong ? (
              /* Song Selection */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {simpleSongs.map((song) => (
                  <Card
                    key={song.id}
                    className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Music className="w-8 h-8 text-white" />
                        {learnedSongs.has(song.id) && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        {song.name}
                      </h3>
                      <div className="space-y-2">
                        <Button
                          onClick={() => playSong(song)}
                          disabled={isPlayingSong}
                          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {isPlayingSong && selectedSong?.id === song.id
                            ? "Playing..."
                            : "Listen"}
                        </Button>
                        <Button
                          onClick={() => handleLearnSong(song)}
                          variant="outline"
                          className="w-full"
                        >
                          Learn to Play
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Song Learning */
              <Card className="bg-white shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Learning: {selectedSong.name}
                    </h2>
                    <p className="text-gray-600">
                      Follow the pattern and play the notes in order!
                    </p>
                  </div>

                  {/* Song Pattern */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                      Song Pattern:
                    </h3>
                    <div className="flex justify-center space-x-2 flex-wrap">
                      {selectedSong.notes.map((note, index) => (
                        <div
                          key={index}
                          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                            index < playedNotes.length
                              ? playedNotes[index] === note
                                ? "bg-green-500 text-white border-green-500"
                                : "bg-red-500 text-white border-red-500"
                              : index === playedNotes.length
                              ? "bg-yellow-200 border-yellow-500 text-yellow-800 animate-pulse"
                              : "bg-gray-100 border-gray-300 text-gray-600"
                          }`}
                        >
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mini Piano for Learning */}
                  <div className="flex justify-center mb-6">
                    <div className="flex">
                      {pianoNotes
                        .filter((note) => !isBlackKey(note.id))
                        .slice(0, 7)
                        .map((note) => (
                          <button
                            key={note.id}
                            className={`${note.color} border-2 border-gray-300 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 w-12 h-24 relative text-xs`}
                            onClick={() => handleNotePress(note)}
                          >
                            <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-600 font-bold">
                              {note.name}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="bg-gray-200 rounded-full h-4 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (playedNotes.length / selectedSong.notes.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-center mt-2 font-bold text-gray-700">
                      Progress: {playedNotes.length}/{selectedSong.notes.length}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => playSong(selectedSong)}
                      disabled={isPlayingSong}
                      variant="outline"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Play Song
                    </Button>

                    <Button
                      onClick={() => handleSongComplete(selectedSong)}
                      disabled={
                        playedNotes.length !== selectedSong.notes.length
                      }
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      Check My Playing
                    </Button>

                    <Button
                      onClick={() => setSelectedSong(null)}
                      variant="outline"
                    >
                      Back to Songs
                    </Button>
                  </div>

                  {/* Success Message */}
                  {learnedSongs.has(selectedSong.id) && (
                    <div className="text-center mt-6">
                      <div className="bg-green-100 rounded-xl p-6">
                        <h3 className="text-2xl font-bold text-green-600 mb-2">
                          🎉 Song Learned! 🎉
                        </h3>
                        <p className="text-green-700">
                          Perfect! You've mastered {selectedSong.name}!
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
