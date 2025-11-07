import { useState } from 'react';
import { FaPlay, FaStop, FaChartBar, FaMusic, FaGamepad, FaTachometerAlt, FaWaveSquare, FaChevronDown, FaChevronUp, FaSync } from 'react-icons/fa';
import { synthPresets } from '../synth-presets.js';

const ADSRSlider = ({ name, value, onChange, min = 0, max = 1, step = 0.01 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%' }}>
    <label htmlFor={`${name}-range`} style={{ fontSize: '0.875rem', color: 'var(--fg)', textTransform: 'capitalize' }}>
      {name}: {Number(value).toFixed(2)}
    </label>
    <input
      id={`${name}-range`}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      style={{ width: '100%', height: '0.5rem', backgroundColor: 'var(--black-key)', borderRadius: '0.5rem', appearance: 'none', cursor: 'pointer', accentColor: 'var(--accent)' }}
    />
  </div>
);

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
  selectedSynthPreset,
  setSelectedSynthPreset,
  adsr,
    setAdsr,
    resetScore,
  }) {
    const [isAdsrVisible, setIsAdsrVisible] = useState(false);
  
    const handleAdsrChange = (param) => (e) => {
      setAdsr(prev => ({ ...prev, [param]: parseFloat(e.target.value) }));
    };
  
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row', // Default to row for horizontal layout
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '1.5rem', // Equivalent to gap-x-6 and gap-y-6
        padding: '1rem',
        backgroundColor: 'var(--controls-bg)',
        borderRadius: '0.75rem', // rounded-xl
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-lg
        fontFamily: 'Poppins, sans-serif',
      }}>
        {/* Song Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px', flexGrow: 1 }}>
          <label htmlFor="song-select" style={{ display: 'flex', alignItems: 'center', fontSize: '1.125rem', fontWeight: '600', color: 'var(--fg)' }}>
            <FaMusic style={{ color: 'var(--accent)', marginRight: '0.5rem' }} /> Canción:
          </label>
          <select
            style={{ backgroundColor: 'var(--black-key)', color: 'var(--select-fg)', padding: '0.75rem', borderRadius: '0.375rem', outline: 'none', borderWidth: '2px', borderColor: 'transparent', fontFamily: 'inherit' }}
            value={selectedSong}
            onChange={e => handleSongSelection(e.target.value)}
          >
            {Object.keys(midiLibrary).map(songKey => (
              <option key={songKey} value={songKey}>{midiLibrary[songKey].tracks[0].name || songKey}</option>
            ))}
            <option value="custom">Subir MIDI propio</option>
          </select>
          {selectedSong === 'custom' && (
            <input
              type="file"
              accept=".mid,.midi"
              style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#d1d5db', fontFamily: 'inherit' }}
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
                    style={{ backgroundColor: 'var(--black-key)', color: 'var(--select-fg)', padding: '0.75rem', borderRadius: '0.375rem', outline: 'none', borderWidth: '2px', borderColor: 'transparent', fontFamily: 'inherit' }}
                    value={mode}
                    onChange={e => setMode(e.target.value)}
                  >            <option value="step">Paso a paso</option>
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
            style={{ width: '100%', height: '0.5rem', backgroundColor: 'var(--black-key)', borderRadius: '0.5rem', appearance: 'none', cursor: 'pointer', accentColor: 'var(--accent)' }}
          />
          <span style={{ fontSize: '0.875rem', color: 'var(--fg)' }}>{Math.round(tempoFactor * 100)}%</span>
        </div>
  
        {/* Synth Selection & ADSR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '200px', flexGrow: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="synth-select" style={{ display: 'flex', alignItems: 'center', fontSize: '1.125rem', fontWeight: '600', color: 'var(--fg)' }}>
              <FaMusic style={{ color: 'var(--accent)', marginRight: '0.5rem' }} /> Sonido:
            </label>
            <select
              id="synth-select"
              style={{ backgroundColor: 'var(--black-key)', color: 'var(--select-fg)', padding: '0.75rem', borderRadius: '0.375rem', outline: 'none', borderWidth: '2px', borderColor: 'transparent', fontFamily: 'inherit' }}
              value={selectedSynthPreset}
              onChange={e => setSelectedSynthPreset(e.target.value)}
            >
              {Object.keys(synthPresets).map(presetKey => (
                <option key={presetKey} value={presetKey}>{synthPresets[presetKey].name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={() => setIsAdsrVisible(!isAdsrVisible)} style={{ background: 'none', border: 'none', color: 'var(--fg)', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '1.125rem', fontWeight: '600', padding: 0 }}>
                <FaWaveSquare style={{ color: 'var(--accent)', marginRight: '0.5rem' }} /> Envolvente (ADSR)
                {isAdsrVisible ? <FaChevronUp style={{ marginLeft: '0.5rem' }} /> : <FaChevronDown style={{ marginLeft: '0.5rem' }} />}
              </button>
              {isAdsrVisible && (
                <>
                  <ADSRSlider name="attack" value={adsr.attack} onChange={handleAdsrChange('attack')} max={2} />
                  <ADSRSlider name="decay" value={adsr.decay} onChange={handleAdsrChange('decay')} max={2} />
                  <ADSRSlider name="sustain" value={adsr.sustain} onChange={handleAdsrChange('sustain')} max={1} />
                  <ADSRSlider name="release" value={adsr.release} onChange={handleAdsrChange('release')} max={5} />
                </>
              )}
          </div>
        </div>
  
        {/* Playback Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem', minWidth: '200px', flexGrow: 1 }}>
                  <button
                    onClick={() => startPlayback()}
                    disabled={isPlaying || !midi}
                    title="Reproducir"
                    style={{ color: 'var(--accent)', padding: '0.75rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', transitionProperty: 'all', transitionDuration: '200ms', opacity: (isPlaying || !midi) ? 0.5 : 1, cursor: (isPlaying || !midi) ? 'not-allowed' : 'pointer', background: 'none', border: '1px solid var(--accent)', '&:hover': { backgroundColor: 'var(--accent)', color: 'var(--bg)' } }}
                  >
                    <FaPlay />
                  </button>
                  <button
                    onClick={() => stopPlayback()}
                    disabled={!isPlaying}
                    title="Detener"
                    style={{ color: 'var(--fg)', padding: '0.75rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', transitionProperty: 'all', transitionDuration: '200ms', background: 'none', border: '1px solid var(--fg)', opacity: !isPlaying ? 0.5 : 1, cursor: !isPlaying ? 'not-allowed' : 'pointer', '&:hover': { backgroundColor: 'var(--fg)', color: 'var(--bg)' } }}
                  >
                    <FaStop />
                  </button>
                  <button
                    onClick={() => showResults()}
                    title="Mostrar Resultados"
                    style={{ color: 'var(--accent)', padding: '0.75rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', transitionProperty: 'all', transitionDuration: '200ms', background: 'none', border: '1px solid var(--accent)', '&:hover': { backgroundColor: 'var(--accent)', color: 'var(--bg)' } }}
                  >
                    <FaChartBar />
                  </button>
                  <button
                    onClick={() => resetScore()}
                    title="Reiniciar Puntuación"
                    style={{ color: 'var(--accent)', padding: '0.75rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', transitionProperty: 'all', transitionDuration: '200ms', background: 'none', border: '1px solid var(--accent)', '&:hover': { backgroundColor: 'var(--accent)', color: 'var(--bg)' } }}
                  >
                    <FaSync />
                  </button>        </div>
      </div>
    );
  }
  