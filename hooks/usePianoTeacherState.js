'use client';

import { useState } from 'react';

export function usePianoTeacherState() {
  const [mode, setMode] = useState('step');
  const [midi, setMidi] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempoFactor, setTempoFactor] = useState(1);
  const [selectedSong, setSelectedSong] = useState('custom');
  const [theme, setTheme] = useState('light');
  const [selectedSynthPreset, setSelectedSynthPreset] = useState('default');
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [countdownValue, setCountdownValue] = useState(null); // null, 3, 2, 1, 'Go!'

  return {
    mode, setMode,
    midi, setMidi,
    events, setEvents,
    currentIdx, setCurrentIdx,
    isPlaying, setIsPlaying,
    tempoFactor, setTempoFactor,
    selectedSong, setSelectedSong,
    theme, setTheme,
    selectedSynthPreset, setSelectedSynthPreset,
    pressedKeys, setPressedKeys,
    countdownValue, setCountdownValue,
  };
}
