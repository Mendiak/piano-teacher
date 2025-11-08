'use client';

import { useEffect } from 'react';

export function useMidiInputHandler(midiAccess, setPressedKeys, handleUserNoteOn) {
  useEffect(() => {
    const onMIDIMessage = (message) => {
      const [status, note, velocity] = message.data;
      
      if ((status === 144 || status === 128)) {
        handleUserNoteOn(note, velocity);
        setPressedKeys(prev => {
          const newKeys = new Set(prev);
          if (velocity > 0) {
            newKeys.add(note);
          } else {
            newKeys.delete(note);
          }
          return newKeys;
        });
      }
    };

    if (midiAccess) {
      const inputs = midiAccess.inputs.values();
      for (const input of inputs) {
        input.addEventListener('midimessage', onMIDIMessage);
      }
    }

    return () => {
      if (midiAccess) {
        const inputs = midiAccess.inputs.values();
        for (const input of inputs) {
          input.removeEventListener('midimessage', onMIDIMessage);
        }
      }
    };
  }, [midiAccess, setPressedKeys, handleUserNoteOn]);
}
