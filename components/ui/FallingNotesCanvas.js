'use client';

import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';

export default function FallingNotesCanvas({ 
  canvasRef,
  events, 
  isPlaying, 
  tempoFactor, 
  theme, 
  keyPositionsRef, 
  mode,
  keys 
}) {
  const requestRef = useRef();
  // Referencia para sincronizar datos con el bucle sin reiniciar el efecto
  const stateRef = useRef({ events, isPlaying, tempoFactor, theme, keyPositionsRef, keys });

  // Actualizar la referencia de estado en cada render de React
  useEffect(() => {
    stateRef.current = { events, isPlaying, tempoFactor, theme, keyPositionsRef, keys };
  }, [events, isPlaying, tempoFactor, theme, keyPositionsRef, keys]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode !== 'fall') return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      // Extraemos los datos actuales de la referencia (sin depender del render de React)
      const { events: currentEvents, isPlaying: currentIsPlaying, tempoFactor: currentTempo, keyPositionsRef: currentPosRef, keys: currentKeys } = stateRef.current;

      // 1. LIMPIEZA TOTAL DEL FRAME
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 2. FONDO BASE
      ctx.fillStyle = '#0a1229'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pixelsPerSecond = 160 * currentTempo;
      const hitZoneY = canvas.height;
      const lookAheadTime = canvas.height / pixelsPerSecond;

      // 3. DIBUJAR CARRILES (Fondo estático)
      if (currentKeys) {
        currentKeys.forEach(key => {
          const isBlack = key.note.includes('#');
          let x = currentPosRef.current[key.midi];
          
          if (x === undefined) {
             const firstMidi = currentKeys[0].midi;
             const lastMidi = currentKeys[currentKeys.length - 1].midi;
             x = ((key.midi - firstMidi) / (lastMidi - firstMidi)) * canvas.width;
          }

          ctx.fillStyle = isBlack ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.08)';
          ctx.fillRect(x - 14, 0, 28, canvas.height);
          
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x - 14, 0, 28, canvas.height);
        });
      }

      // 4. DIBUJAR NOTAS (Si está reproduciendo)
      if (currentIsPlaying && currentEvents && currentEvents.length > 0) {
        const currentTime = Tone.Transport.seconds;

        currentEvents.forEach(note => {
          const noteStartTime = note.time;
          const noteEndTime = note.time + note.duration;

          if (noteEndTime < currentTime || noteStartTime > currentTime + lookAheadTime) return;

          let x = currentPosRef.current[note.midi];
          if (x === undefined && currentKeys) {
            const firstMidi = currentKeys[0].midi;
            const lastMidi = currentKeys[currentKeys.length - 1].midi;
            x = ((note.midi - firstMidi) / (lastMidi - firstMidi)) * canvas.width;
          }

          if (x === undefined) return;

          const timeUntilHit = noteStartTime - currentTime;
          const yBase = hitZoneY - (timeUntilHit * pixelsPerSecond);
          const noteHeight = Math.max(12, note.duration * pixelsPerSecond);
          const yTop = yBase - noteHeight;

          // Dibujo de la nota con estilo Neón
          ctx.save();
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#8b5cf6';
          
          const gradient = ctx.createLinearGradient(x - 13, yTop, x - 13, yBase);
          gradient.addColorStop(0, '#ddd6fe'); 
          gradient.addColorStop(0.5, '#8b5cf6'); 
          gradient.addColorStop(1, '#a78bfa'); 
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x - 13, yTop, 26, noteHeight);
          
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x - 13, yTop, 26, noteHeight);
          
          // Brillo de impacto
          if (Math.abs(timeUntilHit) < 0.04) {
             ctx.fillStyle = '#fff';
             ctx.shadowBlur = 25;
             ctx.shadowColor = '#fff';
             ctx.fillRect(x - 20, yBase - 4, 40, 8);
          }
          ctx.restore();
        });
      }

      // 5. LÍNEA DE META (Hit Zone)
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#7c3aed';
      ctx.fillStyle = '#7c3aed';
      ctx.fillRect(0, canvas.height - 4, canvas.width, 4);
      ctx.shadowBlur = 0;

      requestRef.current = requestAnimationFrame(render);
    };

    // Lanzar el bucle UNA SOLA VEZ
    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // No añadimos dependencias de props para que el useEffect NO se reinicie nunca
  }, [canvasRef, mode]); 

  return (
    <div className="relative overflow-hidden rounded-t-xl mt-4 border-2 border-white/10 shadow-2xl" 
         style={{ height: '354px', backgroundColor: '#0a1229' }}>
      <canvas 
        ref={canvasRef} 
        width={1000} 
        height={354} 
        className="w-full h-full block"
      />
    </div>
  );
}
