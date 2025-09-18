'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';
import { midiLibrary } from './midi-library.js';
import Keyboard from './ui/Keyboard.js';
import Controls from './ui/Controls.js';
import Score from './ui/Score.js';
import FallingNotesCanvas from './ui/FallingNotesCanvas.js';
import { themes } from './ui/themes.js';
import { synthPresets } from './synth-presets.js';

// --- Utility helpers ---
const MIDI_TO_NOTE = (midi) => {
  const names = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const name = names[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
};

// --- Main component ---
export default function PianoTeacherApp(){
  const [midiAccess, setMidiAccess] = useState(null);
  const [connectedInputs, setConnectedInputs] = useState([]);
  const [midiError, setMidiError] = useState(null);
  const [mode, setMode] = useState('step');
  const [midi, setMidi] = useState(null);
  const [events, setEvents] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempoFactor, setTempoFactor] = useState(1);
  const [synth, setSynth] = useState(null);
  const [selectedSong, setSelectedSong] = useState('custom');
  const [theme, setTheme] = useState('default');
  const [isClient, setIsClient] = useState(false); // New state for client-side rendering
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [countdownValue, setCountdownValue] = useState(null); // null, 3, 2, 1, 'Go!'
  const [selectedSynthPreset, setSelectedSynthPreset] = useState('default');

  useEffect(() => {
    setIsClient(true); // Set to true after component mounts on client
  }, []);

  // Scoring
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);

  const canvasRef = useRef(null);
  const keyboardRef = useRef(null);
  const keyRefs = useRef([]);
  const keyPositionsRef = useRef({});
  const fallingReqRef = useRef(null);
  const fallingNotesRef = useRef([]);
  const expectedNoteRef = useRef(null);
  const lastNoteTimeRef = useRef(null);

  const firstMidi = 48; // C3
  const lastMidi = 72;  // C5
  const keys = Array.from({ length: lastMidi - firstMidi + 1 }, (_, i) => {
    const midi = firstMidi + i;
    return { midi, note: MIDI_TO_NOTE(midi) };
  });

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(ma => {
        setMidiAccess(ma);
        const inputs = Array.from(ma.inputs.values());
        setConnectedInputs(inputs);
        ma.onstatechange = () => setConnectedInputs(Array.from(ma.inputs.values()));
      }).catch(e => {
        console.warn('MIDI not available', e);
        setMidiError('MIDI not available. Please use a compatible browser (Chrome, Edge) and grant permission.');
      });
    } else {
      setMidiError('Web MIDI API is not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    const preset = synthPresets[selectedSynthPreset];
    const newSynth = new Tone.PolySynth(Tone.Synth, preset.options).toDestination();
    setSynth(newSynth);

    return () => {
      if (newSynth) {
        newSynth.dispose();
      }
    };
  }, [selectedSynthPreset]);

  useEffect(() => {
    const keyboardElement = keyboardRef.current;
    const canvas = canvasRef.current;
    if (!keyboardElement || !canvas) return;

    const resizeObserver = new ResizeObserver(() => {
        const keyboardRect = keyboardElement.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect(); // Get canvas position
        canvas.width = keyboardRect.width;
        const positions = {};
        keys.forEach((k) => {
            const keyElement = keyRefs.current[k.midi];
            if (keyElement) {
                const keyRect = keyElement.getBoundingClientRect();
                positions[k.midi] = keyRect.left - canvasRect.left + keyRect.width / 2;
            }
        });
        keyPositionsRef.current = positions;
    });

    resizeObserver.observe(keyboardElement);

    return () => resizeObserver.disconnect();

  }, [keys]);

  const fallingNoteColorRef = useRef('#7c3aed'); // Default to accent color

  useEffect(() => {
    const newTheme = themes[theme];
    if (newTheme) {
      for (const [key, value] of Object.entries(newTheme.colors)) {
        document.documentElement.style.setProperty(key, value);
      }
      // Get the computed value of --note-color for canvas drawing
      const computedNoteColor = getComputedStyle(document.documentElement).getPropertyValue('--note-color').trim();
      if (computedNoteColor) {
        fallingNoteColorRef.current = computedNoteColor;
      }
    }
  }, [theme]);

  async function loadMidi(fileOrMidi) {
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
    setScore(0); setHits(0); setMisses(0); setCombo(0); setMaxCombo(0); setReactionTimes([]);
  }

  function handleSongSelection(songKey) {
    setSelectedSong(songKey);
    if (songKey === 'custom') {
      setMidi(null);
      setEvents([]);
    } else {
      const midiData = midiLibrary[songKey]();
      loadMidi(midiData);
    }
  }

  const playMidi = useCallback(async (midiNote) => {
    if (!synth) return;
    if (typeof midiNote !== 'number') return;
    await Tone.start(); // Ensure audio context is started
    const noteName = MIDI_TO_NOTE(midiNote);
    try {
      synth.triggerAttackRelease(noteName, '0.1'); // Use triggerAttackRelease with short duration
    } catch (e) { console.warn('play error', e); }
  }, [synth]);

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
  }, [events, currentIdx, mode, synth, combo, lastNoteTimeRef, expectedNoteRef, fallingNotesRef, setHits, setScore, setCombo, setMaxCombo, setReactionTimes, setMisses, playMidi]);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let last = performance.now();
    const speed = 0.12;

    function loop(now) {
      const dt = now - last; last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fnotes = Array.isArray(fallingNotesRef.current) ? fallingNotesRef.current : [];
      for (let i = 0; i < fnotes.length; i++) {
        const fn = fnotes[i];
        if (!fn) continue;
        if (typeof fn.y !== 'number') fn.y = -20;
        fn.y += dt * speed * (1 / tempoFactor);
        try {
          ctx.fillStyle = fallingNoteColorRef.current;
          const drawX = (typeof fn.x === 'number') ? fn.x : 0;
          const noteHeight = (typeof fn.duration === 'number') ? fn.duration * 100 : 12; // Scale duration to height
          ctx.fillRect(drawX - 18, fn.y - noteHeight, 36, noteHeight);
        } catch (e) { /* drawing error - skip */ }
      }
      fallingNotesRef.current = fnotes.filter(fn => fn && typeof fn.y === 'number' && fn.y < canvas.height + 50);
      fallingReqRef.current = requestAnimationFrame(loop);
    }
    fallingReqRef.current = requestAnimationFrame(loop);
    return () => {
      if (fallingReqRef.current) cancelAnimationFrame(fallingReqRef.current);
    };
  }, [tempoFactor]);

  async function _startTonePlayback() {
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
  }

  async function startPlayback() {
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
    } else {
      _startTonePlayback(); // For other modes, start immediately
    }
  }

  function stopPlayback() {
    Tone.Transport.stop();
    setIsPlaying(false);
    fallingNotesRef.current = [];
  }

  function showResults() {
    const total = hits + misses;
    const accuracy = (total === 0) ? 0 : Math.round((hits / total) * 100);
    const avgReaction = reactionTimes.length ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0;
    alert(`Resultados:\nPuntuación: ${score}\nPrecisión: ${accuracy}%\nHits: ${hits}\nMisses: ${misses}\nCombo max: ${maxCombo}\nTiempo reacción medio: ${avgReaction}ms`);
  }

  return (
    <>
      {countdownValue && (
        <div className="fixed w-screen h-screen flex items-center justify-center z-[100]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
          <span className="text-[200px] font-bold text-white animate-ping">{countdownValue}</span>
        </div>
      )}
      <div className="bg-bg text-fg min-h-screen p-4 flex flex-col items-center">
        <div className="w-full flex justify-between items-start mb-4"> {/* Main header flex container */}
        <h1 className="text-2xl" style={{ color: theme === 'light' ? '#0f172a' : 'var(--fg)' }}>Piano Teacher</h1> {/* Title on the left, color adjusted for light theme */}
        
        {/* MIDI Status on the far right */}
        <div className="text-sm text-right">
          <strong>MIDI Status:</strong>
          {midiError ? (
            <span className="text-red-500"> {midiError}</span>
          ) : connectedInputs.length > 0 ? (
            <span className="text-green-500"> {connectedInputs[0].name}</span>
          ) : (
            <span> No MIDI device detected.</span>
          )}
        </div>
      </div>

      {/* Controls component below the header, spanning full width */}
      <Controls
        selectedSong={selectedSong}
        handleSongSelection={handleSongSelection}
        midiLibrary={midiLibrary}
        loadMidi={loadMidi}
        mode={mode}
        setMode={setMode}
        tempoFactor={tempoFactor}
        setTempoFactor={setTempoFactor}
        startPlayback={startPlayback}
        stopPlayback={stopPlayback}
        showResults={showResults}
        isPlaying={isPlaying}
        midi={midi}
        theme={theme}
        setTheme={setTheme}
        selectedSynthPreset={selectedSynthPreset}
        setSelectedSynthPreset={setSelectedSynthPreset}
        className="mb-4" 
      /> {/* Added mb-4 for bottom margin */}

        <FallingNotesCanvas canvasRef={canvasRef} height={220} />

        {isClient && (() => {
          
          return (
            <Keyboard
              keys={keys}
              events={events}
              currentIdx={currentIdx}
              mode={mode}
              keyRefs={keyRefs}
              keyboardRef={keyboardRef}
              pressedKeys={pressedKeys}
            />
          );
        })()}

        <Score score={score} combo={combo} hits={hits} misses={misses} />

        <div className="mt-4">
          <small>Nota: este es un prototipo. Para mejorar: sincronizar tiempos MIDI reales, dibujar teclas negras sobre blancas correctamente (layout), mejores animaciones, persistencia de ranking, y tests de latencia.</small>
        </div>
      </div>
    </>
  );
}