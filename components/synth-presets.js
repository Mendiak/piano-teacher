import * as Tone from 'tone';

export const synthPresets = {
  default: {
    name: 'Default Piano',
    options: {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0, release: 0.05 },
    },
  },
  epiano: {
    name: 'Electric Piano',
    options: {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.8 },
      volume: -5,
    },
  },
  organ: {
    name: 'Organ',
    options: {
      oscillator: { type: 'square' },
      envelope: { attack: 0.05, decay: 0.5, sustain: 0.8, release: 0.2 },
      volume: -8,
    },
  },
  bass: {
    name: 'Bass',
    options: {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.7, release: 0.5 },
      volume: -10,
    },
  },
  flute: {
    name: 'Flute',
    options: {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.2, decay: 0.5, sustain: 0.9, release: 0.8 },
      volume: -12,
    },
  },
  strings: {
    name: 'Strings',
    options: {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.5, decay: 0.8, sustain: 0.7, release: 1.2 },
      volume: -15,
    },
  },
  bell: {
    name: 'Bell',
    options: {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.01, decay: 0.4, sustain: 0.1, release: 1.5 },
      volume: -3,
    },
  },
  pluck: {
    name: 'Pluck',
    options: {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.05, release: 0.5 },
      volume: -7,
    },
  },
  pad: {
    name: 'Pad',
    options: {
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 1, decay: 1, sustain: 0.8, release: 2 },
      volume: -18,
    },
  },
  kalimba: {
    name: 'Kalimba',
    options: {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 1 },
      volume: -6,
    },
  },
};
