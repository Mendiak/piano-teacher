'use client';

import { useEffect, useRef } from 'react';
import * as Tone from 'tone';

export function useFallingNotesAnimation(
  canvasRef, 
  events, 
  isPlaying, 
  tempoFactor, 
  fallingNoteColorRef, 
  keyPositionsRef,
  mode
) {
  const animationReqRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode !== 'fall') return;
    
    const ctx = canvas.getContext('2d');
    
    // Configuración visual
    // Pixels per second determines how fast the notes fall.
    const pixelsPerSecond = 180 * tempoFactor; 
    
    // hitZoneY is exactly where the bottom of the note should be at its start time.
    // It's at the bottom of the canvas.
    const hitZoneY = canvas.height; 
    
    // lookAheadTime: how many seconds worth of music we can see from y=0 to y=hitZoneY
    const lookAheadTime = canvas.height / pixelsPerSecond;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        const currentTime = Tone.Transport.seconds;

        if (events && events.length > 0) {
          for (let i = 0; i < events.length; i++) {
            const note = events[i];
            const noteStartTime = note.time;
            const noteEndTime = note.time + note.duration;

            // Visibility checks
            // 1. If the whole note (including tail) has passed the hitZone, stop drawing
            if (noteEndTime < currentTime) continue;
            
            // 2. If the start of the note is still above the top edge (y < 0)
            // Note is visible if it hits the hitZone within lookAheadTime from now
            if (noteStartTime > currentTime + lookAheadTime) continue;

            const x = keyPositionsRef.current[note.midi];
            if (x === undefined) continue;

            // Calculation:
            // Distance from hit zone = (time until note starts) * pixels/second
            const timeUntilHit = noteStartTime - currentTime;
            
            // yBase is the BOTTOM of the note rectangle (where the attack happens)
            const yBase = hitZoneY - (timeUntilHit * pixelsPerSecond);
            const noteHeight = note.duration * pixelsPerSecond;

            // The top of the rectangle is yBase - noteHeight
            const yTop = yBase - noteHeight;

            // Draw note body
            ctx.fillStyle = fallingNoteColorRef.current;
            ctx.fillRect(x - 14, yTop, 28, noteHeight);
            
            // Draw highlight/border
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x - 14, yTop, 28, noteHeight);
            
            // Shine effect on the leading edge (bottom)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(x - 14, yBase - 2, 28, 2);
          }
        }
      }

      // Draw the hit zone line at the very bottom
      ctx.strokeStyle = isPlaying ? 'rgba(124, 58, 237, 0.8)' : 'rgba(124, 58, 237, 0.3)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 2);
      ctx.lineTo(canvas.width, canvas.height - 2);
      ctx.stroke();

      animationReqRef.current = requestAnimationFrame(render);
    }

    animationReqRef.current = requestAnimationFrame(render);

    return () => {
      if (animationReqRef.current) {
        cancelAnimationFrame(animationReqRef.current);
      }
    };
  }, [canvasRef, isPlaying, tempoFactor, fallingNoteColorRef, keyPositionsRef, mode, events]);
}
