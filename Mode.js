import { NOTES_JSON } from "./notes.js";

export class Mode {
  constructor() {
    this.chromaticScale = [
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
    this.modes = {
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
      chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    };
    this.notesFrequencies = NOTES_JSON;
    this._rootNote;
    this._mode;
  }

  getFrequenciesFromMode(octaves) {
    let scale = [];
    let scaleWithOctaves = [];
    let modeOffset = this.modes[this._mode];

    scale = this.createMode(this._rootNote, modeOffset);
    scaleWithOctaves = this.associateNotesWithOctaves(scale, octaves);
    let frequencies = scaleWithOctaves.map(
      (note) => this.notesFrequencies[note]
    );
    return frequencies;
  }

  createMode(rootNote, modeOffset) {
    let mode = [];
    let currentNoteIndex = this.chromaticScale.indexOf(rootNote);
    for (let offset of modeOffset) {
      let currentNote =
        this.chromaticScale[
          (currentNoteIndex + offset) % this.chromaticScale.length
        ];
      mode.push(currentNote);
    }
    return mode;
  }

  associateNotesWithOctaves(scale, octaves) {
    let allNotes = [];
    octaves.forEach((octave) => {
      for (const note of scale) {
        allNotes.push(`${note}${octave}`);
      }
    });
    return allNotes;
  }

  get rootNote() {
    return this._rootNote;
  }

  set rootNote(rootNote) {
    this._rootNote = rootNote;
  }

  get mode() {
    return this._mode;
  }

  set mode(mode) {
    this._mode = mode;
  }
}
