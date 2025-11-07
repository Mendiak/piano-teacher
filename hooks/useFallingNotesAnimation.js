'use client';

import { useEffect } from 'react';

export function useFallingNotesAnimation(canvasRef, fallingNotesRef, fallingReqRef, tempoFactor, fallingNoteColorRef, targetZoneY, targetZoneHeight) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let last = performance.now();
    const speed = 0.12;

    function loop(now) {
      const dt = now - last; last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw target zone
      if (typeof targetZoneY === 'number' && typeof targetZoneHeight === 'number') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Semi-transparent black for better visibility in light mode
        ctx.fillRect(0, targetZoneY, canvas.width, targetZoneHeight);
      }

      const fnotes = Array.isArray(fallingNotesRef.current) ? fallingNotesRef.current : [];
      const flashDuration = 300; // milliseconds

      for (let i = 0; i < fnotes.length; i++) {
        const fn = fnotes[i];
        if (!fn) continue;

        // Handle hit notes for visual feedback and disappearance
        if (fn.hitStatus && fn.hitTime) {
          const timeSinceHit = now - fn.hitTime;
          if (timeSinceHit < flashDuration) {
            // Flash color
            ctx.fillStyle = fn.hitStatus === 'correct' ? 'rgba(0, 255, 0, 0.7)' : 'rgba(255, 0, 0, 0.7)';
          } else {
            // Note has finished flashing, mark for removal
            fn.remove = true;
            continue; // Skip drawing this note
          }
        } else {
          // Normal falling note color
          ctx.fillStyle = fallingNoteColorRef.current;
        }

        if (typeof fn.y !== 'number') fn.y = -20;
        fn.y += dt * speed * (1 / tempoFactor);
        try {
          const drawX = (typeof fn.x === 'number') ? fn.x : 0;
          const noteHeight = (typeof fn.duration === 'number') ? fn.duration * 100 : 12; // Scale duration to height
          ctx.fillRect(drawX - 18, fn.y - noteHeight, 36, noteHeight);
        } catch (e) { /* drawing error - skip */ }
      }
      fallingNotesRef.current = fnotes.filter(fn => fn && !fn.remove && typeof fn.y === 'number' && fn.y < canvas.height + 50);
      fallingReqRef.current = requestAnimationFrame(loop);
    }
    fallingReqRef.current = requestAnimationFrame(loop);
    return () => {
      if (fallingReqRef.current) cancelAnimationFrame(fallingReqRef.current);
    };
  }, [canvasRef, fallingNotesRef, fallingReqRef, tempoFactor, fallingNoteColorRef, targetZoneY, targetZoneHeight]);
}
