'use client';

import { useState, useEffect } from 'react';
import { synthPresets } from '../components/synth-presets';
import { midiLibrary } from '../components/midi-library';

export function usePianoTeacherState() {
  const [mode, setMode] = useState('step');
  const [midi, setMidi] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempoFactor, setTempoFactor] = useState(1);
  const [selectedSong, setSelectedSong] = useState(Object.keys(midiLibrary)[0]);
  const [theme, setTheme] = useState('light');
  const [selectedSynthPreset, setSelectedSynthPreset] = useState('default');
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [countdownValue, setCountdownValue] = useState(null); // null, 3, 2, 1, 'Go!'
  const [adsr, setAdsr] = useState(synthPresets.default.options.envelope);

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
  };
}
