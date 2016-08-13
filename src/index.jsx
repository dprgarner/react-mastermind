import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './Counter';

// Initialise the app
$(function () {
  ReactDOM.render(<Counter initialCount={7}/>, $('main')[0]);
});