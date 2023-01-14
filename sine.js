import { Enveloppe } from "./Enveloppe.js";
import { Mode } from "./Mode.js";
import { Synth } from "./Synth.js";
import { Timer } from "./Timer.js";

const audioCtx = new AudioContext();
const delay = audioCtx.createDelay();
const feedback = audioCtx.createGain();
const filter = audioCtx.createBiquadFilter();
const filterGain = audioCtx.createGain();
const bpm = 45;
const totalSteps = 16;
const measuresNumber = 8;
const SINE = "sine";
const timer = new Timer();
const mode = new Mode();
const bassSynth = new Synth();
const fundamentalSynth = new Synth();
const thirdSynth = new Synth();
const fifthSynth = new Synth();
const melodySynth = new Synth();
const bassEnveloppe = new Enveloppe();
const fundamentalEnveloppe = new Enveloppe();
const thirdEnveloppe = new Enveloppe();
const fifthEnveloppe = new Enveloppe();
const melodyEnveloppe = new Enveloppe();

let melodyNotes = [];
let currentStep = 0;
let chords = [];
let fundamental = [];
let third = [];
let fifth = [];
let bass = [];
let currentMeasure = 0;
let frequencies = [];

function init() {
  mode.mode = "ionian";
  mode.rootNote = "A";
  bassEnveloppe.attack = 0.3;
  bassEnveloppe.release = 0;
  bassSynth.audioCtx = audioCtx;
  bassSynth.audioDestination = filter;
  bassSynth.enveloppe = bassEnveloppe;
  bassSynth.type = SINE;
  fundamentalEnveloppe.attack = 0.3;
  fundamentalEnveloppe.release = 0;
  fundamentalSynth.audioCtx = audioCtx;
  fundamentalSynth.audioDestination = filter;
  fundamentalSynth.enveloppe = bassEnveloppe;
  fundamentalSynth.type = SINE;
  thirdEnveloppe.attack = 0.3;
  thirdEnveloppe.release = 0;
  thirdSynth.audioCtx = audioCtx;
  thirdSynth.audioDestination = filter;
  thirdSynth.enveloppe = bassEnveloppe;
  thirdSynth.type = SINE;
  fifthEnveloppe.attack = 0.3;
  fifthEnveloppe.release = 0;
  fifthSynth.audioCtx = audioCtx;
  fifthSynth.audioDestination = filter;
  fifthSynth.enveloppe = bassEnveloppe;
  fifthSynth.type = SINE;
  melodyEnveloppe.attack = 0.3;
  melodyEnveloppe.release = 0;
  melodySynth.audioCtx = audioCtx;
  melodySynth.audioDestination = filter;
  melodySynth.enveloppe = bassEnveloppe;
  melodySynth.type = SINE;
  frequencies = mode.getFrequenciesFromMode([3, 4, 5]);
}

function createChords() {
  for (let i = 0; i < frequencies.length - 4; i++) {
    chords.push([frequencies[i], frequencies[i + 2], frequencies[i + 4]]);
  }
}

function initFX() {
  filter.frequency.value = 10000;
  filter.Q.value = 0;
  filterGain.gain.value = 1;
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
  bass.disconnect();
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
    instrument.play(array[currentStep].note, array[currentStep].duration);
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

export function startSine() {
  init();
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

export function stopSine() {
  timer.stop();
  disconnect();
}
