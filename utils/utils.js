export const audioCtx = new (window.AudioContext ||
  window.webkitAudioContext)();

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

export const chromaticScale = [
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
];

export const modes = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  arabian: [0, 1, 4, 5, 7, 8, 10],
  gipsy: [0, 1, 4, 5, 7, 8, 11],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  arabianDorian: [0, 2, 3, 6, 7, 9, 10],
};

export const minorModes = {
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  arabian: [0, 1, 4, 5, 7, 8, 10],
};

export const initBuffers = (
  folder,
  percussionName,
  percussionNameBuffers,
  audioCtx,
  totalFileByDrum
) => {
  const requests = [];
  for (let i = 0; i < totalFileByDrum; i++) {
    const request = new XMLHttpRequest();
    request.open("GET", `/sounds/${folder}/${percussionName + i}.wav`, true);
    request.responseType = "arraybuffer";
    requests.push(
      new Promise((resolve, reject) => {
        request.onload = function () {
          audioCtx.decodeAudioData(request.response, function (buffer) {
            percussionNameBuffers[i] = buffer;
            resolve();
          });
        };
        request.send();
      })
    );
  }
  return Promise.all(requests);
};

export function pickRandomProperty(obj) {
  let result;
  let count = 0;
  for (let prop in obj) if (Math.random() < 1 / ++count) result = prop;
  return result;
}

export const drumKits = {
  kicks: [],
  snares: [],
  chhs: [],
  ohhs: [],
  cls: [],
  cys: [],
};

export function playPercussionWithVelocity(
  buffer,
  velocity,
  audioCtx,
  timeSignature
) {
  let gainNode = audioCtx.createGain();
  let percBuffer = audioCtx.createBufferSource();
  percBuffer.buffer = buffer;
  gainNode.gain.value = velocity;
  percBuffer.connect(gainNode).connect(audioCtx.destination);
  percBuffer.start(audioCtx.currentTime);
  percBuffer.stop(audioCtx.currentTime + timeSignature);
  setTimeout(() => {
    percBuffer.disconnect();
    gainNode.disconnect();
  }, timeSignature * 100);
}

export function playDrum(
  percussions,
  audioCtx,
  currentStep,
  velocities,
  timeSignature
) {
  percussions.forEach(({ array, type, velocity }) => {
    if (array[currentStep]) {
      if (velocity) {
        playPercussionWithVelocity(
          type,
          velocities[Math.floor(Math.random() * velocities.length)],
          audioCtx,
          timeSignature
        );
      } else {
        playPercussionWithVelocity(type, 1, audioCtx, timeSignature);
      }
    }
  });
}

export function randomPercussionSequence(random, totalSteps) {
  let array = [];
  for (let i = 0; i < totalSteps; i++) {
    array.push(Math.random() < random);
  }
  return array;
}

export const SINE = "sine";
export const SQUARE = "square";
export const SAW = "sawtooth";
