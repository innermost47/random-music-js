export class Timer {
  constructor(callback, timeInterval, errorCallback) {
    this._timeInterval = timeInterval;
    this._callback = callback;
    this._errorCallback = errorCallback;
    this.expected;
    this.timeOut;
  }

  start() {
    this.expected = Date.now() + this._timeInterval;
    this.timeOut = setTimeout(this.round.bind(this), this._timeInterval);
  }

  stop() {
    clearTimeout(this.timeOut);
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
