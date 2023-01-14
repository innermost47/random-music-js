import { Enveloppe } from "./Enveloppe.js";
import { Mode } from "./Mode.js";
import { Synth } from "./Synth.js";
import { Timer } from "./Timer.js";
import {
  generateNoteForBass,
  generateNoteSequenceForChord,
  generateNotesForArpegiator,
  generateRandomNoteSequence,
} from "./utils.js";

const audioCtx = new AudioContext();
const delay = audioCtx.createDelay();
const feedback = audioCtx.createGain();
const filter = audioCtx.createBiquadFilter();
const filterGain = audioCtx.createGain();
const bpm = 90;
const totalSteps = 64;
const measuresNumber = 32;
const SINE = "sine";
const timer = new Timer();
const mode = new Mode();
const sineSynth = new Synth();
const sineEnveloppe = new Enveloppe();

let melodyNotes = [];
let currentStep = 0;
let chords = [];
let fundamental = [];
let third = [];
let fifth = [];
let bass = [];
let arpegio = [];
let currentMeasure = 0;
let frequencies = [];

function init() {
  mode.mode = "aeolian";
  mode.rootNote = "F";
  sineEnveloppe.attack = 0.1;
  sineEnveloppe.release = 0;
  sineSynth.audioCtx = audioCtx;
  sineSynth.audioDestination = filter;
  sineSynth.enveloppe = sineEnveloppe;
  sineSynth.type = SINE;
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
  feedback.gain.value = 0.05;
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
  sineSynth.disconnect();
}

function generateMelodySequence() {
  melodyNotes = generateRandomNoteSequence(frequencies, totalSteps, bpm);
}

function generateChordSequence(fundamentalNote) {
  fundamental = generateNoteSequenceForChord(
    frequencies,
    fundamentalNote,
    totalSteps,
    bpm
  );
  third = generateNoteSequenceForChord(
    frequencies,
    fundamentalNote + 2,
    totalSteps,
    bpm
  );
  fifth = generateNoteSequenceForChord(
    frequencies,
    fundamentalNote + 4,
    totalSteps,
    bpm
  );
}

function generateBassSequence(notes) {
  bass = generateNoteForBass(frequencies, notes, totalSteps, bpm);
}

function generateArpegiatorSequence(notes) {
  arpegio = generateNotesForArpegiator(frequencies, notes, totalSteps, bpm);
}

function playNote(array, instrument) {
  if (array[currentStep] != null) {
    instrument.play(array[currentStep].note, array[currentStep].duration);
  }
}

function play() {
  playNote(melodyNotes, sineSynth);
  playNote(fundamental, sineSynth);
  playNote(third, sineSynth);
  playNote(fifth, sineSynth);
  playNote(bass, sineSynth);
  playNote(arpegio, sineSynth);
  currentStep++;
  if (currentStep === totalSteps) {
    currentStep = 0;
    currentMeasure++;
    if (currentMeasure === measuresNumber) {
      currentMeasure = 0;
      generateMelodySequence();
      generateChordSequence(0);
      generateBassSequence([0, 2, 4]);
      generateArpegiatorSequence([14, 16, 18, 19]);
    } else {
      let noteIndex = Math.floor(Math.random() * (frequencies.length / 2));
      generateMelodySequence();
      generateChordSequence(noteIndex);
      generateBassSequence([noteIndex, noteIndex + 2, noteIndex + 3]);
      generateArpegiatorSequence([
        noteIndex,
        noteIndex + 2,
        noteIndex + 4,
        noteIndex + 5,
      ]);
    }
  }
}

function initSteps() {
  currentStep = 0;
  currentMeasure = 0;
}

export function startSine() {
  initSteps();
  init();
  createChords();
  initFX();
  connect();
  generateMelodySequence();
  generateChordSequence(0);
  generateArpegiatorSequence([14, 16, 18, 19]);
  timer._callback = play;
  timer._errorCallback = "error";
  timer._timeInterval = (6000 / bpm / 4) * 10;
  timer.start();
}

export function stopSine() {
  initSteps();
  timer.stop();
  disconnect();
}
