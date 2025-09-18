import React from 'react';

export default function Score({ score, combo, hits, misses }) {
  return (
    <div className="mt-4 text-xl flex items-center gap-4">
      <span className="mr-4">🎯 <strong>Puntuación:</strong> {score}</span>
      <span className="mr-4">🔥 <strong>Combo:</strong> {combo}</span>
      <span className="mr-4">✅ <strong>Aciertos:</strong> {hits}</span>
      <span>❌ <strong>Fallos:</strong> {misses}</span>
    </div>
  );
}
