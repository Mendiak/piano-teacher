'use client';

import { useCallback } from 'react';
import * as Tone from 'tone';

export function usePlayback(
  midi,
  synth,
  mode,
  events,
  tempoFactor,
  fallingNotes,
  setActiveFallingNotesCount,
  keyPositionsRef,
  setIsPlaying,
  setCountdownValue,
  setIsMidiFinished,
  setFallingNotes,
  actualMidiDuration,
  isAutoPlaying,
  setPressedKeys // New prop
) {

  const _startTonePlayback = useCallback(async () => {
    console.log('[_startTonePlayback] called');
    if (!midi || !synth) {
      console.log('[_startTonePlayback] midi or synth missing, returning.');
      return;
    }

    await Tone.start();
    console.log('[_startTonePlayback] Tone started.');

    const bpm = midi.header.tempos.length > 0 ? midi.header.tempos[0].bpm : 120;
    Tone.Transport.bpm.value = bpm * tempoFactor;
    console.log(`[_startTonePlayback] Tempo set to: ${Tone.Transport.bpm.value}`);

    const part = new Tone.Part((time, note) => {
      console.log(`[_startTonePlayback] Playing note: ${note.name} at time: ${time}`);
      if (isAutoPlaying) {
        // Simulate key press
        Tone.Draw.schedule(() => {
          setPressedKeys(prev => new Set(prev).add(note.midi));
        }, time);
        // Simulate key release
        Tone.Draw.schedule(() => {
          setPressedKeys(prev => {
            const newSet = new Set(prev);
            newSet.delete(note.midi);
            return newSet;
          });
        }, time + note.duration);
        // Trigger synth for auto-play
        synth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
      }

      if (mode === 'fall') {
        Tone.Draw.schedule(() => {
          console.log('Pushing falling note:', note.midi);
          const x = keyPositionsRef.current[note.midi];
          if (x !== undefined) {
            setFallingNotes(prev => [...prev, { midi: note.midi, x, y: -20, spawnTime: performance.now(), targetY: 180, duration: note.duration }]);
            setActiveFallingNotesCount(prev => prev + 1);
          }
        }, time);
      } else if (mode === 'step') { // Only trigger synth for step mode if not auto-playing
        synth.triggerAttackRelease(note.name, note.duration, time, note.velocity);
      }
    }, events).start(0);

    Tone.Transport.off('stop'); // Clear previous stop listeners
    Tone.Transport.on('stop', () => {
      console.log('[_startTonePlayback] Tone.Transport stopped.');
      setIsPlaying(false);
      part.clear();
      setIsMidiFinished(true);
      setActiveFallingNotesCount(0); // Clear any remaining notes
      setPressedKeys(new Set()); // Clear pressed keys on stop
    });

    Tone.Transport.start();
    console.log('[_startTonePlayback] Tone.Transport started.');
    setIsPlaying(true);

    // Schedule stop after MIDI duration
    Tone.Transport.scheduleOnce(() => {
      Tone.Transport.stop();
      console.log('[_startTonePlayback] Scheduled stop triggered.');
    }, actualMidiDuration); // Use actualMidiDuration
  }, [midi, synth, mode, events, tempoFactor, setFallingNotes, setActiveFallingNotesCount, keyPositionsRef, setIsPlaying, setIsMidiFinished, actualMidiDuration, isAutoPlaying, setPressedKeys]);

  const startPlayback = useCallback(async () => {
    console.log('[startPlayback] called. isAutoPlaying:', isAutoPlaying, 'mode:', mode);
    if (!midi || !synth) {
      console.log('[startPlayback] midi or synth missing, returning.');
      return;
    }

    // Ensure Tone.js audio context is running
    if (Tone.context.state !== 'running') {
      console.log('[startPlayback] Tone.context is not running, attempting to start.');
      await Tone.start();
      if (Tone.context.state !== 'running') {
        console.warn('[startPlayback] Tone.context still not running after attempt to start. Audio may not play.');
        // Optionally, inform the user that audio might not play
      }
    }

    if (isAutoPlaying || mode === 'fall') { // If auto-playing or in fall mode, use countdown/direct playback
      console.log('[startPlayback] Entering auto-play or fall mode logic.');
      setCountdownValue(3);
      let count = 3;
      const countdownInterval = setInterval(() => {
        count -= 1;
        console.log('[startPlayback] Countdown:', count);
        if (count > 0) {
          setCountdownValue(count);
        } else if (count === 0) {
          setCountdownValue('Go!');
        } else {
          clearInterval(countdownInterval);
          setCountdownValue(null);
          _startTonePlayback(); // Start actual playback after countdown
        }
      }, 1000);
    } else if (mode === 'step') { // Only set isPlaying for step mode if not auto-playing
      console.log('[startPlayback] Entering step mode logic (not auto-playing).');
      setIsPlaying(true);
    }
  }, [midi, synth, mode, setCountdownValue, _startTonePlayback, setIsPlaying, isAutoPlaying]);

  const stopPlayback = useCallback(() => {
    Tone.Transport.stop();
    setIsPlaying(false);
    setFallingNotes([]);
  }, [setIsPlaying, setFallingNotes]);

  return { startPlayback, stopPlayback };
}
