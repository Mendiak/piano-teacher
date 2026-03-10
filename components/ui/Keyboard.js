'use client';

// Mapping for labels based on relative notes from C
const NOTE_TO_LABEL = {
  0: 'A',  // C
  1: 'W',  // C#
  2: 'S',  // D
  3: 'E',  // D#
  4: 'D',  // E
  5: 'F',  // F
  6: 'T',  // F#
  7: 'G',  // G
  8: 'Y',  // G#
  9: 'H',  // A
  10: 'U', // A#
  11: 'J', // B
  12: 'K', // C (+1 Oct)
  13: 'O', // C# (+1 Oct)
  14: 'L', // D (+1 Oct)
  15: 'P', // D# (+1 Oct)
  16: ';', // E (+1 Oct)
  17: "'", // F (+1 Oct)
};

export default function Keyboard({ keys, events, currentIdx, mode, keyRefs, keyboardRef, pressedKeys = new Set(), isAutoPlaying, octave, showKeyLabels = true }) {
  function renderKeys(isAutoPlaying) {
    const whiteKeys = [];
    const blackKeys = [];

    keys.forEach(k => {
      const isBlack = k.note.includes('#');
      const octaveStartMidi = (octave + 1) * 12;
      const relativeNote = k.midi - octaveStartMidi;
      const keyLabel = (relativeNote >= 0 && relativeNote <= 17) ? NOTE_TO_LABEL[relativeNote] : null;

      let isMelodyHighlighted = false;
      if (!isAutoPlaying && mode === 'step' && events[currentIdx] && events[currentIdx].midi === k.midi) {
        isMelodyHighlighted = true;
      }

      let isPressedHighlighted = false;
      if (pressedKeys && pressedKeys.has(k.midi)) {
        isPressedHighlighted = true;
      }

      let highlightClasses = '';
      if (isMelodyHighlighted) highlightClasses += ' highlight-melody';
      if (isPressedHighlighted) highlightClasses += ' highlight-pressed';

      const baseKeyClasses = `key${highlightClasses}`;

      if (isBlack) {
        let leftOffset = 0;
        const kOctave = Math.floor(k.midi / 12);
        const noteInOctave = k.midi % 12;

        switch (noteInOctave) {
          case 1: leftOffset = 19; break;
          case 3: leftOffset = 49; break;
          case 6: leftOffset = 109; break;
          case 8: leftOffset = 139; break;
          case 10: leftOffset = 169; break;
        }
        leftOffset += (kOctave - Math.floor(keys[0].midi / 12)) * (7 * 30); 

        blackKeys.push(
          <div 
            key={k.midi} 
            ref={el => keyRefs.current[k.midi] = el} 
            className={`${baseKeyClasses} black`}
            style={{ left: `${leftOffset}px` }}
          >
            {showKeyLabels && keyLabel && <span className="key-label-black">{keyLabel}</span>}
          </div>
        );
      } else {
        whiteKeys.push(
          <div 
            key={k.midi} 
            ref={el => keyRefs.current[k.midi] = el} 
            className={`${baseKeyClasses} white`}
          >
            <div className="flex flex-col items-center justify-end h-full pb-1">
               {showKeyLabels && keyLabel && <span className="key-label-white">{keyLabel}</span>}
               <span className="text-[10px] opacity-50">{k.note}</span>
            </div>
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

  // Calculate bar position
  const totalMidiRange = 108 - 24;
  const focusStartMidi = (octave + 1) * 12;
  const barLeft = ((focusStartMidi - 24) / totalMidiRange) * 100;
  const barWidth = (18 / totalMidiRange) * 100;

  return (
    <div className="flex flex-col items-center w-full max-w-full overflow-hidden">
      <div className="keyboard flex select-none relative" aria-hidden="true" ref={keyboardRef}>
        {renderKeys(isAutoPlaying)}
      </div>
      
      {/* Octave Focus Bar Container */}
      <div className="w-full mt-6 px-4 max-w-[800px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Bajos</span>
          <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Enfoque Teclado (Octava {octave})</span>
          <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Agudos</span>
        </div>
        <div className="relative w-full h-3 bg-gray-200 dark:bg-white/10 rounded-full border border-black/5 dark:border-white/5 shadow-inner">
          {/* Main Focus Indicator */}
          <div 
            className="absolute h-full transition-all duration-300 ease-out"
            style={{
              left: `${Math.max(0, Math.min(100 - barWidth, barLeft))}%`,
              width: `${barWidth}%`,
              backgroundColor: '#7c3aed',
              borderRadius: '999px',
              boxShadow: '0 0 15px rgba(124, 58, 237, 0.6)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
