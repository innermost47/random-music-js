import { Timer } from "./src/Timer.js";
import {
  chromaticScale,
  initBuffers,
  minorModes,
  pickRandomProperty,
} from "./utils/utils.js";
import { Mode } from "./src/Mode.js";

const audioCtx = new AudioContext();

const kickBuffers = [];
const snareBuffers = [];
const chhBuffers = [];
const ohhBuffers = [];
const clBuffers = [];
const cyBuffers = [];

initBuffers("eightBits", "kick", kickBuffers, audioCtx)
  .then(() => initBuffers("eightBits", "snare", snareBuffers, audioCtx))
  .then(() => initBuffers("eightBits", "chh", chhBuffers, audioCtx))
  .then(() => initBuffers("eightBits", "ohh", ohhBuffers, audioCtx))
  .then(() => initBuffers("eightBits", "cl", clBuffers, audioCtx))
  .then(() => initBuffers("eightBits", "cy", cyBuffers, audioCtx));

const timer = new Timer();
const mode = new Mode();
const bassFilter = audioCtx.createBiquadFilter();
const noteFilter = audioCtx.createBiquadFilter();
const chordFilter = audioCtx.createBiquadFilter();
const melodyFilter = audioCtx.createBiquadFilter();
const delay = audioCtx.createDelay();
const delayGain = audioCtx.createGain();
const songs = 10;
const measures = 8;
const songDuration = measures * 5;
const velocities = [0.3, 1];

let currentStep = 0;
let bpm = 90;
let noteArray = [];
let bassArray = [];
let chordArray = [];
let melodyArray = [];
let noteThemeArray = [];
let bassThemeArray = [];
let chordThemeArray = [];
let melodyThemeArray = [];
let kick;
let chh;
let ohh;
let cl;
let snare;
let cy;
let kicksArray = [];
let chhsArray = [];
let snaresArray = [];
let clsArray = [];
let ohhsArray = [];
let decayTime;
let timeSignature;
let currentMeasure = 0;
let currentSongDuration = 0;
let currentSong = 0;
let attackTime = 0;
let frequencies = [];
let melodyFrequencies = [];
let bassFrequencies = [];
let chordsFrequencies = [];
let randomizer = Math.random();
let bassFilterFrequency = 3000;
let bassFilterFrequencyArrived = bassFilterFrequency / 4;
let chordFilterFrequency = 5000;
let chordFilterFrequencyArrived = chordFilterFrequency / 1.3;
let noteFilterFrequency = 4000;
let noteFilterFrequencyArrived = noteFilterFrequency / 2;
let melodyFilterFrequency = 6000;
let melodyFilterFrequencyArrived = melodyFilterFrequency / 2;

function initDrumMachine() {
  kick = kickBuffers[Math.floor(Math.random() * kickBuffers.length)];
  chh = chhBuffers[Math.floor(Math.random() * chhBuffers.length)];
  snare = snareBuffers[Math.floor(Math.random() * snareBuffers.length)];
  ohh = ohhBuffers[Math.floor(Math.random() * ohhBuffers.length)];
  cl = clBuffers[Math.floor(Math.random() * clBuffers.length)];
  cy = cyBuffers[0];
}

function initFilter(
  filter,
  filterFrequency,
  filterFrequencyArrived,
  type,
  qValue,
  isDelayed
) {
  filter.connect(audioCtx.destination);
  if (isDelayed) {
    filter.connect(delay);
  }
  filter.type = type;
  filter.Q.value = qValue;
  filter.frequency.setValueAtTime(filterFrequency, audioCtx.currentTime);
  filter.frequency.linearRampToValueAtTime(
    filterFrequencyArrived,
    audioCtx.currentTime + attackTime
  );
}

function initScale() {
  mode.mode = pickRandomProperty(minorModes);
  mode.rootNote =
    chromaticScale[Math.floor(Math.random() * chromaticScale.length)];
  frequencies = mode.getFrequenciesFromMode([2, 3, 4, 5]);
  bassFrequencies = [
    frequencies[0],
    frequencies[2],
    frequencies[4],
    frequencies[6],
    frequencies[7],
  ];

  chordsFrequencies = [
    [frequencies[0], frequencies[2], frequencies[4]],
    [frequencies[0], frequencies[2], frequencies[5]],
    [frequencies[0], frequencies[2], frequencies[6]],
    [frequencies[0], frequencies[5], frequencies[8]],
  ];

  melodyFrequencies = [
    frequencies[7],
    frequencies[9],
    frequencies[10],
    frequencies[11],
    frequencies[13],
    frequencies[14],
    frequencies[16],
    frequencies[17],
    frequencies[18],
    frequencies[20],
    frequencies[21],
  ];
}

function createBassAndChords() {
  bassFrequencies = [];
  chordsFrequencies = [];
  melodyFrequencies = [];
  let random = Math.random();
  switch (true) {
    case random < 1 / 7:
      bassFrequencies = [
        frequencies[0],
        frequencies[2],
        frequencies[4],
        frequencies[5],
        frequencies[7],
      ];
      chordsFrequencies = [
        [frequencies[0], frequencies[2], frequencies[4]],
        [frequencies[0], frequencies[2], frequencies[5]],
      ];
      melodyFrequencies = [
        frequencies[7],
        frequencies[9],
        frequencies[10],
        frequencies[11],
        frequencies[12],
        frequencies[14],
        frequencies[16],
        frequencies[17],
        frequencies[18],
        frequencies[19],
        frequencies[21],
      ];
      break;
    case random >= 1 / 7 && random < 2 / 7:
      bassFrequencies = [
        frequencies[1],
        frequencies[3],
        frequencies[5],
        frequencies[7],
        frequencies[8],
      ];
      chordsFrequencies = [
        [frequencies[1], frequencies[3], frequencies[5]],
        [frequencies[1], frequencies[3], frequencies[7]],
      ];
      melodyFrequencies = [
        frequencies[8],
        frequencies[10],
        frequencies[11],
        frequencies[12],
        frequencies[14],
        frequencies[16],
        frequencies[17],
        frequencies[18],
        frequencies[19],
        frequencies[21],
        frequencies[22],
      ];
      break;
    case random >= 2 / 7 && random < 3 / 7:
      bassFrequencies = [
        frequencies[2],
        frequencies[4],
        frequencies[6],
        frequencies[8],
        frequencies[9],
      ];
      chordsFrequencies = [
        [frequencies[2], frequencies[4], frequencies[6]],
        [frequencies[2], frequencies[4], frequencies[8]],
      ];
      melodyFrequencies = [
        frequencies[9],
        frequencies[11],
        frequencies[12],
        frequencies[13],
        frequencies[15],
        frequencies[17],
        frequencies[18],
        frequencies[19],
        frequencies[21],
        frequencies[22],
        frequencies[23],
      ];
      break;
    case random >= 3 / 7 && random < 4 / 7:
      bassFrequencies = [
        frequencies[3],
        frequencies[5],
        frequencies[7],
        frequencies[9],
        frequencies[10],
      ];
      chordsFrequencies = [
        [frequencies[3], frequencies[5], frequencies[7]],
        [frequencies[3], frequencies[5], frequencies[9]],
      ];
      melodyFrequencies = [
        frequencies[10],
        frequencies[12],
        frequencies[13],
        frequencies[14],
        frequencies[16],
        frequencies[17],
        frequencies[19],
        frequencies[20],
        frequencies[21],
        frequencies[23],
        frequencies[24],
      ];
      break;
    case random >= 4 / 7 && random < 5 / 7:
      bassFrequencies = [
        frequencies[4],
        frequencies[6],
        frequencies[8],
        frequencies[10],
        frequencies[11],
      ];
      chordsFrequencies = [
        [frequencies[4], frequencies[6], frequencies[8]],
        [frequencies[4], frequencies[6], frequencies[10]],
      ];
      melodyFrequencies = [
        frequencies[11],
        frequencies[13],
        frequencies[14],
        frequencies[16],
        frequencies[17],
        frequencies[18],
        frequencies[20],
        frequencies[21],
        frequencies[22],
        frequencies[24],
        frequencies[25],
      ];
      break;
    case random >= 5 / 7 && random < 6 / 7:
      bassFrequencies = [
        frequencies[5],
        frequencies[7],
        frequencies[9],
        frequencies[11],
        frequencies[12],
      ];
      chordsFrequencies = [
        [frequencies[5], frequencies[7], frequencies[9]],
        [frequencies[5], frequencies[7], frequencies[11]],
      ];
      melodyFrequencies = [
        frequencies[12],
        frequencies[14],
        frequencies[15],
        frequencies[16],
        frequencies[18],
        frequencies[19],
        frequencies[21],
        frequencies[22],
        frequencies[23],
        frequencies[25],
        frequencies[26],
      ];
      break;
    case random >= 6 / 7 && random < 7 / 7:
      bassFrequencies = [
        frequencies[6],
        frequencies[8],
        frequencies[10],
        frequencies[12],
        frequencies[13],
      ];
      chordsFrequencies = [
        [frequencies[6], frequencies[8], frequencies[10]],
        [frequencies[6], frequencies[8], frequencies[12]],
      ];
      melodyFrequencies = [
        frequencies[13],
        frequencies[15],
        frequencies[16],
        frequencies[17],
        frequencies[19],
        frequencies[20],
        frequencies[22],
        frequencies[23],
        frequencies[24],
        frequencies[26],
        frequencies[27],
      ];
      break;
  }
  generateNextMusicalColor();
}

function initTime() {
  const numbers = [3, 4];
  timeSignature = numbers[Math.floor(Math.random() * numbers.length)] * 4;
  decayTime = 0.1;
  delay.delayTime.value = 0.5;
  delayGain.gain.value = 0.2;
}

function disconnectAll(oscs, gains, duration) {
  setTimeout(() => {
    for (let i = 0; i < oscs.length; i++) {
      oscs[i].disconnect();
    }
    for (let i = 0; i < gains.length; i++) {
      gains[i].disconnect();
    }
  }, duration * 1000);
}

function playBass(frequency, duration, filter) {
  let oscillator = audioCtx.createOscillator();
  let oscillator2 = audioCtx.createOscillator();
  let oscillateurGain = audioCtx.createGain();
  let oscillateur2Gain = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator2.type = "sawtooth";

  oscillateurGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  oscillateurGain.gain.linearRampToValueAtTime(
    0,
    audioCtx.currentTime + duration
  );
  oscillateur2Gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  oscillateur2Gain.gain.linearRampToValueAtTime(
    0,
    audioCtx.currentTime + duration
  );

  oscillator.connect(oscillateurGain);
  oscillateurGain.connect(audioCtx.destination);

  oscillator2.connect(oscillateur2Gain);
  oscillateur2Gain.connect(filter);

  oscillator.frequency.setValueAtTime(frequency / 2, audioCtx.currentTime);
  oscillator2.frequency.setValueAtTime(frequency / 2, audioCtx.currentTime);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  oscillator2.start(audioCtx.currentTime);
  oscillator2.stop(audioCtx.currentTime + duration);

  disconnectAll(
    [oscillator, oscillator2],
    [oscillateurGain, oscillateur2Gain],
    duration
  );
}

function playChord(frequencies, duration, filter) {
  let oscillator = audioCtx.createOscillator();
  let oscillator2 = audioCtx.createOscillator();
  let oscillator3 = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator.type = "sawtooth";
  oscillator2.type = "sawtooth";
  oscillator3.type = "sawtooth";

  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration / 2);

  oscillator.connect(gain);
  oscillator2.connect(gain);
  oscillator3.connect(gain);
  gain.connect(filter);

  oscillator.frequency.setValueAtTime(frequencies[0] * 2, audioCtx.currentTime);
  oscillator2.frequency.setValueAtTime(
    frequencies[1] * 2,
    audioCtx.currentTime
  );
  oscillator3.frequency.setValueAtTime(
    frequencies[2] * 2,
    audioCtx.currentTime
  );

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);
  oscillator2.start(audioCtx.currentTime);
  oscillator2.stop(audioCtx.currentTime + duration);
  oscillator3.start(audioCtx.currentTime);
  oscillator3.stop(audioCtx.currentTime + duration);

  disconnectAll([oscillator, oscillator2, oscillator3], [gain], duration);
}

function playNote(frequency, duration, filter) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator.type = "sawtooth";

  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(filter);
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  oscillator.start(audioCtx.currentTime);

  oscillator.stop(audioCtx.currentTime + duration);

  disconnectAll([oscillator], [gain], duration);
}

function playMelody(frequency, duration, filter) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator.type = "square";

  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(filter);

  oscillator.frequency.setValueAtTime(frequency * 2, audioCtx.currentTime);

  oscillator.start(audioCtx.currentTime);

  oscillator.stop(audioCtx.currentTime + duration);

  disconnectAll([oscillator], [gain], duration);
}

function playSequence() {
  if (currentStep < timeSignature - 1) {
    currentStep++;
  } else {
    currentStep = 0;
    currentMeasure++;
    if (currentMeasure === measures - 1) {
      randomBreak();
    }
    if (currentMeasure === measures) {
      randomRiddim();
      if (currentSongDuration > 1) {
        checkActions();
      }
      randomizer = Math.random();
      currentMeasure = 0;
      currentSongDuration++;
      if (currentSongDuration > 0) {
        playPercussionWithVelocity(cy, 1);
        playPercussionWithVelocity(kick, 1);
      }
    }
    if (currentSongDuration === songDuration) {
      currentSongDuration = 0;
      currentMeasure = 0;
      currentSong++;
      initScale();
      initDrumMachine();
      randomIntro();
      createTheme();
      if (currentSong === songs) {
        currentSong = 0;
        currentSongDuration = 0;
        currentMeasure = 0;
        initScale();
        initDrumMachine();
        randomIntro();
        createTheme();
      }
    }
  }
  playDrum();
  playBassAndChords();
  playInstruments(randomizer);
}

function checkActions() {
  let rand = Math.random();
  if (currentSongDuration > 4 && rand < 0.2) {
    createBassAndChords();
  } else if (rand < 0.4) {
    generateNextMusicalColor();
  } else if (currentSongDuration > 8 && rand < 0.7) {
    noteArray = noteThemeArray;
    bassArray = bassThemeArray;
    chordArray = chordThemeArray;
    melodyArray = melodyThemeArray;
  }
}

function playBassAndChords() {
  if (currentSongDuration > 0) {
    if (bassArray[currentStep] != null) {
      playBass(
        bassArray[currentStep].note,
        bassArray[currentStep].duration,
        bassFilter
      );
    }
  }
  if (chordArray[currentStep] != undefined) {
    if (chordArray[currentStep].note) {
      playChord(
        chordArray[currentStep].note,
        chordArray[currentStep].duration,
        chordFilter
      );
    }
  }
}

function playInstruments(randomizer) {
  let notes = [noteArray, melodyArray];
  switch (true) {
    case randomizer < 1 / 3:
      if (Math.random() < 0.5) {
        playNote(
          notes[0][currentStep].note,
          notes[0][currentStep].duration,
          noteFilter
        );
      } else {
        playMelody(
          notes[1][currentStep].note,
          notes[1][currentStep].duration,
          melodyFilter
        );
      }
      break;
    case randomizer >= 1 / 3 && randomizer < 2 / 3:
      playNote(
        notes[0][currentStep].note,
        notes[0][currentStep].duration,
        noteFilter
      );
      break;
    case randomizer >= 2 / 3:
      playMelody(
        notes[1][currentStep].note,
        notes[1][currentStep].duration,
        melodyFilter
      );
      break;
  }
}

function playDrum() {
  let percussions = [
    { array: kicksArray, type: kick },
    { array: chhsArray, type: chh, velocity: true },
    { array: snaresArray, type: snare, velocity: true },
    { array: ohhsArray, type: ohh, velocity: true },
    { array: clsArray, type: cl, velocity: true },
  ];
  percussions.forEach(({ array, type, velocity }) => {
    if (array[currentStep]) {
      if (velocity) {
        playPercussionWithVelocity(
          type,
          velocities[Math.floor(Math.random() * velocities.length)]
        );
      } else {
        playPercussionWithVelocity(type, 1);
      }
    }
  });
}

function generateNextMusicalColor() {
  noteArray = generateRandomNoteSequence(melodyFrequencies);
  bassArray = generateRandomBass(bassFrequencies);
  chordArray = generateRandomChordSequence(chordsFrequencies);
  melodyArray = generateRandomMelody(melodyFrequencies);
}

function playPercussionWithVelocity(buffer, velocity) {
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

function createTheme() {
  noteThemeArray = generateRandomNoteSequence(melodyFrequencies);
  noteArray = noteThemeArray;
  bassThemeArray = generateRandomBass(bassFrequencies);
  bassArray = bassThemeArray;
  chordThemeArray = generateRandomChordSequence(chordsFrequencies);
  chordArray = chordThemeArray;
  melodyThemeArray = generateRandomMelody(melodyFrequencies);
  melodyArray = melodyThemeArray;
}

function loop() {
  randomIntro();
  createTheme();
  timer.callback = playSequence;
  timer.timeInterval = (6000 / bpm / 4) * 10;
  timer.errorCallback = "error";
  timer.start();
}

function resetDrumSequence() {
  kicksArray = [];
  chhsArray = [];
  snaresArray = [];
  clsArray = [];
  ohhsArray = [];
}

function randomIntro() {
  resetDrumSequence();
  for (let i = 0; i < timeSignature; i++) {
    chhsArray.push(Math.random() < 0.7);
  }
}

function randomBreak() {
  resetDrumSequence();
  for (let i = 0; i < timeSignature; i++) {
    kicksArray.push(Math.random() < 0.1);
    chhsArray.push(Math.random() < 0.7);
    snaresArray.push(Math.random() < 0.7);
    clsArray.push(Math.random() < 0.2);
    ohhsArray.push(Math.random() < 0.3);
  }
}

function randomRiddim() {
  resetDrumSequence();
  let hasOhh = Math.random() < 0.5;
  for (let i = 0; i < timeSignature; i++) {
    kicksArray.push(Math.random() < 0.5);
    chhsArray.push(Math.random() < 0.7);
    snaresArray.push(Math.random() < 0.3);
    clsArray.push(Math.random() < 0.2);
    if (hasOhh) {
      ohhsArray.push(Math.random() < 0.3);
    } else {
      ohhsArray.push(false);
    }
  }
}

function generateRandomBass(frequencies) {
  const sequence = [];
  let note;
  let random = Math.random();
  for (let i = 0; i < timeSignature; i++) {
    if (random < 0.05) {
      note = false;
      let duration = null;
      sequence.push({ note, duration });
    } else {
      if (Math.random() < 0.5) {
        if ((i = 0)) {
          note = frequencies[i];
        } else {
          note = frequencies[Math.floor(Math.random() * frequencies.length)];
        }
        let duration = timeSignature / bpm;
        sequence.push({ note, duration });
      } else {
        note = false;
        let duration = null;
        sequence.push({ note, duration });
      }
    }
  }
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i].note != false) {
      sequence[i].duration = timeSignature / bpm;
      let j = i + 1;
      while (sequence[j] && sequence[j].note === false) {
        sequence[i].duration += timeSignature / bpm;
        j++;
      }
    }
  }
  return sequence;
}

function generateRandomNoteSequence(frequencies) {
  const sequence = [];
  let random = Math.random();
  for (let i = 0; i < timeSignature; i++) {
    if (random < 0.05) {
      let note = false;
      let duration = "";
      sequence.push({ note, duration });
    } else {
      if (Math.random() < 0.5) {
        let note = frequencies[Math.floor(Math.random() * frequencies.length)];
        let duration = timeSignature / bpm;
        sequence.push({ note, duration });
      } else {
        let note = false;
        let duration = "";
        sequence.push({ note, duration });
      }
    }
  }
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i].note != false) {
      sequence[i].duration = timeSignature / bpm;
      let j = i + 1;
      while (sequence[j] && sequence[j].note === false) {
        sequence[i].duration += timeSignature / bpm;
        j++;
      }
    }
  }
  return sequence;
}

function generateRandomChordSequence(frequencies) {
  const sequence = [];
  let random = Math.random();
  for (let i = 0; i < timeSignature; i++) {
    if (random < 0.05) {
      let note = false;
      let duration = "";
      sequence.push({ note, duration });
    } else {
      if (Math.random() < 0.2) {
        let note = frequencies[Math.floor(Math.random() * frequencies.length)];
        let duration = timeSignature / bpm;
        sequence.push({ note, duration });
      } else {
        let note = false;
        let duration = "";
        sequence.push({ note, duration });
      }
    }
  }
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i].note != false) {
      sequence[i].duration = timeSignature / bpm;
      let j = i + 1;
      while (sequence[j] && sequence[j].note === false) {
        sequence[i].duration += timeSignature / bpm;
        j++;
      }
    }
  }
  return sequence;
}

function generateRandomMelody(frequencies) {
  const sequence = [];
  let random = Math.random();
  for (let i = 0; i < timeSignature; i++) {
    if (random < 0.05) {
      let note = false;
      let duration = "";
      sequence.push({ note, duration });
    } else {
      if (Math.random() < 0.6) {
        let note = frequencies[Math.floor(Math.random() * frequencies.length)];
        let duration = timeSignature / bpm;
        sequence.push({ note, duration });
      } else {
        let note = false;
        let duration = "";
        sequence.push({ note, duration });
      }
    }
  }
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i].note != false) {
      sequence[i].duration = timeSignature / bpm;
      let j = i + 1;
      while (sequence[j] && sequence[j].note === false) {
        sequence[i].duration += timeSignature / bpm;
        j++;
      }
    }
  }
  return sequence;
}

function initFilters() {
  initFilter(
    bassFilter,
    bassFilterFrequency,
    bassFilterFrequencyArrived,
    "lowpass",
    10,
    false
  );
  initFilter(
    noteFilter,
    noteFilterFrequency,
    noteFilterFrequencyArrived,
    "lowpass",
    10,
    true
  );
  initFilter(
    chordFilter,
    chordFilterFrequency,
    chordFilterFrequencyArrived,
    "lowpass",
    10,
    true
  );
  initFilter(
    melodyFilter,
    melodyFilterFrequency,
    melodyFilterFrequencyArrived,
    "lowpass",
    10,
    true
  );
}

export function stopSound() {
  bassFilter.disconnect();
  noteFilter.disconnect();
  chordFilter.disconnect();
  melodyFilter.disconnect();
  delay.disconnect();
  delayGain.disconnect();
  currentStep = 0;
  currentMeasure = 0;
  currentSongDuration = 0;
  currentSong = 0;
  timer.stop();
}

export function start() {
  initFilters();
  delay.connect(delayGain);
  delayGain.connect(audioCtx.destination);
  initTime();
  initDrumMachine();
  initScale();
  loop();
}
