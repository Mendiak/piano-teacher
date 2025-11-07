'use client';

import { FaSun, FaMoon, FaQuestionCircle } from 'react-icons/fa';

export default function Header({ theme, setTheme, midiError, connectedInputs, onGuideClick }) {
  return (
    <>
      <style>{`
        .midi-status {
          margin-right: 20px;
        }
      `}</style>
      <div className="w-full flex justify-between items-start mb-4"> {/* Main header flex container */}
        <h1 className="text-2xl" style={{ color: theme === 'light' ? '#0f172a' : 'var(--fg)' }}>Piano Teacher</h1> {/* Title on the left, color adjusted for light theme */}
        
        {/* MIDI Status and Theme Toggle on the far right */}
        <div className="flex items-center">
          <div className="text-sm text-right midi-status">
            <strong>MIDI Status:</strong>
            {midiError ? (
              <span className="text-red-500"> {midiError}</span>
            ) : connectedInputs.length > 0 ? (
              <span className="text-green-500"> {connectedInputs[0].name}</span>
            ) : (
              <span> No MIDI device detected.</span>
            )}
          </div>
          <button
            onClick={onGuideClick}
            title="Mostrar Guía"
            style={{
              backgroundColor: 'var(--controls-bg)',
              color: 'var(--fg)',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              outline: 'none',
              borderWidth: '2px',
              borderColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
              marginRight: '1rem',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <FaQuestionCircle size={18} />
          </button>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            style={{
              backgroundColor: 'var(--controls-bg)',
              color: 'var(--fg)',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              outline: 'none',
              borderWidth: '2px',
              borderColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {theme === 'light' ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>
        </div>
      </div>
    </>
  );
}
