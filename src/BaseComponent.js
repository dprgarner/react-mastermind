import React from 'react';

// A component that binds class methods to the context, as React doesn't do
// this with ES6 syntax by default. Mostly pinched from stackOverflow. If this
// messes up, just define methods with arrow functions.
export default class BaseComponent extends React.Component {
  constructor(props) {
    super(props);
    for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      let method = this[name];
      if (!(method instanceof Function) || method === this.constructor) continue;
      this[name] = this[name].bind(this);
    }
  }
}