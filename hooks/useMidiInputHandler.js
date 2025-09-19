'use client';

import { useCallback, useEffect } from 'react';

export function useMidiInputHandler(midiAccess, setPressedKeys, handleUserNoteOn, playMidi) {
  const onMIDIMessage = useCallback((e) => {
    const [status, data1, data2] = e.data;
    const command = status & 0xf0;
    const midiNote = data1;

    if (command === 0x90 && data2 > 0) { // note on
      console.log('Note On:', midiNote, 'Velocity:', data2);
      setPressedKeys(prev => new Set(prev).add(midiNote));
      handleUserNoteOn(midiNote);
      playMidi(midiNote); // Trigger attack
    } else if (command === 0x80 || (command === 0x90 && data2 === 0)) { // note off
      console.log('Note Off:', midiNote, 'Velocity:', data2);
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(midiNote);
        return newSet;
      });
    }
  }, [setPressedKeys, handleUserNoteOn, playMidi]); // Dependencies for onMIDIMessage

  useEffect(() => {
    if (!midiAccess) return;
    const inputs = Array.from(midiAccess.inputs.values());
    inputs.forEach(input => input.onmidimessage = onMIDIMessage);
    return () => inputs.forEach(input => input.onmidimessage = null);
  }, [midiAccess, onMIDIMessage]); // Dependencies for useEffect
}
