'use client';

import React, { useRef, useState } from 'react';

import CountdownOverlay from './ui/CountdownOverlay.js';
import Controls from './ui/Controls.js';
import FallingNotesCanvas from './ui/FallingNotesCanvas.js';
import Header from './ui/Header.js';
import Keyboard from './ui/Keyboard.js';
import Score from './ui/Score.js';

import { useFallingNotesAnimation } from '../hooks/useFallingNotesAnimation.js';
import { useIsClient } from '../hooks/useIsClient.js';
import { useKeyboardCanvasSync } from '../hooks/useKeyboardCanvasSync.js';
import { useMidi } from '../hooks/useMidi.js';
import { useMidiInputHandler } from '../hooks/useMidiInputHandler.js';
import { useMidiLoader } from '../hooks/useMidiLoader.js';
import { useMidiPlayer } from '../hooks/useMidiPlayer.js';
import { useNoteInputHandler } from '../hooks/useNoteInputHandler.js';
import { usePianoTeacherRefs } from '../hooks/usePianoTeacherRefs.js';
import { usePianoTeacherState } from '../hooks/usePianoTeacherState.js';
import { usePlayback } from '../hooks/usePlayback.js';
import { useScoring } from '../hooks/useScoring.js';
import { useSynth } from '../hooks/useSynth.js';
import { useTheme } from '../hooks/useTheme.js';

import { getKeyboardConfig } from '../utils/midiUtils.js';


// --- Main component ---
export default function PianoTeacherApp(){
  // Hooks for core functionalities
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
  const {
    canvasRef,
    keyboardRef,
    keyRefs,
    keyPositionsRef,
    fallingReqRef,
    fallingNotesRef,
    expectedNoteRef,
    lastNoteTimeRef,
  } = usePianoTeacherRefs();
  const [isClient, setIsClient] = useState(false);
  useIsClient(setIsClient);

  // Derived state and related hooks
  const synth = useSynth(selectedSynthPreset);
  // eslint-disable-next-line no-unused-vars
  const { score, setScore, hits, setHits, misses, setMisses, combo, setCombo, maxCombo, setMaxCombo, reactionTimes, setReactionTimes, resetScore, showResults } = useScoring();
  const fallingNoteColorRef = useRef('#7c3aed');
  useTheme(theme, fallingNoteColorRef);
  const { keys } = getKeyboardConfig();
  useKeyboardCanvasSync(keyboardRef, canvasRef, keys, keyRefs, keyPositionsRef);

  // Action-related hooks
  const { playMidi } = useMidiPlayer(synth);
  const { loadMidi, handleSongSelection, midiLibrary } = useMidiLoader(setMidi, setEvents, setCurrentIdx, resetScore, setSelectedSong);
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
        {isClient && (
          <Keyboard
            keys={keys}
            events={events}
            currentIdx={currentIdx}
            mode={mode}
            keyRefs={keyRefs}
            keyboardRef={keyboardRef}
            pressedKeys={pressedKeys}
          />
        )}
        <Score score={score} combo={combo} hits={hits} misses={misses} />
        <div className="mt-4">
          <small>Nota: este es un prototipo. Para mejorar: sincronizar tiempos MIDI reales, dibujar teclas negras sobre blancas correctamente (layout), mejores animaciones, persistencia de ranking, y tests de latencia.</small>
        </div>
      </div>
    </>
  );
}