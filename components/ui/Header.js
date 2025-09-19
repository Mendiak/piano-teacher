'use client';

import React from 'react';

export default function Header({ theme, midiError, connectedInputs }) {
  return (
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
  );
}
