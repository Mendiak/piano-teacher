'use client';

import { useCallback } from 'react';

export function useNoteInputHandler(
  events,
  currentIdx,
  mode,
  synth,
  combo,
  lastNoteTimeRef,
  expectedNoteRef,
  fallingNotesRef,
  setHits,
  setScore,
  setCombo,
  setMaxCombo,
  setReactionTimes,
  setMisses,
  playMidi,
  setCurrentIdx
) {
  const handleUserNoteOn = useCallback((midiNote) => {
    if (typeof midiNote !== 'number' || !synth) return;

    playMidi(midiNote);

    if (mode === 'step') {
      const expected = events[currentIdx];
      if (!expected) return;
      const expectedMidi = expected.midi;
      const now = performance.now();
      if (midiNote === expectedMidi) {
        setHits(h => h + 1);
        setScore(s => s + 10 + combo * 2);
        setCombo(c => { const nc = c + 1; setMaxCombo(mc => Math.max(mc, nc)); return nc; });
        setReactionTimes(rt => [...rt, now - (lastNoteTimeRef.current || now)]);
        expectedNoteRef.current = null;
        setCurrentIdx(i => i + 1);
      } else {
        setMisses(m => m + 1);
        setCombo(0);
        setScore(s => Math.max(0, s - 5));
      }
    } else if (mode === 'fall') {
      const now = performance.now();
      let matched = false;
      const fnotes = Array.isArray(fallingNotesRef.current) ? fallingNotesRef.current : [];
      for (let i = 0; i < fnotes.length; i++) {
        const fn = fnotes[i];
        if (!fn || typeof fn.midi !== 'number') continue;
        const y = (typeof fn.y === 'number') ? fn.y : Number.POSITIVE_INFINITY;
        const targetY = (typeof fn.targetY === 'number') ? fn.targetY : 0;
        const midiDiff = Math.abs(fn.midi - midiNote);
        const yDiff = Math.abs(y - targetY);
        if (midiDiff < 1 && yDiff < 30) { // flexible hit window
          matched = true;
          setHits(h => h + 1);
          setScore(s => s + 10 + combo * 2);
          setCombo(c => { const nc = c + 1; setMaxCombo(mc => Math.max(mc, nc)); return nc; });
          setReactionTimes(rt => [...rt, now - (fn.spawnTime || now)]);
          fallingNotesRef.current = fnotes.slice();
          fallingNotesRef.current.splice(i, 1);
          break;
        }
      }
      if (!matched) { setMisses(m => m + 1); setCombo(0); setScore(s => Math.max(0, s - 5)); }
    }
  }, [events, currentIdx, mode, synth, combo, lastNoteTimeRef, expectedNoteRef, fallingNotesRef, setHits, setScore, setCombo, setMaxCombo, setReactionTimes, setMisses, playMidi, setCurrentIdx]);

  return { handleUserNoteOn };
}
