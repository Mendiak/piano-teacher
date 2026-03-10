'use client';

import { useState } from 'react';
import { 
  FaPlay, FaStop, FaChartBar, FaMusic, FaGamepad, 
  FaTachometerAlt, FaWaveSquare, FaChevronDown, 
  FaChevronUp, FaSync, FaKeyboard, FaMagic 
} from 'react-icons/fa';
import { synthPresets } from '../synth-presets.js';

const CompactControl = ({ icon: Icon, children, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '110px', flex: 1 }}>
    <span style={{ fontSize: '0.65rem', fontWeight: '700', opacity: 0.5, textTransform: 'uppercase', display: 'flex', alignItems: 'center', color: 'var(--fg)' }}>
      <Icon style={{ marginRight: '0.3rem' }} size={10} /> {label}
    </span>
    {children}
  </div>
);

const ActionGroup = ({ children, label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
    <span style={{ fontSize: '0.6rem', fontWeight: '700', opacity: 0.4, textTransform: 'uppercase', textAlign: 'center', color: 'var(--fg)' }}>
      {label}
    </span>
    <div style={{ 
      display: 'flex', 
      gap: '0.3rem', 
      backgroundColor: 'rgba(0,0,0,0.15)', 
      padding: '0.25rem', 
      borderRadius: '0.5rem',
      border: '1px solid rgba(255,255,255,0.05)'
    }}>
      {children}
    </div>
  </div>
);

export default function Controls({
  selectedSong,
  handleSongSelection,
  availableSongs,
  loadMidi,
  mode,
  setMode,
  tempoFactor,
  setTempoFactor,
  startPlayback,
  stopPlayback,
  restartSong,
  showResults,
  isPlaying,
  midi,
  selectedSynthPreset,
  setSelectedSynthPreset,
  adsr,
  setAdsr,
  isAutoPlaying,
  setIsAutoPlaying,
  octave,
  showKeyLabels,
  setShowKeyLabels,
  className
}) {
  const [isAdsrVisible, setIsAdsrVisible] = useState(false);

  const selectStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    color: 'var(--fg)',
    padding: '0.4rem 0.5rem',
    borderRadius: '0.4rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '0.85rem',
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
    fontFamily: 'inherit'
  };

  const actionBtnStyle = (active, color = 'var(--accent)') => ({
    padding: '0.5rem',
    borderRadius: '0.35rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: active ? color : 'transparent',
    color: active ? '#fff' : (color === 'var(--fg)' ? 'var(--fg)' : color),
    border: 'none',
    minWidth: '32px',
    height: '32px'
  });

  return (
    <div className={className} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      width: '100%',
      boxSizing: 'border-box',
      marginBottom: '1rem'
    }}>
      
      {/* Row 1: Main Configs and Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '1rem' }}>
        
        <CompactControl label="Canción" icon={FaMusic}>
          <select style={selectStyle} value={selectedSong || ''} onChange={e => handleSongSelection(e.target.value)}>
            {availableSongs.map(song => (
              <option key={song.name} value={song.name} style={{background: '#1e293b'}}>{song.name}</option>
            ))}
            <option value="custom" style={{background: '#1e293b'}}>📁 Subir MIDI...</option>
          </select>
        </CompactControl>

        <CompactControl label="Modo" icon={FaGamepad}>
          <select style={selectStyle} value={mode} onChange={e => setMode(e.target.value)}>
            <option value="step" style={{background: '#1e293b'}}>Paso a paso</option>
            <option value="fall" style={{background: '#1e293b'}}>Cascada</option>
          </select>
        </CompactControl>

        <CompactControl label={`Tempo: ${Math.round(tempoFactor * 100)}%`} icon={FaTachometerAlt}>
          <input
            type="range" min="0.5" max="2" step="0.1"
            value={tempoFactor}
            onChange={e => setTempoFactor(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)', height: '4px', cursor: 'pointer' }}
          />
        </CompactControl>

        <CompactControl label="Sonido" icon={FaMagic}>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <select style={{ ...selectStyle, minWidth: '90px' }} value={selectedSynthPreset} onChange={e => setSelectedSynthPreset(e.target.value)}>
              {Object.keys(synthPresets).map(presetKey => (
                <option key={presetKey} value={presetKey} style={{background: '#1e293b'}}>{synthPresets[presetKey].name}</option>
              ))}
            </select>
            <button 
              onClick={() => setIsAdsrVisible(!isAdsrVisible)} 
              title="Ajustar Envolvente (ADSR)"
              style={actionBtnStyle(isAdsrVisible)}
            >
              <FaWaveSquare size={12} />
            </button>
          </div>
        </CompactControl>

        {/* Action Groups */}
        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto', alignItems: 'flex-end' }}>
          
          <ActionGroup label="Reproducción">
            <button 
              onClick={() => startPlayback()} 
              disabled={isPlaying || !midi} 
              title="Reproducir canción (Enter)" 
              style={{ ...actionBtnStyle(false), backgroundColor: isPlaying ? 'transparent' : 'var(--accent)', color: '#fff', opacity: (isPlaying || !midi) ? 0.3 : 1 }}
            >
              <FaPlay size={12} />
            </button>
            <button 
              onClick={stopPlayback} 
              disabled={!isPlaying} 
              title="Detener reproducción (Esc)" 
              style={actionBtnStyle(false, '#ef4444')}
            >
              <FaStop size={12} />
            </button>
            <button 
              onClick={() => restartSong()} 
              title="Reiniciar desde el principio" 
              style={actionBtnStyle(false, 'var(--fg)')}
            >
              <FaSync size={12} />
            </button>
          </ActionGroup>

          <ActionGroup label="Herramientas">
            <button 
              onClick={() => setShowKeyLabels(!showKeyLabels)} 
              title={showKeyLabels ? "Ocultar letras en las teclas" : "Mostrar letras en las teclas"} 
              style={actionBtnStyle(showKeyLabels)}
            >
              <FaKeyboard size={12} />
            </button>
            <button 
              onClick={() => setIsAutoPlaying(!isAutoPlaying)} 
              title={isAutoPlaying ? "Desactivar modo demostración" : "Activar modo demostración (Auto-Play)"} 
              style={actionBtnStyle(isAutoPlaying, '#10b981')}
            >
              <FaMagic size={12} />
            </button>
            <button 
              onClick={() => showResults()} 
              title="Ver estadísticas de la sesión" 
              style={actionBtnStyle(false, 'var(--fg)')}
            >
              <FaChartBar size={12} />
            </button>
          </ActionGroup>

        </div>
      </div>

      {/* Row 2: ADSR & Octave Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: '800', backgroundColor: 'rgba(124, 58, 237, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
            OCTAVA: {octave}
          </span>
          <span style={{ fontSize: '0.6rem', opacity: 0.4, color: 'var(--fg)' }}>Usa Z / X para moverte por el piano</span>
        </div>

        {isAdsrVisible && (
          <div style={{ flex: 1, display: 'flex', gap: '1rem', padding: '0.4rem 0.75rem', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            {['attack', 'decay', 'sustain', 'release'].map(param => (
              <div key={param} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', opacity: 0.6, color: 'var(--fg)' }}>
                  <span style={{ textTransform: 'capitalize' }}>{param.substring(0,3)}</span>
                  <span>{adsr[param].toFixed(1)}</span>
                </div>
                <input
                  type="range" min="0" max={param === 'release' ? 5 : (param === 'sustain' ? 1 : 2)} step="0.1"
                  value={adsr[param]}
                  onChange={e => setAdsr(prev => ({ ...prev, [param]: parseFloat(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--accent)', height: '2px', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
