'use client';

import { useState, useEffect } from 'react';

export function useMidi() {
  const [midiAccess, setMidiAccess] = useState(null);
  const [connectedInputs, setConnectedInputs] = useState([]);
  const [midiError, setMidiError] = useState(null);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(ma => {
        setMidiAccess(ma);
        setConnectedInputs(Array.from(ma.inputs.values()));
        ma.onstatechange = () => setConnectedInputs(Array.from(ma.inputs.values()));
      }).catch(e => {
        console.warn('MIDI not available', e);
        setMidiError('MIDI not available. Please use a compatible browser (Chrome, Edge) and grant permission.');
      });
    } else {
      setMidiError('Web MIDI API is not supported in this browser.');
    }
  }, []);

  return { midiAccess, connectedInputs, midiError };
}
