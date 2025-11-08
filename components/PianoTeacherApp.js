'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import CountdownOverlay from './ui/CountdownOverlay.js';
import Controls from './ui/Controls.js';
import FallingNotesCanvas from './ui/FallingNotesCanvas.js';
import Header from './ui/Header.js';
import Keyboard from './ui/Keyboard.js';
import { useFallingNotesAnimation } from '../hooks/useFallingNotesAnimation.js';
import { useIsClient } from '../hooks/useIsClient.js';
import { useKeyboardCanvasSync } from '../hooks/useKeyboardCanvasSync.js';
import { useMidi } from '../hooks/useMidi.js';
import { useMidiInputHandler } from '../hooks/useMidiInputHandler.js';
import { useMidiLoader } from '../hooks/useMidiLoader.js';
import { useNoteInputHandler } from '../hooks/useNoteInputHandler.js';
import { usePianoTeacherRefs } from '../hooks/usePianoTeacherRefs.js';
import { usePianoTeacherState } from '../hooks/usePianoTeacherState.js';
import { usePlayback } from '../hooks/usePlayback.js';
import { useScoring } from '../hooks/useScoring.js';
import { useSynth } from '../hooks/useSynth.js';
import { useTheme } from '../hooks/useTheme.js';
import { getKeyboardConfig } from '../utils/midiUtils.js';
import ResultsPopup from './ui/ResultsPopup.js';
import GuidePopup from './ui/GuidePopup.js';
import ClickToStart from './ui/ClickToStart.js';
// --- Main component ---
export default function PianoTeacherApp(){
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const handleStartAudio = async () => {


    await Tone.start();
    setIsAudioStarted(true);

  };
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
    actualMidiDuration, setActualMidiDuration,
    isAutoPlaying, setIsAutoPlaying,
  } = usePianoTeacherState();
  const {
    canvasRef,
    keyboardRef,
    keyRefs,
    keyPositionsRef,
    fallingReqRef,
    lastNoteTimeRef,
  } = usePianoTeacherRefs();
  const [isMidiFinished, setIsMidiFinished] = useState(false);
  const [activeFallingNotesCount, setActiveFallingNotesCount] = useState(0);
  const [fallingNotes, setFallingNotes] = useState([]); // New state for falling notes
  const [isClient, setIsClient] = useState(false);
  useIsClient(setIsClient);
  // Derived state and related hooks
  const synth = useSynth(selectedSynthPreset, adsr);
  const { setScore, setHits, setMisses, combo, setCombo, setMaxCombo, setReactionTimes, resetScore, showResults, isResultsVisible, hideResults, results } = useScoring();

  useEffect(() => {
    if (isMidiFinished && activeFallingNotesCount === 0) {
      showResults();
      setIsMidiFinished(false); // Reset for next playback
    }
  }, [isMidiFinished, activeFallingNotesCount, showResults]);

  const fallingNoteColorRef = useRef('#7c3aed');
  useTheme(theme, fallingNoteColorRef);
  const { keys } = getKeyboardConfig();
  useKeyboardCanvasSync(keyboardRef, canvasRef, keys, keyRefs, keyPositionsRef);
  // Action-related hooks
  const { loadMidi, handleSongSelection, availableSongs } = useMidiLoader(setMidi, setEvents, setCurrentIdx, resetScore, setSelectedSong, setActualMidiDuration);
  const { handleUserNoteOn } = useNoteInputHandler(
    events,
    currentIdx,
    mode,
    synth,
    combo,
    lastNoteTimeRef,
    fallingNotes,
    setFallingNotes,
    setActiveFallingNotesCount,
    setHits,
    setScore,
    setCombo,
    setMaxCombo,
    setReactionTimes,
    setMisses,
    setCurrentIdx,
    294,
    60
  );


  useMidiInputHandler(midiAccess, setPressedKeys, handleUserNoteOn);
  useFallingNotesAnimation(canvasRef, fallingNotes, setActiveFallingNotesCount, fallingReqRef, tempoFactor, fallingNoteColorRef, 294, 60);
  const { startPlayback, stopPlayback } = usePlayback(
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
    actualMidiDuration, // New prop
    isAutoPlaying,
    setPressedKeys,
  );

  const stopPlaybackAndAutoPlay = useCallback(() => {
    stopPlayback();
    setIsAutoPlaying(false);
  }, [stopPlayback, setIsAutoPlaying]);

  const restartSong = useCallback(() => {
    stopPlayback();
    setCurrentIdx(0); // Reset MIDI to beginning
    resetScore(); // Reset scoring
  }, [stopPlayback, setCurrentIdx, resetScore]);

  useEffect(() => {
    if (selectedSong && selectedSong !== 'custom') {
      handleSongSelection(selectedSong);
    }
  }, [selectedSong, handleSongSelection]);

  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const showGuide = () => setIsGuideVisible(true);
  const hideGuide = () => setIsGuideVisible(false);
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
        radial-gradient(circle at 50% 60%, rgba(124,58,237,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
      `
      : `
        linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        radial-gradient(circle at 50% 60%, rgba(124,58,237,0.1) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
      `,
    backgroundSize: "40px 40px, 40px 40px, 100% 100%",
    gap: '2rem',
  };
  const mainAppRef = useRef(null);

  useEffect(() => {
    if (isAutoPlaying && midi && !isPlaying) {
      startPlayback();
    } else if (!isAutoPlaying && isPlaying) {
      stopPlayback();
    }
  }, [isAutoPlaying, midi, isPlaying, startPlayback, stopPlayback]);

  const onToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mainAppRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <>
      {!isAudioStarted && <ClickToStart onStart={handleStartAudio} />}
      <div ref={mainAppRef} className="bg-bg text-fg min-h-screen p-4 flex flex-col items-center" style={mainContainerStyle}>
        <CountdownOverlay countdownValue={countdownValue} />
        <div style={pianoContainerStyle} className={`rounded-lg shadow-lg`}>
        <div style={{ padding: '10px' }}>
          <Header theme={theme} setTheme={setTheme} midiError={midiError} connectedInputs={connectedInputs} onGuideClick={showGuide} onToggleFullscreen={onToggleFullscreen} />
          {/* Controls component below the header, spanning full width */}
          <Controls
            selectedSong={selectedSong}
            handleSongSelection={handleSongSelection}
            availableSongs={availableSongs}
            loadMidi={loadMidi}
            mode={mode}
            setMode={setMode}
            tempoFactor={tempoFactor}
            setTempoFactor={setTempoFactor}
            startPlayback={startPlayback}
            restartSong={restartSong} // New prop
            showResults={showResults}
            isPlaying={isPlaying}
            midi={midi}
            theme={theme}
            setTheme={setTheme}
            selectedSynthPreset={selectedSynthPreset}
            setSelectedSynthPreset={setSelectedSynthPreset}
            adsr={adsr}
            setAdsr={setAdsr}
            isAutoPlaying={isAutoPlaying}
            setIsAutoPlaying={setIsAutoPlaying}
            resetScore={resetScore}
            stopPlayback={stopPlaybackAndAutoPlay} // Use the new function
            className="mb-4" 
          /> {/* Added mb-4 for bottom margin */}
          {mode === 'fall' && <FallingNotesCanvas canvasRef={canvasRef} height={354} />}
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
                isAutoPlaying={isAutoPlaying}
              />
            </div>
          )}
        </div>
      </div>
        <footer style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--fg)' }}>
          <p>
            Website By <a href="https://mendiak.github.io/portfolio/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Mikel Aramendia</a> | &copy; {new Date().getFullYear()} Piano Teacher App
          </p>
        </footer>
        {isResultsVisible && <ResultsPopup results={results} onClose={hideResults} />}
        {isGuideVisible && <GuidePopup hideGuide={hideGuide} />}
      </div>
    </>
  );
}

