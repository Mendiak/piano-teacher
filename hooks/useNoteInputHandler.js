'use client';

import { useCallback, useRef } from 'react';
import { MIDI_TO_NOTE } from '../utils/midiUtils.js';

export function useNoteInputHandler(
  events,
  currentIdx,
  mode,
  synth,
  combo,
  lastNoteTimeRef,
  fallingNotes,
  setFallingNotes,
  setActiveFallingNotesCount,
  setHits,
  setScore,
  setCombo,
  setMaxCombo,
  setReactionTimes,
  setMisses,
  setCurrentIdx
) {
  const currentNoteRef = useRef(null);

  const handleUserNoteOn = useCallback((midiNote, velocity = 0) => {
    if (typeof midiNote !== 'number' || !synth) {
      return;
    }

    const noteName = MIDI_TO_NOTE(midiNote);

    // Solo procesamos Note On (velocity > 0)
    if (velocity > 0) {
      if (synth && noteName) {
        synth.triggerAttack(noteName);
      }

      if (mode === 'step') {
        const expected = events[currentIdx];
        if (!expected) return;

        // Si es la misma nota que ya estamos procesando, ignorar
        if (currentNoteRef.current === midiNote) {
          return;
        }

        const expectedMidi = expected.midi;

        if (midiNote === expectedMidi) {
          currentNoteRef.current = midiNote;
          setHits(h => h + 1);
          setScore(s => s + 10 + combo * 2);
          setCombo(c => {
            const nc = c + 1;
            setMaxCombo(mc => Math.max(mc, nc));
            return nc;
          });
          setCurrentIdx(i => i + 1);
        } else {
          setMisses(m => m + 1);
          setCombo(0);
          setScore(s => Math.max(0, s - 5));
        }
      }
    } else {
      // Note Off
      if (synth && noteName) {
        synth.triggerRelease(noteName);
      }
      // Limpiar la nota actual si es la que estaba siendo procesada
      if (currentNoteRef.current === midiNote) {
        currentNoteRef.current = null;
      }
    }
  }, [events, currentIdx, mode, synth, combo, setHits, setScore, setCombo, setMaxCombo, setMisses, setCurrentIdx]);

  return { handleUserNoteOn };
}
