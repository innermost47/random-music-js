export class Timer {
  constructor(callback, timeInterval, errorCallback) {
    this._timeInterval = timeInterval;
    this._callback = callback;
    this._errorCallback = errorCallback;
    this.expected = null;
    this.timeOut = null;
    this._paused = false;
    this._remainingTime = 0;
  }

  start() {
    this.expected = Date.now() + this._timeInterval;
    this.timeOut = setTimeout(this.round.bind(this), this._timeInterval);
    this._paused = false;
  }

  stop() {
    clearTimeout(this.timeOut);
    this.expected = null;
    this.timeOut = null;
    this._paused = false;
  }

  pause() {
    if (this.timeOut && !this._paused) {
      clearTimeout(this.timeOut);
      this._remainingTime = this.expected - Date.now();
      this._paused = true;
    }
  }

  resume() {
    if (this._paused) {
      this.expected = Date.now() + this._remainingTime;
      this.timeOut = setTimeout(this.round.bind(this), this._remainingTime);
      this._paused = false;
    }
  }

  round() {
    let drift = Date.now() - this.expected;
    if (drift > this._timeInterval) {
      if (this._errorCallback) {
        console.log(this._errorCallback);
      }
    }
    this.callback();
    this.expected += this._timeInterval;
    this.timeOut = setTimeout(
      this.round.bind(this),
      this._timeInterval - drift
    );
  }

  get timeInterval() {
    return this._timeInterval;
  }

  set timeInterval(timeInterval) {
    this._timeInterval = timeInterval;
  }

  get callback() {
    return this._callback;
  }

  set callback(callback) {
    this._callback = callback;
  }

  get errorCallback() {
    return this._errorCallback;
  }

  set errorCallback(errorCallback) {
    this._errorCallback = errorCallback;
  }
}
