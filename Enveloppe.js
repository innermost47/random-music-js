export class Enveloppe {
  constructor() {
    this._attack;
    this._decay;
    this._sustain;
    this._release;
  }

  get attack() {
    return this._attack;
  }

  get decay() {
    return this._decay;
  }

  get sustain() {
    return this._sustain;
  }

  get release() {
    return this._release;
  }

  set attack(attack) {
    this._attack = attack;
  }

  set decay(decay) {
    this._decay = decay;
  }

  set sustain(sustain) {
    this._sustain = sustain;
  }

  set release(release) {
    this._release = release;
  }
}
