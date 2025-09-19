'use client';

import { useEffect } from 'react';

export function useFallingNotesAnimation(canvasRef, fallingNotesRef, fallingReqRef, tempoFactor, fallingNoteColorRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let last = performance.now();
    const speed = 0.12;

    function loop(now) {
      const dt = now - last; last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fnotes = Array.isArray(fallingNotesRef.current) ? fallingNotesRef.current : [];
      for (let i = 0; i < fnotes.length; i++) {
        const fn = fnotes[i];
        if (!fn) continue;
        if (typeof fn.y !== 'number') fn.y = -20;
        fn.y += dt * speed * (1 / tempoFactor);
        try {
          ctx.fillStyle = fallingNoteColorRef.current;
          const drawX = (typeof fn.x === 'number') ? fn.x : 0;
          const noteHeight = (typeof fn.duration === 'number') ? fn.duration * 100 : 12; // Scale duration to height
          ctx.fillRect(drawX - 18, fn.y - noteHeight, 36, noteHeight);
        } catch (e) { /* drawing error - skip */ }
      }
      fallingNotesRef.current = fnotes.filter(fn => fn && typeof fn.y === 'number' && fn.y < canvas.height + 50);
      fallingReqRef.current = requestAnimationFrame(loop);
    }
    fallingReqRef.current = requestAnimationFrame(loop);
    return () => {
      if (fallingReqRef.current) cancelAnimationFrame(fallingReqRef.current);
    };
  }, [canvasRef, fallingNotesRef, fallingReqRef, tempoFactor, fallingNoteColorRef]); // All refs and tempoFactor are dependencies
}
