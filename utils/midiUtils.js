const MIDI_TO_NOTE = (midi) => {
  const names = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const name = names[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
};

const generateKeyboardKeys = (firstMidi, lastMidi) => {
  return Array.from({ length: lastMidi - firstMidi + 1 }, (_, i) => {
    const midi = firstMidi + i;
    return { midi, note: MIDI_TO_NOTE(midi) };
  });
};

const getKeyboardConfig = () => {
  const firstMidi = 24; // C1
  const lastMidi = 108;  // C8
  const keys = generateKeyboardKeys(firstMidi, lastMidi);
  return { firstMidi, lastMidi, keys };
};

export { MIDI_TO_NOTE, generateKeyboardKeys, getKeyboardConfig };
