import React from 'react';

export default function FallingNotesCanvas({ canvasRef, height }) {
  return (
    <div className="relative h-56 bg-blue-950 mt-4">
      <canvas ref={canvasRef} height={height} className="w-full" />
    </div>
  );
}