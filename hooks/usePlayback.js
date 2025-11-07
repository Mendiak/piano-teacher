'use client';

import { useCallback } from 'react';
import * as Tone from 'tone';

export function usePlayback(
  midi,
  synth,
  mode,
  events,
  tempoFactor,
  fallingNotesRef,
  keyPositionsRef,
  setIsPlaying,
  setCountdownValue,
  showResults
) {

  const _startTonePlayback = useCallback(async () => {
    if (!midi || !synth) return;

    await Tone.start();

    const bpm = midi.header.tempos.length > 0 ? midi.header.tempos[0].bpm : 120;
    Tone.Transport.bpm.value = bpm * tempoFactor;

    const part = new Tone.Part((time, note) => {
      synth.triggerAttackRelease(note.name, note.duration, time, note.velocity);

      if (mode === 'fall') {
        Tone.Draw.schedule(() => {
          const x = keyPositionsRef.current[note.midi];
          if (x !== undefined) {
            fallingNotesRef.current.push({ midi: note.midi, x, y: -20, spawnTime: performance.now(), targetY: 180, duration: note.duration });
          }
        }, time);
      }
    }, events).start(0);

    Tone.Transport.off('stop'); // Clear previous stop listeners
    Tone.Transport.on('stop', () => {
      setIsPlaying(false);
      part.clear();
      showResults();
    });

    Tone.Transport.start();
    setIsPlaying(true);

    // Schedule stop after MIDI duration
    Tone.Transport.scheduleOnce(() => {
      Tone.Transport.stop();
    }, midi.duration);
  }, [midi, synth, mode, events, tempoFactor, fallingNotesRef, keyPositionsRef, setIsPlaying, showResults]);

  const startPlayback = useCallback(async () => {
    if (!midi || !synth) return;

    if (mode === 'fall') {
      setCountdownValue(3);
      let count = 3;
      const countdownInterval = setInterval(() => {
        count -= 1;
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
    } else if (mode === 'step') {
      setIsPlaying(true);
    } else {
      _startTonePlayback();
    }
  }, [midi, synth, mode, setCountdownValue, _startTonePlayback, setIsPlaying]);

  const stopPlayback = useCallback(() => {
    Tone.Transport.stop();
    setIsPlaying(false);
    fallingNotesRef.current = [];
  }, [setIsPlaying, fallingNotesRef]);

  return { startPlayback, stopPlayback };
}
