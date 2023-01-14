export function generateRandomNoteSequence(frequencies, steps, bpm) {
  const sequence = [];
  for (let i = 0; i < steps; i++) {
    if (Math.random() < 0.4) {
      let note = frequencies[Math.floor(Math.random() * frequencies.length)];
      let duration = (steps / bpm) * 1.3;
      sequence.push({ note, duration });
    } else {
      let note = false;
      let duration = "";
      sequence.push({ note, duration });
    }
  }
  return sequence;
}

export function generateNoteSequenceForChord(
  frequencies,
  noteIndex,
  steps,
  bpm
) {
  const sequence = [];
  for (let i = 0; i < steps; i++) {
    if (Math.random() < 0.4) {
      let note = frequencies[noteIndex];
      let duration = steps / bpm;
      sequence.push({ note, duration });
    } else {
      let note = false;
      let duration = "";
      sequence.push({ note, duration });
    }
  }
  return sequence;
}

export function generateNoteForBass(frequencies, notesIndex, steps, bpm) {
  const sequence = [];
  for (let i = 0; i < steps; i++) {
    if (Math.random() < 0.4) {
      let note =
        frequencies[notesIndex[Math.floor(Math.random() * notesIndex.length)]] /
        2;
      let duration = steps / bpm;
      sequence.push({ note, duration });
    } else {
      let note = false;
      let duration = "";
      sequence.push({ note, duration });
    }
  }
  return sequence;
}

export function generateNotesForArpegiator(
  frequencies,
  notesIndex,
  steps,
  bpm
) {
  const sequence = [];
  for (let i = 0; i < steps; i++) {
    if (Math.random() < 1) {
      let note =
        frequencies[notesIndex[Math.floor(Math.random() * notesIndex.length)]] /
        2;
      let duration = steps / bpm;
      sequence.push({ note, duration });
    } else {
      let note = false;
      let duration = "";
      sequence.push({ note, duration });
    }
  }
  return sequence;
}
