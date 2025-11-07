'use client';

import { useCallback } from 'react';
import { Midi } from '@tonejs/midi';
import { midiLibrary } from '../components/midi-library.js';

export function useMidiLoader(setMidi, setEvents, setCurrentIdx, resetScore, setSelectedSong) {

  const loadMidi = useCallback(async (fileOrMidi) => {
    let parsedMidi;
    if (fileOrMidi instanceof File) {
      const arrayBuffer = await fileOrMidi.arrayBuffer();
      try {
        parsedMidi = new Midi(arrayBuffer);
      } catch (err) {
        console.error('Failed to parse MIDI', err);
        return;
      }
    } else {
      parsedMidi = fileOrMidi;
    }

    setMidi(parsedMidi);
    const notes = parsedMidi.tracks.flatMap(track => track.notes);
    notes.sort((a, b) => a.time - b.time);
    setEvents(notes);
    setCurrentIdx(0);
    resetScore();
  }, [setMidi, setEvents, setCurrentIdx, resetScore]);

  const handleSongSelection = useCallback((songKey) => {
    setSelectedSong(songKey);
    if (songKey === 'custom') {
      setMidi(null);
      setEvents([]);
    }
    else {
      const midiData = midiLibrary[songKey];
      loadMidi(midiData);
    }
  }, [setSelectedSong, setMidi, setEvents, loadMidi]);

  return { loadMidi, handleSongSelection, midiLibrary };
}
