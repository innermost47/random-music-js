import { NOTES_JSON } from "../utils/notes.js";
import { chromaticScale, modes } from "../utils/utils.js";

export class Mode {
  constructor() {
    this.chromaticScale = chromaticScale;
    this.modes = modes;
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
