import React from 'react';

export default function ResultsPopup({ score, accuracy, hits, misses, maxCombo, avgReaction, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--fg)',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        textAlign: 'center',
        maxWidth: '90vw',
        width: '400px',
      }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '1.5rem' }}>
          ¡Resultados! 🎹
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <p><strong>Puntuación:</strong> {score} 🏆</p>
            <p><strong>Precisión:</strong> {accuracy}% 🎯</p>
            <p><strong>Hits:</strong> {hits} ✅</p>
          </div>
          <div style={{ textAlign: 'left' }}>
            <p><strong>Misses:</strong> {misses} ❌</p>
            <p><strong>Combo max:</strong> {maxCombo} 🔥</p>
            <p><strong>Reacción:</strong> {avgReaction}ms ⚡️</p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'var(--accent)',
            color: 'var(--fg)',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
