'use client';

import { useState, useEffect } from 'react';
import { synthPresets } from '../components/synth-presets';

export function usePianoTeacherState() {
  const [mode, setMode] = useState('step');
  const [midi, setMidi] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempoFactor, setTempoFactor] = useState(1);
  const [selectedSong, setSelectedSong] = useState(null); // Initialize to null
  const [theme, setTheme] = useState('light');
  const [selectedSynthPreset, setSelectedSynthPreset] = useState('default');
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [countdownValue, setCountdownValue] = useState(null); // null, 3, 2, 1, 'Go!'
  const [adsr, setAdsr] = useState(synthPresets.default.options.envelope);
  const [actualMidiDuration, setActualMidiDuration] = useState(0); // New state for actual MIDI duration
  const [isAutoPlaying, setIsAutoPlaying] = useState(false); // New state for auto-play mode

  useEffect(() => {
    const newPreset = synthPresets[selectedSynthPreset];
    if (newPreset) {
      setAdsr(newPreset.options.envelope);
    }
  }, [selectedSynthPreset]);

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
    adsr, setAdsr,
    actualMidiDuration, setActualMidiDuration, // Return new state
    isAutoPlaying, setIsAutoPlaying, // Return new state
  };
}
