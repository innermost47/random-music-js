import { Timer } from "./src/Timer.js";
import { audioCtx } from "./utils/utils.js";

const kickBuffers = [];
const snareBuffers = [];
const chhBuffers = [];
const ohhBuffers = [];
const clBuffers = [];
const cyBuffers = [];
const convolver = audioCtx.createConvolver();
const frequencies = [
  220.0, 246.94, 261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25,
  587.33, 659.26, 698.46, 783.99, 880.0, 987.77,
];
const delay = audioCtx.createDelay();
const feedback = audioCtx.createGain();
const filter = audioCtx.createBiquadFilter();
const filterGain = audioCtx.createGain();
const lfo = audioCtx.createOscillator();
const lfoGain = audioCtx.createGain();
const distorsion = audioCtx.createWaveShaper();
const distorsionGain = audioCtx.createGain();
const master = audioCtx.createGain();
const drumMaster = audioCtx.createGain();
const synthMaster = audioCtx.createGain();
const reverbFilter = audioCtx.createBiquadFilter();
const reverbGain = audioCtx.createGain();
const analyzer = audioCtx.createAnalyser();
const bpm = 180;
const totalSteps = 64;
const measuresNumber = 8;
export const timer = new Timer();
const velocities = [0.3, 1];

let melodyNotes = [];
let currentStep = 0;
let chords = [];
let fundamental = [];
let third = [];
let fifth = [];
let bass = [];
let tb = [];
let sq = [];
let currentMeasure = 0;
let songDuration = 0;
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
let tempo = (6000 / bpm / 4) * 10;
let synthVolume = 0.1;
let randomizer = Math.random();
let isPaused = false;

lfo.start();

function updateDisplay() {
  const currentStepEl = document.getElementById("currentStep");
  const currentMeasureEl = document.getElementById("currentMeasure");
  const currentScaleEl = document.getElementById("currentScale");
  const currentSongDurationEl = document.getElementById("currentSongDuration");
  const currentSongEl = document.getElementById("currentSong");

  if (currentStepEl) currentStepEl.textContent = currentStep;
  if (currentMeasureEl) currentMeasureEl.textContent = currentMeasure;
  if (currentScaleEl) currentScaleEl.textContent = "A Minor";
  if (currentSongDurationEl)
    currentSongDurationEl.textContent = `${songDuration}`;
  if (currentSongEl)
    currentSongEl.textContent =
      songDuration > 0 ? `Measure ${songDuration}` : "Starting...";
}

function initBuffers(percussionName, percussionNameBuffers) {
  const requests = [];
  for (let i = 0; i < 1; i++) {
    const request = new XMLHttpRequest();
    request.open("GET", `/sounds/sine/${percussionName + i}.wav`, true);
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
}

const reverbUrl =
  "https://mdn.github.io/voice-change-o-matic/audio/concert-crowd.ogg";
const reverbBuffer = await fetch(reverbUrl).then((response) =>
  response.arrayBuffer()
);
const reverbImpulse = await audioCtx.decodeAudioData(reverbBuffer);
const reverbData = reverbImpulse.getChannelData(0);
const reverbDuration = 0.8;
const reverbLength = reverbData.length / reverbImpulse.sampleRate;
const ratio = reverbDuration / reverbLength;
const shortReverbData = new Float32Array(Math.round(reverbData.length * ratio));
shortReverbData.set(reverbData.subarray(0, shortReverbData.length));
const shortReverbBuffer = audioCtx.createBuffer(
  1,
  shortReverbData.length,
  reverbImpulse.sampleRate
);
shortReverbBuffer.getChannelData(0).set(shortReverbData);
analyzer.fftSize = 2048;

function makeDistortionCurve(amount) {
  let n_samples = 256,
    curve = new Float32Array(n_samples);
  for (let i = 0; i < n_samples; ++i) {
    let x = (i * 2) / n_samples - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

function initDrumMachine() {
  kick = kickBuffers[Math.floor(Math.random() * kickBuffers.length)];
  chh = chhBuffers[Math.floor(Math.random() * chhBuffers.length)];
  snare = snareBuffers[Math.floor(Math.random() * snareBuffers.length)];
  ohh = ohhBuffers[Math.floor(Math.random() * ohhBuffers.length)];
  cl = clBuffers[Math.floor(Math.random() * clBuffers.length)];
  cy = cyBuffers[0];
}

function resetDrumSequence() {
  kicksArray = [];
  chhsArray = [];
  snaresArray = [];
  clsArray = [];
  ohhsArray = [];
}

function randomRiddim() {
  resetDrumSequence();
  let hasOhh = Math.random() < 0.7;
  for (let i = 0; i < totalSteps; i++) {
    if (i % 2 == 0) {
      kicksArray.push(Math.random() < 0.5);
      snaresArray.push(Math.random() < 0.5);
      clsArray.push(Math.random() < 0.4);
      chhsArray.push(Math.random() < 0.8);
      if (hasOhh) {
        ohhsArray.push(Math.random() < 0.2);
      } else {
        ohhsArray.push(false);
      }
    } else {
      kicksArray.push(false);
      chhsArray.push(false);
      snaresArray.push(false);
      clsArray.push(false);
      ohhsArray.push(false);
    }
  }
}

function randomIntro() {
  resetDrumSequence();
  for (let i = 0; i < totalSteps; i++) {
    if (i % 2 == 0 && i >= totalSteps - totalSteps / 2) {
      snaresArray.push(Math.random() < 0.6);
    } else {
      snaresArray.push(false);
    }
  }
}

function randomBreak() {
  resetDrumSequence();
  for (let i = 0; i < totalSteps; i++) {
    if (i % 2 == 0 && i < totalSteps) {
      kicksArray.push(Math.random() < 0.5);
      snaresArray.push(Math.random() < 0.6);
      clsArray.push(Math.random() < 0.4);
      ohhsArray.push(Math.random() < 0.4);
    } else {
      kicksArray.push(false);
      chhsArray.push(false);
      snaresArray.push(false);
      clsArray.push(false);
      ohhsArray.push(false);
    }
    if (i < totalSteps) {
      chhsArray.push(Math.random() < 0.8);
    } else {
      chhsArray.push(false);
    }
  }
}

function playPercussionWithVelocity(buffer, velocity) {
  let gainNode = audioCtx.createGain();
  let percBuffer = audioCtx.createBufferSource();
  percBuffer.buffer = buffer;
  gainNode.gain.value = velocity;
  percBuffer.connect(gainNode).connect(drumMaster);
  percBuffer.start(audioCtx.currentTime);
  percBuffer.stop(audioCtx.currentTime + totalSteps);
  setTimeout(() => {
    percBuffer.disconnect();
    gainNode.disconnect();
  }, totalSteps * 100);
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

function createChords() {
  for (let i = 0; i < frequencies.length - 4; i++) {
    chords.push([
      frequencies[i],
      frequencies[i + 2],
      frequencies[i + 4],
      frequencies[i + 6],
    ]);
  }
}

function initFX() {
  distorsionGain.gain.value = 0.6;
  delay.delayTime.value = (tempo / 1000) * 2;
  filter.frequency.value = 100;
  filter.type = "highpass";
  filter.Q.value = 0;
  filterGain.gain.value = 0.6;
  delay.delayTime.value = 0.5;
  feedback.gain.value = 0.3;
  distorsion.curve = makeDistortionCurve(10);
  distorsion.oversample = "4x";
  lfo.frequency.value = tempo / 1000 / 2;
  lfoGain.gain.value = 400;
  master.gain.value = 0.7;
  drumMaster.gain.value = 0.65;
  synthMaster.gain.value = 1;
  convolver.buffer = shortReverbBuffer;
  reverbFilter.type = "highpass";
  reverbFilter.frequency.value = 100;
  reverbGain.gain.value = 0.3;
}

function connect() {
  lfo.connect(lfoGain);
  filter.connect(filterGain);
  filterGain.connect(delay);
  filterGain.connect(synthMaster);

  delay.connect(feedback);
  feedback.connect(analyzer);

  distorsion.connect(distorsionGain);

  drumMaster.connect(analyzer);
  distorsionGain.connect(synthMaster);
  distorsionGain.connect(delay);

  synthMaster.connect(convolver);
  synthMaster.connect(analyzer);

  convolver.connect(reverbFilter);
  reverbFilter.connect(reverbGain);
  reverbGain.connect(analyzer);

  analyzer.connect(master);
  master.connect(audioCtx.destination);
}

function disconnect() {
  lfo.stop();
  lfo.disconnect();
  lfoGain.disconnect();
  distorsion.disconnect();
  filter.disconnect();
  delay.disconnect();
  feedback.disconnect();
  master.disconnect();
  convolver.disconnect();
  reverbFilter.disconnect();
  reverbGain.disconnect();
  analyzer.disconnect();
}

function bassSynth(frequency, duration) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.connect(gain);
  gain.gain.setValueAtTime(synthVolume, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(
    synthVolume,
    audioCtx.currentTime + (duration - totalSteps / bpm)
  );
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
  gain.connect(master);
  oscillator.frequency.value = frequency / 4;
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    gain.disconnect();
  }, 3000);
}

function tbSynth(frequency, duration) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();
  let filter = audioCtx.createBiquadFilter();
  let filterGain = audioCtx.createGain();
  let hiPassFilter = audioCtx.createBiquadFilter();
  let hiPassFilterGain = audioCtx.createGain();
  let cutoff = 3500;

  filter.type = "lowpass";
  filter.Q.value = 15;
  filter.frequency.setValueAtTime(cutoff, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(
    cutoff * 0.1,
    audioCtx.currentTime + duration / 2
  );
  lfoGain.connect(filter.frequency);

  hiPassFilter.type = "highpass";
  hiPassFilter.frequency.setValueAtTime(100, audioCtx.currentTime);

  hiPassFilter.connect(hiPassFilterGain);
  hiPassFilterGain.connect(filter);

  filter.connect(filterGain);
  filterGain.connect(distorsion);

  oscillator.type = "sawtooth";
  oscillator.connect(gain);
  gain.gain.setValueAtTime(synthVolume, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration / 6);
  gain.connect(hiPassFilter);
  oscillator.frequency.value = frequency / 2;
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    gain.disconnect();
    filter.disconnect();
    filterGain.disconnect();
    hiPassFilter.disconnect();
    hiPassFilterGain.disconnect();
  }, 3000);
}

function sqSynth(frequency, duration) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();
  let filter = audioCtx.createBiquadFilter();
  let filterGain = audioCtx.createGain();
  let hiPassFilter = audioCtx.createBiquadFilter();
  let hiPassFilterGain = audioCtx.createGain();
  let cutoff = 3000;

  filter.type = "lowpass";
  filter.Q.value = 8;
  filter.frequency.setValueAtTime(cutoff * 0.3, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(
    cutoff,
    audioCtx.currentTime + duration / 2
  );
  lfoGain.connect(filter.frequency);
  hiPassFilter.type = "highpass";
  hiPassFilter.frequency.setValueAtTime(100, audioCtx.currentTime);

  hiPassFilter.connect(hiPassFilterGain);
  hiPassFilterGain.connect(filter);

  filter.connect(filterGain);
  filterGain.connect(distorsion);

  oscillator.type = "square";
  oscillator.connect(gain);
  gain.gain.setValueAtTime(synthVolume, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration / 6);
  gain.connect(hiPassFilter);
  oscillator.frequency.value = frequency / 2;
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    gain.disconnect();
    filter.disconnect();
    filterGain.disconnect();
    hiPassFilter.disconnect();
    hiPassFilterGain.disconnect();
  }, 3000);
}

function fundamentalSynth(frequency, duration) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.connect(gain);
  gain.gain.setValueAtTime(synthVolume, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + duration / 3);
  gain.connect(filter);
  oscillator.frequency.value = frequency;
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    gain.disconnect();
  }, 3000);
}

function thirdSynth(frequency, duration) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.connect(gain);
  gain.gain.setValueAtTime(synthVolume, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + duration / 3);
  gain.connect(filter);
  oscillator.frequency.value = frequency;
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    gain.disconnect();
  }, 3000);
}

function fifthSynth(frequency, duration) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();
  let pan = audioCtx.createStereoPanner();
  pan.pan.value = -0.5;

  oscillator.type = "sine";
  oscillator.connect(gain);
  gain.gain.setValueAtTime(synthVolume, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.01, audioCtx.currentTime + duration / 3);
  gain.connect(pan);
  pan.connect(filter);
  oscillator.frequency.value = frequency - 1;
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  let oscillator2 = audioCtx.createOscillator();
  let gain2 = audioCtx.createGain();
  let pan2 = audioCtx.createStereoPanner();
  pan2.pan.value = 0.5;

  oscillator2.type = "sine";
  gain2.gain.setValueAtTime(synthVolume, audioCtx.currentTime);
  gain2.gain.setValueAtTime(0.01, audioCtx.currentTime + duration / 3);
  oscillator2.connect(gain2);
  gain2.connect(pan2);
  pan2.connect(filter);
  oscillator2.frequency.value = frequency + 1;
  oscillator2.start(audioCtx.currentTime);
  oscillator2.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    gain.disconnect();
    oscillator2.disconnect();
    gain2.disconnect();
    pan.disconnect();
    pan2.disconnect();
  }, 3000);
}

function melodySynth(frequency, duration) {
  let oscillator = audioCtx.createOscillator();
  let gain = audioCtx.createGain();
  let pan = audioCtx.createStereoPanner();
  pan.pan.value = -0.5;

  oscillator.type = "sine";
  oscillator.connect(gain);
  gain.gain.setValueAtTime(synthVolume, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  gain.connect(pan);
  pan.connect(filter);
  oscillator.frequency.value = frequency - 1;
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);

  let oscillator2 = audioCtx.createOscillator();
  let gain2 = audioCtx.createGain();
  let pan2 = audioCtx.createStereoPanner();
  pan2.pan.value = 0.5;

  oscillator2.type = "sine";
  oscillator2.connect(gain2);
  gain2.gain.setValueAtTime(synthVolume, audioCtx.currentTime);
  gain2.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  gain2.connect(pan2);
  pan2.connect(filter);
  oscillator2.frequency.value = frequency + 1;
  oscillator2.start(audioCtx.currentTime);
  oscillator2.stop(audioCtx.currentTime + duration);

  setTimeout(() => {
    oscillator.disconnect();
    gain.disconnect();
    pan.disconnect();
    oscillator2.disconnect();
    gain2.disconnect();
    pan2.disconnect();
  }, 3000);
}

function generateRandomNoteSequence(frequencies) {
  let sequence = [];
  let random = Math.random();
  for (let i = 0; i < totalSteps; i++) {
    if (i % 2 == 0) {
      if (Math.random() < 0.6) {
        let note = frequencies[Math.floor(Math.random() * frequencies.length)];
        let duration = totalSteps / bpm;
        sequence.push({ note, duration });
      } else {
        let note = false;
        let duration = "";
        sequence.push({ note, duration });
      }
    } else {
      let note = false;
      let duration = "";
      sequence.push({ note, duration });
    }
  }
  let duration = 0;
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i].note) {
      duration = sequence[i].duration;
      for (let j = i + 1; j < sequence.length; j++) {
        if (sequence[j].note === false) {
          duration += sequence[i].duration;
        } else {
          break;
        }
      }
      sequence[i].duration = duration;
    }
  }
  return sequence;
}

function generateNoteSequenceForChord(noteIndex) {
  let sequence = [];
  let random = Math.random();
  for (let i = 0; i < totalSteps; i++) {
    if (i % 2 == 0) {
      if (Math.random() < 0.2) {
        let note = frequencies[noteIndex];
        let duration = totalSteps / bpm;
        sequence.push({ note, duration });
      } else {
        let note = false;
        let duration = "";
        sequence.push({ note, duration });
      }
    } else {
      let note = false;
      let duration = "";
      sequence.push({ note, duration });
    }
  }
  let duration = 0;
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i].note) {
      duration = sequence[i].duration;
      for (let j = i + 1; j < sequence.length; j++) {
        if (sequence[j].note === false) {
          duration += sequence[i].duration;
        } else {
          break;
        }
      }
      sequence[i].duration = duration;
    }
  }
  return sequence;
}

function generateNoteForBass(notesIndex, chance) {
  let sequence = [];
  let random = Math.random();
  for (let i = 0; i < totalSteps; i++) {
    if (i % 2 == 0) {
      if (i == 0) {
        let note = frequencies[0];
        let duration = totalSteps / bpm;
        sequence.push({ note, duration });
      } else {
        if (Math.random() < chance) {
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
    } else {
      let note = false;
      let duration = "";
      sequence.push({ note, duration });
    }
  }
  let duration = 0;
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i].note) {
      duration = sequence[i].duration;
      for (let j = i + 1; j < sequence.length; j++) {
        if (sequence[j].note === false) {
          duration += sequence[i].duration;
        } else {
          break;
        }
      }
      sequence[i].duration = duration;
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
  fifth = generateNoteSequenceForChord(fundamentalNote);
}

function generateBassSequence(notes) {
  bass = generateNoteForBass(notes, 0.6);
}

function generateTbSequence(notes) {
  tb = generateNoteForBass(notes, 0.6);
}

function generateSqSequence(notes) {
  sq = generateNoteForBass(notes, 0.6);
}

function playNote(array, instrument) {
  if (array[currentStep] != null) {
    instrument(array[currentStep].note, array[currentStep].duration);
  }
}

initBuffers("kick", kickBuffers)
  .then(() => initBuffers("snare", snareBuffers))
  .then(() => initBuffers("chh", chhBuffers))
  .then(() => initBuffers("ohh", ohhBuffers))
  .then(() => initBuffers("cl", clBuffers))
  .then(() => initBuffers("cy", cyBuffers));

function play() {
  if (isPaused) return;
  if (currentMeasure == 0 && currentStep == 0 && songDuration > 0) {
    playPercussionWithVelocity(cy, 1);
  }
  playNote(melodyNotes, melodySynth);
  playNote(fundamental, fundamentalSynth);
  playNote(third, thirdSynth);
  playNote(fifth, fifthSynth);
  if (songDuration > 0) {
    playNote(bass, bassSynth);
  }
  if ((songDuration > 1 && songDuration < 6) || songDuration > 7) {
    if (randomizer < 1 / 2) {
      playNote(tb, tbSynth);
    } else {
      playNote(sq, sqSynth);
    }
  }
  if (songDuration > 5 && songDuration < 8) {
    playNote(tb, tbSynth);
    playNote(sq, sqSynth);
  }
  playDrum();
  updateDisplay();

  currentStep++;
  if (currentStep == totalSteps) {
    currentStep = 0;
    currentMeasure++;
    if (currentMeasure == measuresNumber / 2) {
      generateMelodySequence();
      generateChordSequence(5);
      generateBassSequence([5, 12]);
      generateSqSequence([5, 12, 13, 15]);
      generateTbSequence([5, 12, 13, 15]);
    }
    if (currentMeasure == measuresNumber - measuresNumber / 4) {
      generateMelodySequence();
      generateChordSequence(4);
      generateBassSequence([4, 11]);
      generateSqSequence([4, 11, 12, 14]);
      generateTbSequence([4, 11, 12, 14]);
    }
    if (currentMeasure == measuresNumber - 1 && songDuration == 0) {
      randomIntro();
    }
    if (currentMeasure == measuresNumber - 1 && songDuration > 0) {
      randomBreak();
    }
    if (currentMeasure == measuresNumber) {
      currentMeasure = 0;
      songDuration++;
      generateMelodySequence();
      generateChordSequence(0);
      generateBassSequence([0, 7]);
      generateSqSequence([0, 4, 5, 7]);
      generateTbSequence([0, 4, 5, 7]);
      if (songDuration > 0) {
        randomRiddim();
      }
      randomizer = Math.random();
    }
  }
}

export function startSine() {
  initDrumMachine();
  createChords();
  initFX();
  connect();
  generateMelodySequence();
  generateChordSequence(0);
  generateBassSequence([0, 7]);
  generateTbSequence([0, 4, 5, 7]);
  generateSqSequence([0, 4, 5, 7]);
  timer.callback = play;
  timer.errorCallback = "error";
  timer.timeInterval = tempo;
  timer.start();
}

export function stopSine() {
  timer.stop();
  disconnect();

  currentStep = 0;
  currentMeasure = 0;
  songDuration = 0;

  const currentStepEl = document.getElementById("currentStep");
  const currentMeasureEl = document.getElementById("currentMeasure");
  const currentScaleEl = document.getElementById("currentScale");
  const currentSongDurationEl = document.getElementById("currentSongDuration");
  const currentSongEl = document.getElementById("currentSong");

  if (currentStepEl) currentStepEl.textContent = "--";
  if (currentMeasureEl) currentMeasureEl.textContent = "--";
  if (currentScaleEl) currentScaleEl.textContent = "--";
  if (currentSongDurationEl) currentSongDurationEl.textContent = "--";
  if (currentSongEl) currentSongEl.textContent = "Press Play to start";
}

export function setPaused(paused) {
  isPaused = paused;
}
