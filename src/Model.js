import _ from 'underscore';

export default class Model {
  constructor(opts) {
    this.listeners = [];
    this.setInitialState();
    _.extend(this, opts);
  }

  cloneState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  subscribe(cb) {
    this.listeners.push(cb);
  }

  publish(state) {
    this.state = state;
    this.listeners.forEach((cb) => cb());
  }

  setInitialState() {
    this.state = {};
  }
}