import ReactDOM from 'react-dom';
import Counter from './Counter';
// import Mastermind from './Mastermind';

// Initialise the app
$(function () {
  ReactDOM.render(<Counter initialCount={1}/>, $('main')[0]);
});