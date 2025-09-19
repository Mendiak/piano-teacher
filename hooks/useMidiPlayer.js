'use client';

import { useCallback } from 'react';
import * as Tone from 'tone';
import { MIDI_TO_NOTE } from '../utils/midiUtils.js';

export function useMidiPlayer(synth) {
  const playMidi = useCallback(async (midiNote) => {
    if (!synth) return;
    if (typeof midiNote !== 'number') return;
    await Tone.start(); // Ensure audio context is started
    const noteName = MIDI_TO_NOTE(midiNote);
    try {
      synth.triggerAttackRelease(noteName, '0.1'); // Use triggerAttackRelease with short duration
    } catch (e) { console.warn('play error', e); }
  }, [synth]);

  return { playMidi };
}
