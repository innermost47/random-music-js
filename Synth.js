export class Synth {
  constructor() {
    this._audioCtx;
    this._type;
    this._audioDestination;
    this._enveloppe;
    this.oscillator;
    this.gain;
  }

  play(frequency, duration) {
    this.oscillator = this.audioCtx.createOscillator();
    this.gain = this.audioCtx.createGain();
    this.oscillator.type = this.type;
    this.oscillator.connect(this.gain);
    this.gain.gain.setValueAtTime(
      this._enveloppe.attack,
      this.audioCtx.currentTime
    );
    this.gain.gain.linearRampToValueAtTime(
      this._enveloppe.release,
      this.audioCtx.currentTime + duration
    );
    this.gain.connect(this.audioDestination);
    this.oscillator.frequency.value = frequency;
    this.oscillator.start(this.audioCtx.currentTime);
    this.oscillator.stop(this.audioCtx.currentTime + duration);
  }

  disconnect() {
    setTimeout(() => {
      this.oscillator.disconnect();
      this.gain.disconnect();
    }, 1000);
  }

  get audioCtx() {
    return this._audioCtx;
  }

  set audioCtx(audioCtx) {
    this._audioCtx = audioCtx;
  }

  get type() {
    return this._type;
  }

  set type(type) {
    this._type = type;
  }

  get audioDestination() {
    return this._audioDestination;
  }

  set audioDestination(audioDestination) {
    this._audioDestination = audioDestination;
  }

  get enveloppe() {
    return this._enveloppe;
  }

  set enveloppe(enveloppe) {
    this._enveloppe = enveloppe;
  }
}
