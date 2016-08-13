import React from 'react';

export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    // Binds class methods to the context. Mostly pinched from stackOverflow.
    // If this messes up, just define methods with arrow functions.
    for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      let method = this[name];
      if (!(method instanceof Function) || method === this.constructor) continue;
      this[name] = this[name].bind(this);
    }
  }
}