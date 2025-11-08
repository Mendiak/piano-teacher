import React from 'react';

export default function FallingNotesCanvas({ canvasRef, height }) {

  return (
    <div className="relative bg-blue-950 mt-4" style={{ height: '354px' }}>
      <canvas ref={canvasRef} height={height} className="w-full" />
    </div>
  );
}