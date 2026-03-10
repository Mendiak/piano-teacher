'use client';

import { useEffect, useRef, useState } from 'react';

// Relative mapping (semitones from C)
const KEY_RELATIVE_MAP = {
  // White keys
  'a': 0,  // C
  's': 2,  // D
  'd': 4,  // E
  'f': 5,  // F
  'g': 7,  // G
  'h': 9,  // A
  'j': 11, // B
  'k': 12, // C (+1 Oct)
  'l': 14, // D (+1 Oct)
  ';': 16, // E (+1 Oct)
  "'": 17, // F (+1 Oct)
  
  // Black keys
  'w': 1,  // C#
  'e': 3,  // D#
  't': 6,  // F#
  'y': 8,  // G#
  'u': 10, // A#
  'o': 13, // C# (+1 Oct)
  'p': 15, // D# (+1 Oct)
};

export function useComputerKeyboardInput(setPressedKeys, handleUserNoteOn, octave, setOctave) {
  const activeKeys = useRef(new Map()); // Map key -> midiNote

  useEffect(() => {
    const onKeyDown = (e) => {
      // Ignore if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = e.key.toLowerCase();

      // Octave controls
      if (key === 'z') {
        setOctave(prev => Math.max(0, prev - 1));
        return;
      }
      if (key === 'x') {
        setOctave(prev => Math.min(7, prev + 1));
        return;
      }

      // Note keys
      if (activeKeys.current.has(key)) return;

      const relativeNote = KEY_RELATIVE_MAP[key];
      if (relativeNote !== undefined) {
        // Calculate MIDI note: (Octave + 1) * 12 + relativeNote
        // Example: Octave 3, C (0) -> (3 + 1) * 12 + 0 = 48
        const midiNote = (octave + 1) * 12 + relativeNote;
        
        activeKeys.current.set(key, midiNote);
        handleUserNoteOn(midiNote, 127);
        
        setPressedKeys(prev => {
          const newKeys = new Set(prev);
          newKeys.add(midiNote);
          return newKeys;
        });
      }
    };

    const onKeyUp = (e) => {
      const key = e.key.toLowerCase();
      const midiNote = activeKeys.current.get(key);

      if (midiNote !== undefined) {
        activeKeys.current.delete(key);
        handleUserNoteOn(midiNote, 0);
        
        setPressedKeys(prev => {
          const newKeys = new Set(prev);
          newKeys.delete(midiNote);
          return newKeys;
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [octave, setPressedKeys, handleUserNoteOn, setOctave]);
}
