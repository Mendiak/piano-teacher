'use client';

import { useCallback } from 'react';
import * as Tone from 'tone';

export function useMidiPlayer(synth) {
  const playMidi = useCallback((note, time, duration) => {
    if (synth && note) {
      synth.triggerAttackRelease(Tone.Midi(note).toNote(), duration, time);
    }
  }, [synth]);

  return { playMidi };
}
