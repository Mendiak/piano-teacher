'use client';

import React from 'react';

export default function Keyboard({ keys, events, currentIdx, mode, keyRefs, keyboardRef, pressedKeys = new Set() }) {
  function renderKeys() {
    const whiteKeys = [];
    const blackKeys = [];

    keys.forEach(k => {
      const isBlack = k.note.includes('#');
      let isMelodyHighlighted = false;
      if (mode === 'step' && events[currentIdx] && events[currentIdx].midi === k.midi) {
        isMelodyHighlighted = true;
      }

      let isPressedHighlighted = false;
      if (pressedKeys && pressedKeys.has(k.midi)) {
        isPressedHighlighted = true;
      }

      let highlightClasses = '';
      if (isMelodyHighlighted) {
        highlightClasses += ' highlight-melody';
      }
      if (isPressedHighlighted) {
        highlightClasses += ' highlight-pressed';
      }

      // Basic classes that apply to all keys
      const baseKeyClasses = `key${highlightClasses}`;

      if (isBlack) {
        let leftOffset = 0;
        const octave = Math.floor(k.midi / 12);
        const noteInOctave = k.midi % 12;

        switch (noteInOctave) {
          case 1: // C#
            leftOffset = 52; 
            break;
          case 3: // D#
            leftOffset = 132; 
            break;
          case 6: // F#
            leftOffset = 292; 
            break;
          case 8: // G#
            leftOffset = 372; 
            break;
          case 10: // A#
            leftOffset = 452; 
            break;
          default:
            break;
        }
        // Adjust for octave
        leftOffset += (octave - Math.floor(keys[0].midi / 12)) * (7 * 80); 

        blackKeys.push(
          <div 
            key={k.midi} 
            ref={el => keyRefs.current[k.midi] = el} 
            className={`${baseKeyClasses} black`}
            style={{ left: `${leftOffset}px` }}
          >
            <span className="text-xs">{k.note}</span>
          </div>
        );
      } else {
        whiteKeys.push(
          <div 
            key={k.midi} 
            ref={el => keyRefs.current[k.midi] = el} 
            className={`${baseKeyClasses} white`}
          >
            <span className="text-xs">{k.note}</span>
          </div>
        );
      }
    });

    return (
      <>
        <div className="flex">{whiteKeys}</div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">{blackKeys}</div>
      </>
    );
  }

  return (
    <div className="keyboard flex select-none" aria-hidden="true" ref={keyboardRef}>
      {renderKeys()}
    </div>
  );
}
