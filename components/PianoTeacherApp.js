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
    adsr, setAdsr,
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
  const synth = useSynth(selectedSynthPreset, adsr);
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

  const pianoContainerStyle = {
    backgroundColor: theme === 'light' ? '#e8e8e8' : '#3a3a3a'
  };

  const mainContainerStyle = {
    position: 'relative',
    backgroundColor: theme === 'light' ? 'white' : 'var(--bg)',
    backgroundImage: theme === 'light'
      ? `
        linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
        radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
      `
      : `
        linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        radial-gradient(circle at 50% 60%, rgba(236,72,153,0.1) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
      `,
    backgroundSize: "40px 40px, 40px 40px, 100% 100%",
  };

  return (
    <>
      <CountdownOverlay countdownValue={countdownValue} />
      <div className="bg-bg text-fg min-h-screen p-4 flex flex-col items-center" style={mainContainerStyle}>
        <div style={pianoContainerStyle} className={`rounded-lg shadow-lg`}>
        <div style={{ padding: '15px' }}>
          <Header theme={theme} setTheme={setTheme} midiError={midiError} connectedInputs={connectedInputs} />
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
            adsr={adsr}
            setAdsr={setAdsr}
            className="mb-4" 
          /> {/* Added mb-4 for bottom margin */}
          <FallingNotesCanvas canvasRef={canvasRef} height={220} />
          {isClient && (
            <div className="mb-8">
              <Keyboard
                keys={keys}
                events={events}
                currentIdx={currentIdx}
                mode={mode}
                keyRefs={keyRefs}
                keyboardRef={keyboardRef}
                pressedKeys={pressedKeys}
              />
            </div>
          )}
        </div>
      </div>
        <div style={{ height: '2rem' }}></div>
        <div>
          <Score score={score} combo={combo} hits={hits} misses={misses} />
        </div>
        <footer style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--fg)' }}>
          <p>
            Website By <a href="https://mendiak.github.io/portfolio/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Mikel Aramendia</a>
          </p>
          <p>&copy; {new Date().getFullYear()} Piano Teacher App</p>
        </footer>
      </div>
    </>
  );
}