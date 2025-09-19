'use client';

import { useEffect } from 'react';

export function useKeyboardCanvasSync(keyboardRef, canvasRef, keys, keyRefs, keyPositionsRef) {
  useEffect(() => {
    const keyboardElement = keyboardRef.current;
    const canvas = canvasRef.current;
    if (!keyboardElement || !canvas) return;

    const resizeObserver = new ResizeObserver(() => {
        const keyboardRect = keyboardElement.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect(); // Get canvas position
        canvas.width = keyboardRect.width;
        const positions = {};
        keys.forEach((k) => {
            const keyElement = keyRefs.current[k.midi];
            if (keyElement) {
                const keyRect = keyElement.getBoundingClientRect();
                positions[k.midi] = keyRect.left - canvasRect.left + keyRect.width / 2;
            }
        });
        keyPositionsRef.current = positions;
    });

    resizeObserver.observe(keyboardElement);

    return () => resizeObserver.disconnect();

  }, [keyboardRef, canvasRef, keys, keyRefs, keyPositionsRef]); // All refs and keys are dependencies
}
