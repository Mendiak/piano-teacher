'use client';

import { useCallback, useEffect } from 'react';

import { MIDI_TO_NOTE } from '../utils/midiUtils.js';

export function useMidiInputHandler(midiAccess, setPressedKeys, handleUserNoteOn, playMidi, synth) {
  const onMIDIMessage = useCallback((e) => {
    const [status, data1, data2] = e.data;
    const command = status & 0xf0;
    const midiNote = data1;
    const noteName = MIDI_TO_NOTE(midiNote);

    if (command === 0x90 && data2 > 0) { // note on

      setPressedKeys(prev => new Set(prev).add(midiNote));
      handleUserNoteOn(midiNote);
    } else if (command === 0x80 || (command === 0x90 && data2 === 0)) { // note off

      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(midiNote);
        return newSet;
      });
      if (synth && noteName) {
        synth.triggerRelease(noteName);
      }
    }
  }, [setPressedKeys, handleUserNoteOn, synth]); // Dependencies for onMIDIMessage

  useEffect(() => {
    if (!midiAccess) return;
    const inputs = Array.from(midiAccess.inputs.values());
    inputs.forEach(input => input.onmidimessage = onMIDIMessage);
    return () => inputs.forEach(input => input.onmidimessage = null);
  }, [midiAccess, onMIDIMessage]); // Dependencies for useEffect
}
