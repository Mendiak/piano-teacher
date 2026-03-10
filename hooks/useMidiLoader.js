'use client';

import { useCallback } from 'react';
import { Midi } from '@tonejs/midi';


const availableSongs = [
  { name: 'Simple - Twinkle Twinkle Little Star', file: 'Twinkle-Twinkle.mid' },
  { name: 'Beethoven - Moonlight Sonata', file: 'Beethoven-Moonlight-Sonata.mid' },
  { name: 'Mozart - Fur Elise', file: 'Mozart-Fur-Elise.mid' },
];

export function useMidiLoader(setMidi, setEvents, setCurrentIdx, resetScore, setSelectedSong, setActualMidiDuration) {
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

    // Calculate the actual duration based on the last note's end time
    let actualMidiDuration = parsedMidi.duration; // Start with Tone.js's duration
    if (notes.length > 0) {
      const lastNote = notes[notes.length - 1];
      const lastNoteEndTime = lastNote.time + lastNote.duration;
      if (lastNoteEndTime > actualMidiDuration) {
        actualMidiDuration = lastNoteEndTime;
      }
    }
    // We cannot set parsedMidi.duration as it's a getter-only property.
    // Instead, we will pass this actualMidiDuration to the state.
    setActualMidiDuration(actualMidiDuration); // Set the calculated duration in state

    setEvents(notes);
    setCurrentIdx(0);
    resetScore();
  }, [setMidi, setEvents, setCurrentIdx, resetScore, setActualMidiDuration]); // Added setActualMidiDuration to dependencies

  const handleSongSelection = useCallback(async (songKey) => {
    setSelectedSong(songKey);
    if (songKey === 'custom') {
      setMidi(null);
      setEvents([]);
      setActualMidiDuration(0); // Reset duration for custom
    }
    else {
      const song = availableSongs.find(s => s.name === songKey);
      if (song) {
        try {
          const response = await fetch(`/midi/${song.file}`);
          const arrayBuffer = await response.arrayBuffer();
          const parsedMidi = new Midi(arrayBuffer);
          loadMidi(parsedMidi);
        } catch (error) {
          console.error('Failed to load MIDI file:', error);
          // Handle error, e.g., show a message to the user
        }
      }
    }
  }, [setSelectedSong, setMidi, setEvents, loadMidi, setActualMidiDuration]); // Added setActualMidiDuration to dependencies

  return { loadMidi, handleSongSelection, availableSongs };
}
