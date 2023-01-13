import { Timer } from "./Timer.js";

const frequencies = [
  220.0, 246.94, 261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25,
  587.33, 659.26, 698.46, 783.99, 880.0,
];
const audioCtx = new AudioContext();
const delay = audioCtx.createDelay();
const feedback = audioCtx.createGain();
const filter = audioCtx.createBiquadFilter();
const filterGain = audioCtx.createGain();
const bpm = 45;
const totalSteps = 16;
const measuresNumber = 8;
const timer = new Timer();
const start = document.getElementById("startSine");
const stop = document.getElementById("stopSine");

let melodyNotes = [];
let currentStep = 0;
let chords = [];
let fundamental = [];
let third = [];
let fifth = [];
let bass = [];
let currentMeasure = 0;
let isPlaying = false;

function createChords() {
  for (let i = 0; i < frequencies.length - 4; i++) {
    chords.push([frequencies[i], frequencies[i + 2], frequencies[i + 4]]);
  }
}

function initFX() {
  filter.frequency.value = 10000;
  filter.Q.value = 0;
  filterGain.gain.value = 0;
  delay.delayTime.value = 1;
  feedback.gain.value = 0.1;
}

function connect() {
  filter.connect(filterGain);
  filterGain.connect(delay);
  delay.connect(feedback);
  feedback.connect(audioCtx.destination);
  filter.connect(audioCtx.destination);
}

function disconnect() {
  filterGain.disconnect();
  filter.disconnect();
  delay.disconnect();
  feedback.disconnect();
}

function bassSynth(frequency, duration) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.connect(gain);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
  gain.connect(filter);
  oscillator.frequency.value = frequency / 2;
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    gain.disconnect();
  }, 1000);
}

function fundamentalSynth(frequency, duration) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.connect(gain);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
  gain.connect(filter);
  oscillator.frequency.value = frequency;
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    gain.disconnect();
  }, 1000);
}

function thirdSynth(frequency, duration) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.connect(gain);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
  gain.connect(filter);
  oscillator.frequency.value = frequency;
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    gain.disconnect();
  }, 1000);
}

function fifthSynth(frequency, duration) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.connect(gain);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
  gain.connect(filter);
  oscillator.frequency.value = frequency;
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    gain.disconnect();
  }, 1000);
}

function melodySynth(frequency, duration) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.connect(gain);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
  gain.connect(filter);
  oscillator.frequency.value = frequency;
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    gain.disconnect();
  }, 1000);
}

function generateRandomNoteSequence(frequencies) {
  const sequence = [];
  let random = Math.random();
  for (let i = 0; i < totalSteps; i++) {
    if (random < 0.05) {
      let note = false;
      let duration = "";
      sequence.push({ note, duration });
    } else {
      if (Math.random() < 0.4) {
        let note = frequencies[Math.floor(Math.random() * frequencies.length)];
        let duration = totalSteps / bpm;
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
      sequence[i].duration = totalSteps / bpm;
      let j = i + 1;
      while (sequence[j] && sequence[j].note === false) {
        sequence[i].duration += totalSteps / bpm;
        j++;
      }
    }
  }
  return sequence;
}

function generateNoteSequenceForChord(noteIndex) {
  const sequence = [];
  let random = Math.random();
  for (let i = 0; i < totalSteps; i++) {
    if (random < 0.05) {
      let note = false;
      let duration = "";
      sequence.push({ note, duration });
    } else {
      if (Math.random() < 0.5) {
        let note = frequencies[noteIndex];
        let duration = totalSteps / bpm;
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
      sequence[i].duration = totalSteps / bpm;
      let j = i + 1;
      while (sequence[j] && sequence[j].note === false) {
        sequence[i].duration += totalSteps / bpm;
        j++;
      }
    }
  }
  return sequence;
}

function generateNoteForBass(notesIndex) {
  const sequence = [];
  let random = Math.random();
  for (let i = 0; i < totalSteps; i++) {
    if (random < 0.05) {
      let note = false;
      let duration = "";
      sequence.push({ note, duration });
    } else {
      if (Math.random() < 0.5) {
        let note =
          frequencies[
            notesIndex[Math.floor(Math.random() * notesIndex.length)]
          ];
        let duration = totalSteps / bpm;
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
      sequence[i].duration = totalSteps / bpm;
      let j = i + 1;
      while (sequence[j] && sequence[j].note === false) {
        sequence[i].duration += totalSteps / bpm;
        j++;
      }
    }
  }
  return sequence;
}

function generateMelodySequence() {
  melodyNotes = generateRandomNoteSequence(frequencies);
}

function generateChordSequence(fundamentalNote) {
  fundamental = generateNoteSequenceForChord(fundamentalNote);
  third = generateNoteSequenceForChord(fundamentalNote + 2);
  fifth = generateNoteSequenceForChord(fundamentalNote + 4);
}

function generateBassSequence(notes) {
  bass = generateNoteForBass(notes);
}

function playNote(array, instrument) {
  if (array[currentStep] != null) {
    instrument(array[currentStep].note, array[currentStep].duration);
  }
}

function play() {
  playNote(melodyNotes, melodySynth);
  playNote(fundamental, fundamentalSynth);
  playNote(third, thirdSynth);
  playNote(fifth, fifthSynth);
  playNote(bass, bassSynth);
  currentStep++;
  if (currentStep === totalSteps) {
    currentStep = 0;
    currentMeasure++;
    if (currentMeasure === measuresNumber) {
      currentMeasure = 0;
      generateMelodySequence();
      generateChordSequence(0);
      generateBassSequence([0, 2, 4]);
    } else {
      let noteIndex = Math.floor(Math.random() * (frequencies.length / 2));
      generateMelodySequence();
      generateChordSequence(noteIndex);
      generateBassSequence([noteIndex, noteIndex + 2, noteIndex + 3]);
    }
  }
}

function startSine() {
  createChords();
  initFX();
  connect();
  generateMelodySequence();
  generateChordSequence(0);
  generateBassSequence([0, 2, 4]);
  timer._callback = play;
  timer._errorCallback = "error";
  timer._timeInterval = (6000 / bpm / 4) * 10;
  timer.start();
}

function stopSine() {
  timer.stop();
  disconnect();
}

start.addEventListener("click", () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    startSine();
  } else {
    stopSine();
  }
});

stop.addEventListener("click", () => {
  isPlaying = false;
  stopSine();
});
