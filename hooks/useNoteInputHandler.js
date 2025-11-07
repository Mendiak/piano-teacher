'use client';

import { useCallback } from 'react';
import * as Tone from 'tone';
import { MIDI_TO_NOTE } from '../utils/midiUtils.js';

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
  setCurrentIdx,
  targetZoneY,
  targetZoneHeight
) {
  const handleUserNoteOn = useCallback((midiNote) => {

    if (typeof midiNote !== 'number' || !synth) {

      return;
    }

    const noteName = MIDI_TO_NOTE(midiNote);
    if (synth && noteName) {
      synth.triggerAttack(noteName);
    }



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

      // Define the hit window based on targetZoneY and targetZoneHeight
      const hitWindowTop = targetZoneY;
      const hitWindowBottom = targetZoneY + targetZoneHeight;

      for (let i = 0; i < fnotes.length; i++) {
        const fn = fnotes[i];
        if (!fn || typeof fn.midi !== 'number' || fn.hitStatus) continue; // Skip already hit notes

        const noteTop = fn.y - ((typeof fn.duration === 'number') ? fn.duration * 100 : 12); // Top of the falling note
        const noteBottom = fn.y; // Bottom of the falling note

        // Check if the falling note is within the hit window
        const isInHitWindow = (noteBottom >= hitWindowTop && noteTop <= hitWindowBottom);

        if (midiNote === fn.midi && isInHitWindow) {
          matched = true;
          // Mark the note as hit for visual feedback in FallingNotesAnimation
          fn.hitStatus = 'correct';
          fn.hitTime = now;

          setHits(h => h + 1);
          setScore(s => s + 10 + combo * 2);
          setCombo(c => { const nc = c + 1; setMaxCombo(mc => Math.max(mc, nc)); return nc; });
          setReactionTimes(rt => [...rt, now - (fn.spawnTime || now)]);

          // Remove the note from the fallingNotesRef after it's been marked as hit
          // The animation loop will handle the visual disappearance
          fallingNotesRef.current = fnotes.filter(n => n !== fn);
          break;
        }
      }

      if (!matched) {
        // If no matching note was found in the hit window, it's a miss
        setMisses(m => m + 1);
        setCombo(0);
        setScore(s => Math.max(0, s - 5));

        // Check for any falling note that was missed (passed the hit window without being played)
        // and mark it as incorrect for visual feedback
        const missedNote = fnotes.find(fn =>
          !fn.hitStatus &&
          fn.midi === midiNote && // This is the note the user *tried* to play
          fn.y > hitWindowBottom // It has passed the hit window
        );
        if (missedNote) {
          missedNote.hitStatus = 'incorrect';
          missedNote.hitTime = now;
          fallingNotesRef.current = fnotes.filter(n => n !== missedNote);
        }
      }
    }
  }, [events, currentIdx, mode, synth, combo, lastNoteTimeRef, expectedNoteRef, fallingNotesRef, setHits, setScore, setCombo, setMaxCombo, setReactionTimes, setMisses, setCurrentIdx]);

  return { handleUserNoteOn };
}
