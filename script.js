import { NOTES_JSON } from "./notes.js";
import { Timer } from "./Timer.js";

const audioCtx = new AudioContext();

const kickBuffers = [];
const snareBuffers = [];
const chhBuffers = [];
const ohhBuffers = [];
const clBuffers = [];
const cyBuffers = [];

const initBuffers = (percussionName, percussionNameBuffers) => {
  const requests = [];
  for (let i = 0; i < 4; i++) {
    const request = new XMLHttpRequest();
    request.open("GET", `/sounds/${percussionName + i}.wav`, true);
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

initBuffers("kick", kickBuffers)
  .then(() => initBuffers("snare", snareBuffers))
  .then(() => initBuffers("chh", chhBuffers))
  .then(() => initBuffers("ohh", ohhBuffers))
  .then(() => initBuffers("cl", clBuffers))
  .then(() => initBuffers("cy", cyBuffers));

const chromaticScale = [
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
const ionianModeOffsets = [0, 2, 4, 5, 7, 9, 11];
const dorianModeOffsets = [0, 2, 3, 5, 7, 9, 10];
const phrygianModeOffsets = [0, 1, 3, 5, 7, 8, 10];
const lydianModeOffsets = [0, 2, 4, 6, 7, 9, 11];
const mixolydianModeOffsets = [0, 2, 4, 5, 7, 9, 10];
const aeolianModeOffsets = [0, 2, 3, 5, 7, 8, 10];
const arabian = [0, 1, 4, 5, 7, 8, 10];
const gipsy = [0, 1, 4, 5, 7, 8, 11];
const harmonicMinor = [0, 2, 3, 5, 7, 8, 11];
const arabianDorian = [0, 2, 3, 6, 7, 9, 10];

const modeOffsets = [
  aeolianModeOffsets,
  phrygianModeOffsets,
  // dorianModeOffsets,
  // lydianModeOffsets,
  // ionianModeOffsets,
  // mixolydianModeOffsets,
  arabian,
  arabianDorian,
];

const timer = new Timer();
const bassFilter = audioCtx.createBiquadFilter();
const noteFilter = audioCtx.createBiquadFilter();
const chordFilter = audioCtx.createBiquadFilter();
const melodyFilter = audioCtx.createBiquadFilter();
const delayNode = audioCtx.createDelay();
const octaves = [1, 2, 3, 4];
const bassOctaves = [2];
const songs = 10;
const measures = 8;
const songDuration = measures * 5;
const play = document.getElementById("play");
const stop = document.getElementById("stop");
const canvas = document.getElementById("canva");
const ctx = canvas.getContext("2d");
const velocities = [0.3, 1];
const curentStepControl = document.getElementById("currentStep");
const curentMeasureControl = document.getElementById("currentMeasure");
const curentSongDurationControl = document.getElementById(
  "currentSongDuration"
);
const curentSongControl = document.getElementById("currentSong");
const currentScaleControl = document.getElementById("currentScale");

let currentStep = 0;
let bpm = 80;
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
let timeSignature;
let currentMeasure = 0;
let currentSongDuration = 0;
let currentSong = 0;
let attackTime = 0;
let decayTime;
let scale = [];
let bassScale = [];
let chords = [];
let allNotes = [];
let bassNotes = [];
let frequencies = [];
let melodyFrequencies = [];
let melodyNotes = [];
let bassFrequencies = [];
let chordsFrequencies = [];
let modeOffset = [];
let rootNote;
let isPlaying = false;
let randomizer = Math.random();
let bassFilterFrequency = 3000;
let bassFilterFrequencyArrived = bassFilterFrequency / 4;
let chordFilterFrequency = 5000;
let chordFilterFrequencyArrived = chordFilterFrequency / 1.3;
let noteFilterFrequency = 4000;
let noteFilterFrequencyArrived = noteFilterFrequency / 2;
let melodyFilterFrequency = 6000;
let melodyFilterFrequencyArrived = melodyFilterFrequency / 2;
let time;
let probabilityValues = [
  [0.3, 0.7, 0.3, 0.2, 0.2],
  [0.5, 0.9, 0.3, 0.2, 0],
  [0.3, 0, 0.5, 0.4, 0],
  [0.4, 0.8, 0.25, 0.4, 0],
  [0, 0, 0, 0, 0],
  [0.3, 0.9, 0.2, 0.2, 0.4],
  [0.5, 1, 0.2, 0.2, 0],
  [0.5, 1, 0.4, 0.2, 0.3],
  [0.4, 0.4, 0.4, 0.2, 0.4],
  [0.4, 0.4, 0.4, 0.2, 0.3],
];

function initDrumMachine() {
  kick = kickBuffers[Math.floor(Math.random() * kickBuffers.length)];
  chh = chhBuffers[Math.floor(Math.random() * chhBuffers.length)];
  snare = snareBuffers[Math.floor(Math.random() * snareBuffers.length)];
  ohh = ohhBuffers[Math.floor(Math.random() * ohhBuffers.length)];
  cl = clBuffers[Math.floor(Math.random() * clBuffers.length)];
  cy = cyBuffers[0];
}

function initScale() {
  scale = [];
  allNotes = [];
  bassScale = [];
  bassNotes = [];
  chords = [];
  frequencies = [];
  bassFrequencies = [];
  chordsFrequencies = [];
  melodyFrequencies = [];
  melodyNotes = [];
  rootNote = chromaticScale[Math.floor(Math.random() * chromaticScale.length)];
  modeOffset = modeOffsets[Math.floor(Math.random() * modeOffsets.length)];
  scale = createMode(rootNote, modeOffset);
  bassScale = [scale[0], scale[2], scale[4], scale[6]];
  chords = [
    [scale[0] + "2", scale[2] + "2", scale[4] + "2"],
    [scale[0] + "2", scale[2] + "2", scale[6] + "2"],
    [scale[0] + "2", scale[4] + "2", scale[1] + "3"],
  ];
  melodyNotes = [
    scale[0] + "3",
    scale[2] + "3",
    scale[3] + "3",
    scale[4] + "3",
    scale[6] + "3",
    scale[0] + "4",
    scale[2] + "4",
    scale[3] + "4",
    scale[4] + "4",
    scale[6] + "4",
  ];
  for (const octave of octaves) {
    for (const note of scale) {
      allNotes.push(`${note}${octave}`);
    }
  }

  for (const bassOctave of bassOctaves) {
    for (const note of bassScale) {
      bassNotes.push(`${note}${bassOctave}`);
    }
  }

  frequencies = allNotes.map((note) => {
    const frequency = NOTES_JSON[note];
    return frequency;
  });

  melodyFrequencies = melodyNotes.map((note) => {
    const frequency = NOTES_JSON[note];
    return frequency;
  });

  bassFrequencies = bassNotes.map((note) => {
    const frequency = NOTES_JSON[note];
    return frequency;
  });

  chordsFrequencies = chords.map((chord) => {
    let frequency = [];
    for (let i = 0; i < chord.length; i++) {
      frequency.push(NOTES_JSON[chord[i]]);
    }
    return frequency;
  });
}

function createBassAndChords() {
  bassFrequencies = [];
  chordsFrequencies = [];
  melodyFrequencies = [];

  let randomIndex = Math.floor(Math.random() * 7);

  let bassFrequencesSequences = [
    [frequencies[7], frequencies[9], frequencies[11], frequencies[13]],
    [frequencies[8], frequencies[10], frequencies[12], frequencies[14]],
    [frequencies[9], frequencies[11], frequencies[13], frequencies[15]],
    [frequencies[3], frequencies[5], frequencies[7], frequencies[9]],
    [frequencies[4], frequencies[6], frequencies[8], frequencies[10]],
    [frequencies[5], frequencies[7], frequencies[9], frequencies[11]],
    [frequencies[6], frequencies[1], frequencies[3], frequencies[5]],
  ];

  let chordsFrequenciesSequences = [
    [
      [frequencies[14], frequencies[16], frequencies[18]],
      [frequencies[14], frequencies[16], frequencies[20]],
    ],
    [
      [frequencies[15], frequencies[17], frequencies[19]],
      [frequencies[15], frequencies[17], frequencies[21]],
    ],
    [
      [frequencies[16], frequencies[18], frequencies[20]],
      [frequencies[16], frequencies[18], frequencies[22]],
    ],
    [
      [frequencies[10], frequencies[12], frequencies[14]],
      [frequencies[10], frequencies[12], frequencies[16]],
    ],
    [
      [frequencies[11], frequencies[13], frequencies[15]],
      [frequencies[11], frequencies[13], frequencies[17]],
    ],
    [
      [frequencies[12], frequencies[14], frequencies[16]],
      [frequencies[12], frequencies[14], frequencies[18]],
    ],
    [
      [frequencies[13], frequencies[15], frequencies[17]],
      [frequencies[13], frequencies[15], frequencies[19]],
    ],
  ];

  let melodyFrequenciesSequences = [
    [
      frequencies[14],
      frequencies[16],
      frequencies[17],
      frequencies[18],
      frequencies[20],
    ],
    [
      frequencies[15],
      frequencies[17],
      frequencies[18],
      frequencies[19],
      frequencies[21],
    ],
    [
      frequencies[16],
      frequencies[18],
      frequencies[19],
      frequencies[20],
      frequencies[22],
    ],
    [
      frequencies[10],
      frequencies[12],
      frequencies[13],
      frequencies[14],
      frequencies[16],
    ],
    [
      frequencies[11],
      frequencies[13],
      frequencies[14],
      frequencies[15],
      frequencies[17],
    ],
    [
      frequencies[12],
      frequencies[14],
      frequencies[15],
      frequencies[16],
      frequencies[18],
    ],
    [
      frequencies[13],
      frequencies[15],
      frequencies[16],
      frequencies[17],
      frequencies[19],
    ],
  ];

  bassFrequencies = bassFrequencesSequences[randomIndex];
  chordsFrequencies = chordsFrequenciesSequences[randomIndex];
  melodyFrequencies = melodyFrequenciesSequences[randomIndex];
}

function initTime() {
  const numbers = [4, 5];
  timeSignature = numbers[Math.floor(Math.random() * numbers.length)] * 4;
  decayTime = 0.1;
  delayNode.delayTime.value = 6000 / bpm / timeSignature / 8 / 10;
  time = tempoToMilliseconds(bpm, timeSignature / 4);
}

function createMode(tonic, modeOffsets) {
  let mode = [];
  let currentNoteIndex = chromaticScale.indexOf(tonic);
  for (let offset of modeOffsets) {
    let currentNote =
      chromaticScale[(currentNoteIndex + offset) % chromaticScale.length];
    mode.push(currentNote);
  }
  return mode;
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

function playBass(frequency, duration, filter) {
  let oscillator = audioCtx.createOscillator();
  let oscillator2 = audioCtx.createOscillator();
  let oscillateurGain = audioCtx.createGain();
  let oscillateur2Gain = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator2.type = "sawtooth";

  filter.type = "lowpass";
  filter.frequency.value = bassFilterFrequency;
  filter.Q.value = 10;

  filter.frequency.setValueAtTime(filter.frequency.value, audioCtx.currentTime);

  filter.frequency.linearRampToValueAtTime(
    filter.frequency.value,
    audioCtx.currentTime + attackTime
  );
  filter.frequency.linearRampToValueAtTime(
    bassFilterFrequencyArrived,
    audioCtx.currentTime + attackTime + decayTime
  );

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

  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  oscillator2.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  oscillator2.start(audioCtx.currentTime);
  oscillator2.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    oscillateurGain.disconnect();
    oscillateurGain = null;
    oscillator = null;
    oscillator2.disconnect();
    oscillateur2Gain.disconnect();
    oscillateur2Gain = null;
    oscillator2 = null;
  }, duration * 1000);
}

function playChord(frequencies, duration, filter) {
  let oscillator = audioCtx.createOscillator();
  let oscillator2 = audioCtx.createOscillator();
  let oscillator3 = audioCtx.createOscillator();
  let oscillateurGain = audioCtx.createGain();
  let oscillateur2Gain = audioCtx.createGain();
  let oscillateur3Gain = audioCtx.createGain();

  oscillator.type = "sawtooth";
  oscillator2.type = "sawtooth";
  oscillator3.type = "sawtooth";

  filter.type = "lowpass";
  filter.frequency.value = chordFilterFrequency;
  filter.Q.value = 10;

  filter.frequency.setValueAtTime(filter.frequency.value, audioCtx.currentTime);

  filter.frequency.linearRampToValueAtTime(
    filter.frequency.value,
    audioCtx.currentTime + attackTime
  );
  filter.frequency.linearRampToValueAtTime(
    chordFilterFrequencyArrived,
    audioCtx.currentTime + attackTime + decayTime
  );

  oscillateurGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  oscillateurGain.gain.linearRampToValueAtTime(
    0,
    audioCtx.currentTime + duration / 2
  );
  oscillateur2Gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  oscillateur2Gain.gain.linearRampToValueAtTime(
    0,
    audioCtx.currentTime + duration / 2
  );
  oscillateur3Gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  oscillateur3Gain.gain.linearRampToValueAtTime(
    0,
    audioCtx.currentTime + duration / 2
  );

  oscillator.connect(oscillateurGain);
  oscillator2.connect(oscillateur2Gain);
  oscillator3.connect(oscillateur3Gain);
  oscillateurGain.connect(filter);
  oscillateur2Gain.connect(filter);
  oscillateur3Gain.connect(filter);

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

  setTimeout(() => {
    oscillator.disconnect();
    oscillateurGain.disconnect();
    oscillateurGain = null;
    oscillator = null;
    oscillator2.disconnect();
    oscillateur2Gain.disconnect();
    oscillateurGain = null;
    oscillator2 = null;
    oscillator3.disconnect();
    oscillateur3Gain.disconnect();
    oscillateur3Gain = null;
    oscillator3 = null;
  }, duration * 1000);
}

function playNote(frequency, duration, filter) {
  let oscillator = audioCtx.createOscillator();
  let oscillateurGain = audioCtx.createGain();

  oscillator.type = "sawtooth";

  filter.type = "lowpass";
  filter.frequency.value = noteFilterFrequency;
  filter.Q.value = 10;

  filter.frequency.setValueAtTime(filter.frequency.value, audioCtx.currentTime);

  filter.frequency.linearRampToValueAtTime(
    filter.frequency.value,
    audioCtx.currentTime + attackTime
  );
  filter.frequency.linearRampToValueAtTime(
    noteFilterFrequencyArrived,
    audioCtx.currentTime + attackTime + decayTime
  );

  oscillateurGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  oscillateurGain.gain.linearRampToValueAtTime(
    0,
    audioCtx.currentTime + duration
  );

  oscillator.connect(oscillateurGain);
  oscillateurGain.connect(filter);

  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  oscillator.start(audioCtx.currentTime);

  oscillator.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    oscillateurGain.disconnect();
    oscillateurGain = null;
    oscillator = null;
  }, duration * 1000);
}

function playMelody(frequency, duration, filter) {
  let oscillator = audioCtx.createOscillator();
  let oscillateurGain = audioCtx.createGain();

  oscillator.type = "square";

  filter.type = "lowpass";
  filter.frequency.value = melodyFilterFrequency;
  filter.Q.value = 10;

  filter.frequency.setValueAtTime(filter.frequency.value, audioCtx.currentTime);

  filter.frequency.linearRampToValueAtTime(
    filter.frequency.value,
    audioCtx.currentTime + attackTime
  );
  filter.frequency.linearRampToValueAtTime(
    melodyFilterFrequencyArrived,
    audioCtx.currentTime + attackTime + decayTime
  );

  oscillateurGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  oscillateurGain.gain.linearRampToValueAtTime(
    0,
    audioCtx.currentTime + duration
  );

  oscillator.connect(oscillateurGain);
  oscillateurGain.connect(filter);

  oscillator.frequency.setValueAtTime(frequency * 2, audioCtx.currentTime);

  oscillator.start(audioCtx.currentTime);

  oscillator.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    oscillateurGain.disconnect();
    oscillateurGain = null;
    oscillator = null;
  }, duration * 1000);
}

function playSequence() {
  draw();
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
        randomizer = Math.random();
        if (currentSongDuration === 4) {
          generateNextMusicalColor();
        }
        if (currentSongDuration > 6) {
          let random = Math.random();
          if (random < 1 / 6) {
            createBassAndChords();
            generateNextMusicalColor();
          } else if (random >= 1 / 6 && random < 3 / 6) {
            generateNextMusicalColor();
          } else if (random >= 3 / 6 && random < 5 / 6) {
            noteArray = noteThemeArray;
            bassArray = bassThemeArray;
            chordArray = chordThemeArray;
            melodyArray = melodyThemeArray;
          }
        }
      }
      currentMeasure = 0;
      currentSongDuration++;
      if (currentSongDuration > 0) {
        playPercussionWithVelocity(cy, 1);
      }
    }
    if (currentSongDuration === songDuration) {
      currentStep = 0;
      currentSongDuration = 0;
      currentMeasure = 0;
      currentSong++;
      initTime();
      initScale();
      initDrumMachine();
      randomIntro();
      createTheme();
      if (currentSong === songs) {
        resetCurrentTimeDatas();
        initTime();
        initScale();
        initDrumMachine();
        randomIntro();
        createTheme();
      }
    }
  }
  if (
    kicksArray[currentStep] ||
    (currentStep == 0 && currentSongDuration > 0)
  ) {
    playPercussionWithVelocity(kick, 1);
  }
  if (chhsArray[currentStep]) {
    playPercussionWithVelocity(
      chh,
      velocities[Math.floor(Math.random() * velocities.length)]
    );
  }
  if (snaresArray[currentStep]) {
    playPercussionWithVelocity(
      snare,
      velocities[Math.floor(Math.random() * velocities.length)]
    );
  }
  if (ohhsArray[currentStep]) {
    playPercussionWithVelocity(
      ohh,
      velocities[Math.floor(Math.random() * velocities.length)]
    );
  }
  if (clsArray[currentStep]) {
    playPercussionWithVelocity(
      cl,
      velocities[Math.floor(Math.random() * velocities.length)]
    );
  }
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
  if (randomizer < 1 / 3) {
    if (Math.random() < 0.5) {
      if (noteArray[currentStep] != null) {
        playNote(
          noteArray[currentStep].note,
          noteArray[currentStep].duration,
          noteFilter
        );
      }
    } else {
      if (melodyArray[currentStep] != null) {
        playMelody(
          melodyArray[currentStep].note,
          melodyArray[currentStep].duration,
          melodyFilter
        );
      }
    }
  } else if (randomizer >= 1 / 3 && randomizer < 2 / 3) {
    if (noteArray[currentStep] != null) {
      playNote(
        noteArray[currentStep].note,
        noteArray[currentStep].duration,
        noteFilter
      );
    }
  } else if (randomizer >= 2 / 3 && randomizer < 1) {
    if (melodyArray[currentStep] != null) {
      playMelody(
        melodyArray[currentStep].note,
        melodyArray[currentStep].duration,
        melodyFilter
      );
    }
  }
  updateDisplayControl();
}

function updateDisplayControl() {
  curentStepControl.innerHTML = "Step: " + (currentStep + 1);
  curentMeasureControl.innerHTML = "Measure: " + (currentMeasure + 1);
  curentSongDurationControl.innerHTML =
    "Current song duration: " + (currentSongDuration + 1) + "/" + songDuration;
  curentSongControl.innerHTML = "Song: " + (currentSong + 1);
  currentScaleControl.innerHTML = "Scale: " + scale;
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

function tempoToMilliseconds(bpm, timeSignature) {
  return (60 * 1000) / (bpm * timeSignature);
}

function loop() {
  randomIntro();
  createTheme();
  timer.callback = playSequence;
  timer.timeInterval = time;
  timer.errorCallback = "error";
  timer.start();
}

function randomIntro() {
  kicksArray = [];
  chhsArray = [];
  snaresArray = [];
  clsArray = [];
  ohhsArray = [];

  let randomIndex = Math.floor(Math.random() * probabilityValues.length);

  for (let i = 0; i < timeSignature; i++) {
    chhsArray.push(Math.random() < probabilityValues[randomIndex][1]);
  }
}

function randomRiddim() {
  kicksArray = [];
  chhsArray = [];
  snaresArray = [];
  clsArray = [];
  ohhsArray = [];

  let randomIndex = Math.floor(Math.random() * probabilityValues.length);

  for (let i = 0; i < timeSignature; i++) {
    kicksArray.push(Math.random() < probabilityValues[randomIndex][0]);
    chhsArray.push(Math.random() < probabilityValues[randomIndex][1]);
    snaresArray.push(Math.random() < probabilityValues[randomIndex][2]);
    clsArray.push(Math.random() < probabilityValues[randomIndex][3]);
    ohhsArray.push(Math.random() < probabilityValues[randomIndex][4]);
  }
}

function randomBreak() {
  kicksArray = [];
  chhsArray = [];
  snaresArray = [];
  clsArray = [];
  ohhsArray = [];

  let randomIndex = Math.floor(Math.random() * probabilityValues.length);

  for (let i = 0; i < timeSignature; i++) {
    kicksArray.push(Math.random() < probabilityValues[randomIndex][0]);
    chhsArray.push(Math.random() < probabilityValues[randomIndex][1]);
    snaresArray.push(Math.random() < probabilityValues[randomIndex][2]);
    clsArray.push(Math.random() < probabilityValues[randomIndex][3]);
    ohhsArray.push(Math.random() < probabilityValues[randomIndex][4]);
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
      if (Math.random() < 0.6) {
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
      if (Math.random() < 0.7) {
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

function start() {
  delayNode.connect(audioCtx.destination);
  bassFilter.connect(audioCtx.destination);
  chordFilter.connect(audioCtx.destination);
  noteFilter.connect(audioCtx.destination);
  melodyFilter.connect(audioCtx.destination);
  initTime();
  initDrumMachine();
  initScale();
  loop();
}

function resetCurrentTimeDatas() {
  currentStep = 0;
  currentMeasure = 0;
  currentSongDuration = 0;
  currentSong = 0;
}

function stopSound() {
  delayNode.disconnect();
  bassFilter.disconnect();
  chordFilter.disconnect();
  noteFilter.disconnect();
  melodyFilter.disconnect();
  resetCurrentTimeDatas();
  updateDisplayControl();
  stopDraw();
  timer.stop();
}

play.addEventListener("click", () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    start();
  } else {
    stopSound();
  }
});

stop.addEventListener("click", () => {
  isPlaying = false;
  stopSound();
});

let angle = 0;
let radius = 0;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = getRandomColor();

  // Boucle de dessin de la spirale
  for (var i = 0; i < 100; i++) {
    // Calcul de la position du prochain point de la spirale
    let x = centerX + Math.random() * radius * Math.cos(angle);
    let y = centerY + Math.random() * radius * Math.sin(angle);
    // Appliquer une rotation basée sur l'angle de la spirale
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.translate(-centerX, -centerY);

    // Dessin du segment de ligne entre ce point et le point précédent
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(centerX, centerY);
    ctx.stroke();

    // Annuler la rotation
    ctx.restore();

    // Mise à jour des valeurs
    radius += 2;
    angle += 0.1;
  }
}

function stopDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

updateDisplayControl();
