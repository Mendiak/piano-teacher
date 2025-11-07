'use client';

import { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { synthPresets } from '../components/synth-presets.js';

export function useSynth(selectedSynthPreset, adsr) {
  const [synth, setSynth] = useState(null);

  useEffect(() => {
    const preset = synthPresets[selectedSynthPreset];
    const newSynth = new Tone.PolySynth(Tone.Synth, preset.options).toDestination();
    setSynth(newSynth);

    return () => {
      if (newSynth) {
        newSynth.dispose();
      }
    };
  }, [selectedSynthPreset]);

  useEffect(() => {
    if (synth && adsr) {
      synth.set({ envelope: adsr });
    }
  }, [synth, adsr]);

  return synth;
}
