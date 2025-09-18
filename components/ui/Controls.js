import React from 'react';
import { FaPlay, FaStop, FaChartBar, FaMusic, FaGamepad, FaTachometerAlt, FaPalette } from 'react-icons/fa';
import { themes } from './themes.js';
import { synthPresets } from '../synth-presets.js';

export default function Controls({
  selectedSong,
  handleSongSelection,
  midiLibrary,
  loadMidi,
  mode,
  setMode,
  tempoFactor,
  setTempoFactor,
  startPlayback,
  stopPlayback,
  showResults,
  isPlaying,
  midi,
  theme,
  setTheme,
  selectedSynthPreset,
  setSelectedSynthPreset,
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row', // Default to row for horizontal layout
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: '1.5rem', // Equivalent to gap-x-6 and gap-y-6
      padding: '1rem',
      backgroundColor: '#1f2937', // bg-gray-800
      borderRadius: '0.75rem', // rounded-xl
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-lg
    }}>
      {/* Song Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px', flexGrow: 1 }}>
        <label htmlFor="song-select" style={{ display: 'flex', alignItems: 'center', fontSize: '1.125rem', fontWeight: '600', color: 'var(--fg)' }}>
          <FaMusic style={{ color: 'var(--accent)', marginRight: '0.5rem' }} /> Canción:
        </label>
        <select
          id="song-select"
          style={{ backgroundColor: '#374151', color: 'white', padding: '0.75rem', borderRadius: '0.375rem', outline: 'none', borderWidth: '2px', borderColor: 'transparent' }}
          value={selectedSong}
          onChange={e => handleSongSelection(e.target.value)}
        >
          {Object.keys(midiLibrary).map(songKey => (
            <option key={songKey} value={songKey}>{midiLibrary[songKey].name || songKey}</option>
          ))}
          <option value="custom">Subir MIDI propio</option>
        </select>
        {selectedSong === 'custom' && (
          <input
            type="file"
            accept=".mid,.midi"
            style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#d1d5db' }}
            onChange={e => { if (e.target.files.length) loadMidi(e.target.files[0]); }}
          />
        )}
      </div>

      {/* Mode Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px', flexGrow: 1 }}>
        <label htmlFor="mode-select" style={{ display: 'flex', alignItems: 'center', fontSize: '1.125rem', fontWeight: '600', color: 'var(--fg)' }}>
          <FaGamepad style={{ color: 'var(--accent)', marginRight: '0.5rem' }} /> Modo:
        </label>
        <select
          id="mode-select"
          style={{ backgroundColor: '#374151', color: 'white', padding: '0.75rem', borderRadius: '0.375rem', outline: 'none', borderWidth: '2px', borderColor: 'transparent' }}
          value={mode}
          onChange={e => setMode(e.target.value)}
        >
          <option value="step">Paso a paso</option>
          <option value="fall">Falling notes</option>
        </select>
      </div>

      {/* Tempo Control */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px', flexGrow: 1 }}>
        <label htmlFor="tempo-range" style={{ display: 'flex', alignItems: 'center', fontSize: '1.125rem', fontWeight: '600', color: 'var(--fg)' }}>
          <FaTachometerAlt style={{ color: 'var(--accent)', marginRight: '0.5rem' }} /> Tempo:
        </label>
        <input
          id="tempo-range"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={tempoFactor}
          onChange={e => setTempoFactor(parseFloat(e.target.value))}
          style={{ width: '100%', height: '0.5rem', backgroundColor: '#374151', borderRadius: '0.5rem', appearance: 'none', cursor: 'pointer', accentColor: 'var(--accent)' }}
        />
        <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{Math.round(tempoFactor * 100)}%</span>
      </div>

      {/* Theme Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px', flexGrow: 1 }}>
        <label htmlFor="theme-select" style={{ display: 'flex', alignItems: 'center', fontSize: '1.125rem', fontWeight: '600', color: 'var(--fg)' }}>
          <FaPalette style={{ color: 'var(--accent)', marginRight: '0.5rem' }} /> Tema:
        </label>
        <select
          id="theme-select"
          style={{ backgroundColor: '#374151', color: 'white', padding: '0.75rem', borderRadius: '0.375rem', outline: 'none', borderWidth: '2px', borderColor: 'transparent' }}
          value={theme}
          onChange={e => setTheme(e.target.value)}
        >
          {Object.keys(themes).map(themeKey => (
            <option key={themeKey} value={themeKey}>{themes[themeKey].name}</option>
          ))}
        </select>
      </div>

      {/* Synth Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px', flexGrow: 1 }}>
        <label htmlFor="synth-select" style={{ display: 'flex', alignItems: 'center', fontSize: '1.125rem', fontWeight: '600', color: 'var(--fg)' }}>
          <FaMusic style={{ color: 'var(--accent)', marginRight: '0.5rem' }} /> Sonido:
        </label>
        <select
          id="synth-select"
          style={{ backgroundColor: '#374151', color: 'white', padding: '0.75rem', borderRadius: '0.375rem', outline: 'none', borderWidth: '2px', borderColor: 'transparent' }}
          value={selectedSynthPreset}
          onChange={e => setSelectedSynthPreset(e.target.value)}
        >
          {Object.keys(synthPresets).map(presetKey => (
            <option key={presetKey} value={presetKey}>{synthPresets[presetKey].name}</option>
          ))}
        </select>
      </div>

      {/* Playback Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', minWidth: '200px', flexGrow: 1 }}>
        <button
          onClick={() => startPlayback()}
          disabled={isPlaying || !midi}
          style={{ backgroundColor: 'var(--accent)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', transitionProperty: 'background-color', transitionDuration: '200ms', opacity: (isPlaying || !midi) ? 0.5 : 1, cursor: (isPlaying || !midi) ? 'not-allowed' : 'pointer' }}
        >
          <FaPlay style={{ marginRight: '0.5rem' }} /> Play
        </button>
        <button
          onClick={() => stopPlayback()}
          disabled={!isPlaying}
          style={{ backgroundColor: '#4b5563', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', transitionProperty: 'background-color', transitionDuration: '200ms' }}
        >
          <FaStop style={{ marginRight: '0.5rem' }} /> Stop
        </button>
        <button
          onClick={() => showResults()}
          style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', transitionProperty: 'background-color', transitionDuration: '200ms' }}
        >
          <FaChartBar style={{ marginRight: '0.5rem' }} /> Resultados
        </button>
      </div>
    </div>
  );
}