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
  dorianModeOffsets,
  lydianModeOffsets,
  ionianModeOffsets,
  mixolydianModeOffsets,
  arabian,
  gipsy,
  harmonicMinor,
  arabianDorian,
];

const timer = new Timer();
const bassFilter = audioCtx.createBiquadFilter();
const noteFilter = audioCtx.createBiquadFilter();
const chordFilter = audioCtx.createBiquadFilter();
const melodyFilter = audioCtx.createBiquadFilter();
const delayNode = audioCtx.createDelay();
const feedbackGainNode = audioCtx.createGain();
const octaves = [3, 4];
const bassOctaves = [2];
const songs = 10;
const measures = 8;
const songDuration = measures * 5;
const play = document.getElementById("play");
const stop = document.getElementById("stop");
const canvas = document.getElementById("canva");
const ctx = canvas.getContext("2d");
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
let kickBuffer;
let chhBuffer;
let ohhBuffer;
let clBuffer;
let snareBuffer;
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
let bassFrequencies = [];
let chordsFrequencies = [];
let modeOffset = [];
let rootNote;
let isPlaying = false;
let feedbackValueDelay = 0;
let delayTime = 0.5;
let randomizer;
let bassFilterFrequency = 6000;
let bassFilterFrequencyArrived = bassFilterFrequency / 4;
let chordFilterFrequency = 4000;
let chordFilterFrequencyArrived = chordFilterFrequency / 2;
let noteFilterFrequency = 4000;
let noteFilterFrequencyArrived = noteFilterFrequency / 2;
let melodyFilterFrequency = 6000;
let melodyFilterFrequencyArrived = melodyFilterFrequency / 2;

delayNode.delayTime.value = delayTime;
feedbackGainNode.gain.value = feedbackValueDelay;

function initDrumMachine() {
  kick = kickBuffers[Math.floor(Math.random() * kickBuffers.length)];
  chh = chhBuffers[Math.floor(Math.random() * chhBuffers.length)];
  snare = snareBuffers[Math.floor(Math.random() * snareBuffers.length)];
  ohh = ohhBuffers[Math.floor(Math.random() * ohhBuffers.length)];
  cl = clBuffers[Math.floor(Math.random() * clBuffers.length)];
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
  rootNote = chromaticScale[Math.floor(Math.random() * chromaticScale.length)];
  modeOffset = modeOffsets[Math.floor(Math.random() * modeOffsets.length)];
  scale = createMode(rootNote, modeOffset);
  bassScale = [scale[0], scale[2], scale[4], scale[3], scale[5], scale[6]];
  chords = [
    [scale[0] + "3", scale[2] + "3", scale[4] + "3"],
    [scale[0] + "3", scale[2] + "3", scale[6] + "3"],
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

function getRandomValueWithFollowing(arr) {
  // Récupération de la valeur aléatoire
  var randomIndex = Math.floor(Math.random() * arr.length);
  var randomValue = arr[randomIndex];

  // Récupération des valeurs suivantes
  var values = [randomValue];
  values.push();
  for (var i = 1; i <= 3; i++) {
    var index = (randomIndex + i * 2) % arr.length;
    values.push(arr[index]);
  }

  // Retour de la valeur aléatoire et des valeurs suivantes
  return values;
}

function createBassAndChords() {
  bassFrequencies = [];
  chordsFrequencies = [];
  bassScale = getRandomValueWithFollowing(scale);
  bassNotes = [];

  chords = [
    [bassScale[0] + "3", bassScale[1] + "3", bassScale[2] + "3"],
    [bassScale[0] + "3", bassScale[1] + "3", bassScale[3] + "3"],
  ];

  for (const bassOctave of bassOctaves) {
    for (const note of bassScale) {
      bassNotes.push(`${note}${bassOctave}`);
    }
  }

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

function initTime() {
  const numbers = [2, 3, 4];
  timeSignature = numbers[Math.floor(Math.random() * numbers.length)] * 4;
  decayTime = 0.2;
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

  oscillateurGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  oscillateurGain.gain.linearRampToValueAtTime(
    0.1,
    audioCtx.currentTime + duration
  );

  oscillateur2Gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  oscillateur2Gain.gain.linearRampToValueAtTime(
    0.1,
    audioCtx.currentTime + duration
  );

  oscillator.connect(oscillateurGain);
  oscillateurGain.connect(audioCtx.destination);

  oscillator2.connect(oscillateur2Gain);
  oscillateur2Gain.connect(filter);
  filter.connect(delayNode);
  delayNode.connect(feedbackGainNode);
  feedbackGainNode.connect(delayNode);

  filter.connect(audioCtx.destination);
  delayNode.connect(audioCtx.destination);

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
  filter.Q.value = 5;

  filter.frequency.setValueAtTime(filter.frequency.value, audioCtx.currentTime);

  filter.frequency.linearRampToValueAtTime(
    filter.frequency.value,
    audioCtx.currentTime + attackTime
  );
  filter.frequency.linearRampToValueAtTime(
    chordFilterFrequencyArrived,
    audioCtx.currentTime + attackTime + decayTime
  );

  oscillateurGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  oscillateurGain.gain.linearRampToValueAtTime(
    0,
    audioCtx.currentTime + duration / 2
  );
  oscillateur2Gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  oscillateur2Gain.gain.linearRampToValueAtTime(
    0,
    audioCtx.currentTime + duration / 2
  );
  oscillateur3Gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
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
  filter.connect(delayNode);
  delayNode.connect(feedbackGainNode);
  feedbackGainNode.connect(delayNode);

  filter.connect(audioCtx.destination);
  delayNode.connect(audioCtx.destination);

  oscillator.frequency.setValueAtTime(frequencies[0], audioCtx.currentTime);
  oscillator2.frequency.setValueAtTime(frequencies[1], audioCtx.currentTime);
  oscillator3.frequency.setValueAtTime(frequencies[2], audioCtx.currentTime);

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
  filter.connect(delayNode);
  delayNode.connect(feedbackGainNode);
  feedbackGainNode.connect(delayNode);

  filter.connect(audioCtx.destination);
  delayNode.connect(audioCtx.destination);

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

  oscillator.type = "sawtooth";

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

  oscillateurGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  oscillateurGain.gain.linearRampToValueAtTime(
    0,
    audioCtx.currentTime + duration / 2
  );

  oscillator.connect(oscillateurGain);
  oscillateurGain.connect(filter);
  filter.connect(delayNode);
  delayNode.connect(feedbackGainNode);
  feedbackGainNode.connect(delayNode);

  filter.connect(audioCtx.destination);
  delayNode.connect(audioCtx.destination);

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

function playSequence() {
  draw();
  if (currentStep < timeSignature - 1) {
    currentStep++;
  } else {
    currentStep = 0;
    currentMeasure++;
    if (
      currentMeasure === measures / 2 &&
      Math.random() < 0.3 &&
      currentSongDuration > 4
    ) {
      createBassAndChords();
      noteArray = generateRandomNoteSequence(frequencies);
      bassArray = generateRandomBass(bassFrequencies);
      chordArray = generateRandomChordSequence(chordsFrequencies);
      melodyArray = generateRandomMelody(frequencies);
      let gainNode = audioCtx.createGain();
      cy = audioCtx.createBufferSource();
      cy.buffer = cyBuffers[0];
      gainNode.gain.value = 1;
      cy.connect(gainNode).connect(audioCtx.destination);
      cy.start(audioCtx.currentTime);
      cy.stop(audioCtx.currentTime + timeSignature);
      setTimeout(() => {
        cy.disconnect();
        gainNode.disconnect();
      }, timeSignature * 100);
    }
    if (currentMeasure === measures - 1) {
      randomBreak();
    }
    if (currentMeasure === measures) {
      randomRiddim();
      if (currentSongDuration > 1) {
        noteArray = [];
        bassArray = [];
        chordArray = [];
        melodyArray = [];
        if (Math.random() < 0.1 && currentSongDuration > 4) {
          initTime();
        }
        if (Math.random() < 0.03 && currentSongDuration > 4) {
          initScale();
        }
        if (currentSongDuration > 4 && Math.random() < 0.7) {
          createBassAndChords();
        }
        noteArray = generateRandomNoteSequence(frequencies);
        bassArray = generateRandomBass(bassFrequencies);
        chordArray = generateRandomChordSequence(chordsFrequencies);
        melodyArray = generateRandomMelody(frequencies);
        if (Math.random() < 0.2 && currentSongDuration > 12) {
          noteArray = noteThemeArray;
          bassArray = bassThemeArray;
          chordArray = chordThemeArray;
          melodyArray = melodyThemeArray;
        }
      }
      currentMeasure = 0;
      currentSongDuration++;
      if (currentSongDuration > 0) {
        let gainNode = audioCtx.createGain();
        cy = audioCtx.createBufferSource();
        cy.buffer = cyBuffers[0];
        gainNode.gain.value = 1;
        cy.connect(gainNode).connect(audioCtx.destination);
        cy.start(audioCtx.currentTime);
        cy.stop(audioCtx.currentTime + timeSignature);
        setTimeout(() => {
          cy.disconnect();
          gainNode.disconnect();
        }, timeSignature * 100);
      }
    }
    if (currentSongDuration === songDuration) {
      currentSongDuration = 0;
      currentMeasure = 0;
      currentSong++;
      initTime();
      initScale();
      initDrumMachine();
      noteThemeArray = generateRandomNoteSequence(frequencies);
      noteArray = noteThemeArray;
      bassThemeArray = generateRandomBass(bassFrequencies);
      bassArray = bassThemeArray;
      chordThemeArray = generateRandomChordSequence(chordsFrequencies);
      chordArray = chordThemeArray;
      melodyThemeArray = generateRandomMelody(frequencies);
      melodyArray = melodyThemeArray;
      if (currentSong === songs) {
        currentSong = 0;
        timer.stop();
      }
    }
  }
  if (
    currentSongDuration > 0 ||
    (currentSongDuration == 0 && currentMeasure === measures - 1)
  ) {
    if (kicksArray[currentStep] || currentStep == 0) {
      let gainNode = audioCtx.createGain();
      kickBuffer = audioCtx.createBufferSource();
      kickBuffer.buffer = kick;
      gainNode.gain.value = 1;
      kickBuffer.connect(gainNode).connect(audioCtx.destination);
      kickBuffer.start(audioCtx.currentTime);
      kickBuffer.stop(audioCtx.currentTime + timeSignature);
      setTimeout(() => {
        kickBuffer.disconnect();
        gainNode.disconnect();
      }, timeSignature * 100);
    }
    if (chhsArray[currentStep]) {
      let gainNode = audioCtx.createGain();
      chhBuffer = audioCtx.createBufferSource();
      chhBuffer.buffer = chh;
      gainNode.gain.value =
        velocities[Math.floor(Math.random() * velocities.length)];
      chhBuffer.connect(gainNode).connect(audioCtx.destination);
      chhBuffer.start(audioCtx.currentTime);
      chhBuffer.stop(audioCtx.currentTime + timeSignature);
      setTimeout(() => {
        chhBuffer.disconnect();
        gainNode.disconnect();
      }, timeSignature * 100);
    }
    if (snaresArray[currentStep]) {
      let gainNode = audioCtx.createGain();
      snareBuffer = audioCtx.createBufferSource();
      snareBuffer.buffer = snare;
      gainNode.gain.value =
        velocities[Math.floor(Math.random() * velocities.length)];
      snareBuffer.connect(gainNode).connect(audioCtx.destination);
      snareBuffer.start(audioCtx.currentTime);
      snareBuffer.stop(audioCtx.currentTime + timeSignature);
      setTimeout(() => {
        snareBuffer.disconnect();
        gainNode.disconnect();
      }, timeSignature * 100);
    }
    if (ohhsArray[currentStep]) {
      let gainNode = audioCtx.createGain();
      ohhBuffer = audioCtx.createBufferSource();
      ohhBuffer.buffer = ohh;
      gainNode.gain.value =
        velocities[Math.floor(Math.random() * velocities.length)];
      ohhBuffer.connect(gainNode).connect(audioCtx.destination);
      ohhBuffer.start(audioCtx.currentTime);
      ohhBuffer.stop(audioCtx.currentTime + timeSignature);
      setTimeout(() => {
        ohhBuffer.disconnect();
        gainNode.disconnect();
      }, timeSignature * 100);
    }
    if (clsArray[currentStep]) {
      let gainNode = audioCtx.createGain();
      clBuffer = audioCtx.createBufferSource();
      clBuffer.buffer = cl;
      gainNode.gain.value =
        velocities[Math.floor(Math.random() * velocities.length)];
      clBuffer.connect(gainNode).connect(audioCtx.destination);
      clBuffer.start(audioCtx.currentTime);
      clBuffer.stop(audioCtx.currentTime + timeSignature);
      setTimeout(() => {
        clBuffer.disconnect();
        gainNode.disconnect();
      }, timeSignature * 100);
    }
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
  if (chordArray[currentStep].note) {
    playChord(
      chordArray[currentStep].note,
      chordArray[currentStep].duration,
      chordFilter
    );
  }
  randomizer = Math.random();
  if (randomizer < 0.8) {
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
  } else if (randomizer >= 0.8 && randomizer < 0.9) {
    if (noteArray[currentStep] != null) {
      playNote(
        noteArray[currentStep].note,
        noteArray[currentStep].duration,
        noteFilter
      );
    }
  } else if (randomizer >= 0.9) {
    if (melodyArray[currentStep] != null) {
      playMelody(
        melodyArray[currentStep].note,
        melodyArray[currentStep].duration,
        melodyFilter
      );
    }
  }
}

function loop() {
  randomRiddim();
  noteThemeArray = generateRandomNoteSequence(frequencies);
  noteArray = noteThemeArray;
  bassThemeArray = generateRandomBass(bassFrequencies);
  bassArray = bassThemeArray;
  chordThemeArray = generateRandomChordSequence(chordsFrequencies);
  chordArray = chordThemeArray;
  melodyThemeArray = generateRandomMelody(frequencies);
  melodyArray = melodyThemeArray;
  timer.callback = playSequence;
  timer.timeInterval = (6000 / bpm / 4) * 10;
  timer.errorCallback = "error";
  timer.start();
}

function randomRiddim() {
  kicksArray = [];
  chhsArray = [];
  snaresArray = [];
  clsArray = [];
  ohhsArray = [];
  const randomIndex = Math.floor(Math.random() * 10);
  switch (randomIndex) {
    case 0:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(Math.random() < 0.3);
        chhsArray.push(Math.random() < 0.7);
        snaresArray.push(Math.random() < 0.3);
        clsArray.push(Math.random() < 0.2);
        ohhsArray.push(Math.random() < 0.2);
      }
      break;
    case 1:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(Math.random() < 0.3);
        chhsArray.push(Math.random() < 0.7);
        snaresArray.push(Math.random() < 0.3);
        clsArray.push(Math.random() < 0.2);
        ohhsArray.push(false);
      }
      break;
    case 2:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(Math.random() < 0.3);
        chhsArray.push(false);
        snaresArray.push(Math.random() < 0.5);
        clsArray.push(Math.random() < 0.4);
        ohhsArray.push(false);
      }
      break;
    case 3:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(false);
        chhsArray.push(Math.random() < 0.25);
        snaresArray.push(false);
        clsArray.push(Math.random() < 0.4);
        ohhsArray.push(false);
      }
      break;
    case 4:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(false);
        chhsArray.push(false);
        snaresArray.push(false);
        clsArray.push(false);
        ohhsArray.push(false);
      }
      break;
    default:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(Math.random() < 0.3);
        chhsArray.push(Math.random() < 0.9);
        snaresArray.push(Math.random() < 0.2);
        clsArray.push(Math.random() < 0.2);
        ohhsArray.push(Math.random() < 0.1);
      }
      break;
  }
}

function randomBreak() {
  kicksArray = [];
  chhsArray = [];
  snaresArray = [];
  clsArray = [];
  ohhsArray = [];
  const randomIndex = Math.floor(Math.random() * 10);
  switch (randomIndex) {
    case 0:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(Math.random() < 0.5);
        chhsArray.push(false);
        snaresArray.push(false);
        clsArray.push(false);
        ohhsArray.push(false);
      }
      break;
    case 1:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(false);
        chhsArray.push(Math.random() < 0.5);
        snaresArray.push(false);
        clsArray.push(false);
        ohhsArray.push(false);
      }
      break;
    case 2:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(false);
        chhsArray.push(false);
        snaresArray.push(Math.random() < 0.5);
        clsArray.push(false);
        ohhsArray.push(false);
      }
      break;
    case 3:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(false);
        chhsArray.push(false);
        snaresArray.push(false);
        clsArray.push(Math.random() < 0.5);
        ohhsArray.push(false);
      }
      break;
    case 4:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(false);
        chhsArray.push(false);
        snaresArray.push(false);
        clsArray.push(false);
        ohhsArray.push(Math.random() < 0.5);
      }
      break;
    case 5:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(false);
        chhsArray.push(false);
        snaresArray.push(Math.random() < 0.5);
        clsArray.push(false);
        ohhsArray.push(Math.random() < 0.5);
      }
      break;
    case 6:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(Math.random() < 0.5);
        chhsArray.push(false);
        snaresArray.push(Math.random() < 0.5);
        clsArray.push(false);
        ohhsArray.push(false);
      }
      break;
    case 7:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(Math.random() < 0.5);
        chhsArray.push(false);
        snaresArray.push(false);
        clsArray.push(false);
        ohhsArray.push(Math.random() < 0.5);
      }
      break;
    case 8:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(Math.random() < 0.5);
        chhsArray.push(false);
        snaresArray.push(false);
        clsArray.push(Math.random() < 0.5);
        ohhsArray.push(false);
      }
      break;
    case 9:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(false);
        chhsArray.push(false);
        snaresArray.push(false);
        clsArray.push(false);
        ohhsArray.push(false);
      }
      break;
    default:
      for (let i = 0; i < timeSignature; i++) {
        kicksArray.push(Math.random() < 0.3);
        chhsArray.push(Math.random() < 0.7);
        snaresArray.push(Math.random() < 0.3);
        clsArray.push(Math.random() < 0.2);
        ohhsArray.push(Math.random() < 0.2);
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
      if (Math.random() < 0.3) {
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
      if (Math.random() < 0.25) {
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
  initTime();
  initDrumMachine();
  initScale();
  loop();
}

function stopSound() {
  currentMeasure = 0;
  currentSongDuration = 0;
  currentSong = 0;
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
