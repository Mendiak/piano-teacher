'use client';

import React from 'react';

export default function CountdownOverlay({ countdownValue }) {
  if (!countdownValue) return null;

  return (
    <div className="fixed w-screen h-screen flex items-center justify-center z-[100]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}>
      <span className="text-[200px] font-bold text-white animate-ping" style={{ color: 'white' }}>{countdownValue}</span>
    </div>
  );
}
