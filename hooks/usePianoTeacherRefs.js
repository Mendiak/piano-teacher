'use client';

import { useRef } from 'react';

export function usePianoTeacherRefs() {
  const canvasRef = useRef(null);
  const keyboardRef = useRef(null);
  const keyRefs = useRef([]);
  const keyPositionsRef = useRef({});
  const fallingReqRef = useRef(null);
  const fallingNotesRef = useRef([]);
  const expectedNoteRef = useRef(null);
  const lastNoteTimeRef = useRef(null);

  return {
    canvasRef,
    keyboardRef,
    keyRefs,
    keyPositionsRef,
    fallingReqRef,
    fallingNotesRef,
    expectedNoteRef,
    lastNoteTimeRef,
  };
}
