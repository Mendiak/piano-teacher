import { Midi } from '@tonejs/midi';

function createTwinkleTwinkle() {
  const midi = new Midi();
  const track = midi.addTrack();
  track.name = 'Twinkle Twinkle Little Star';

  // Notes for Twinkle Twinkle Little Star
  track.addNote({ midi: 60, time: 0, duration: 0.5 }); // C4
  track.addNote({ midi: 60, time: 0.5, duration: 0.5 }); // C4
  track.addNote({ midi: 67, time: 1, duration: 0.5 }); // G4
  track.addNote({ midi: 67, time: 1.5, duration: 0.5 }); // G4
  track.addNote({ midi: 69, time: 2, duration: 0.5 }); // A4
  track.addNote({ midi: 69, time: 2.5, duration: 0.5 }); // A4
  track.addNote({ midi: 67, time: 3, duration: 1 }); // G4

  track.addNote({ midi: 65, time: 4, duration: 0.5 }); // F4
  track.addNote({ midi: 65, time: 4.5, duration: 0.5 }); // F4
  track.addNote({ midi: 64, time: 5, duration: 0.5 }); // E4
  track.addNote({ midi: 64, time: 5.5, duration: 0.5 }); // E4
  track.addNote({ midi: 62, time: 6, duration: 0.5 }); // D4
  track.addNote({ midi: 62, time: 6.5, duration: 0.5 }); // D4
  track.addNote({ midi: 60, time: 7, duration: 1 }); // C4

  return midi;
}

export const midiLibrary = {
  'Twinkle Twinkle Little Star': createTwinkleTwinkle,
};