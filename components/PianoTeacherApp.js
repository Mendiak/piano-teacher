'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';

import Keyboard from './ui/Keyboard.js';
import Controls from './ui/Controls.js';
import Score from './ui/Score.js';
import FallingNotesCanvas from './ui/FallingNotesCanvas.js';
import Header from './ui/Header.js';
import CountdownOverlay from './ui/CountdownOverlay.js';
import { useMidi } from '../hooks/useMidi.js';
import { useSynth } from '../hooks/useSynth.js';
import { useTheme } from '../hooks/useTheme.js';
import { useKeyboardCanvasSync } from '../hooks/useKeyboardCanvasSync.js';
import { useMidiInputHandler } from '../hooks/useMidiInputHandler.js';
import { useFallingNotesAnimation } from '../hooks/useFallingNotesAnimation.js';
import { useScoring } from '../hooks/useScoring.js';
import { usePlayback } from '../hooks/usePlayback.js';
import { useMidiLoader } from '../hooks/useMidiLoader.js';
import { useMidiPlayer } from '../hooks/useMidiPlayer.js';
import { useNoteInputHandler } from '../hooks/useNoteInputHandler.js';
import { useIsClient } from '../hooks/useIsClient.js';
import { usePianoTeacherState } from '../hooks/usePianoTeacherState.js';
import { usePianoTeacherRefs } from '../hooks/usePianoTeacherRefs.js';
import { MIDI_TO_NOTE, generateKeyboardKeys, getKeyboardConfig } from '../utils/midiUtils.js';


// --- Main component ---
export default function PianoTeacherApp(){
  const { midiAccess, connectedInputs, midiError } = useMidi();
  const {
    mode, setMode,
    midi, setMidi,
    events, setEvents,
    currentIdx, setCurrentIdx,
    isPlaying, setIsPlaying,
    tempoFactor, setTempoFactor,
    selectedSong, setSelectedSong,
    theme, setTheme,
    selectedSynthPreset, setSelectedSynthPreset,
    pressedKeys, setPressedKeys,
    countdownValue, setCountdownValue,
  } = usePianoTeacherState();

  const synth = useSynth(selectedSynthPreset);
  const { score, setScore, hits, setHits, misses, setMisses, combo, setCombo, maxCombo, setMaxCombo, reactionTimes, setReactionTimes, resetScore, showResults } = useScoring();

  const [isClient, setIsClient] = useState(false); // New state for client-side rendering
  useIsClient(setIsClient);

  const {
    canvasRef,
    keyboardRef,
    keyRefs,
    keyPositionsRef,
    fallingReqRef,
    fallingNotesRef,
    expectedNoteRef,
    lastNoteTimeRef,
  } = usePianoTeacherRefs();;




  const fallingNoteColorRef = useRef('#7c3aed'); // Default to accent color
  useTheme(theme, fallingNoteColorRef);

  const { firstMidi, lastMidi, keys } = getKeyboardConfig();
  useKeyboardCanvasSync(keyboardRef, canvasRef, keys, keyRefs, keyPositionsRef);

  const { loadMidi, handleSongSelection, midiLibrary } = useMidiLoader(setMidi, setEvents, setCurrentIdx, resetScore, setSelectedSong);
  const { playMidi } = useMidiPlayer(synth);
  const { handleUserNoteOn } = useNoteInputHandler(
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
  );



  useMidiInputHandler(midiAccess, setPressedKeys, handleUserNoteOn, playMidi);
  useFallingNotesAnimation(canvasRef, fallingNotesRef, fallingReqRef, tempoFactor, fallingNoteColorRef);
  const { startPlayback, stopPlayback } = usePlayback(
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
  );









  return (
    <>
      <CountdownOverlay countdownValue={countdownValue} />

      <div className="bg-bg text-fg min-h-screen p-4 flex flex-col items-center">


      <Header theme={theme} midiError={midiError} connectedInputs={connectedInputs} />

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