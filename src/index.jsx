import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import MyComponent from './react';

// Initialise the app
$(function () {
  ReactDOM.render(<MyComponent initialCount={7}/>, $('main')[0]);
});