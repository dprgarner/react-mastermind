import ReactDOM from 'react-dom';
import Mastermind from './Mastermind';

// Initialise the app
$(function () {
  ReactDOM.render(<Mastermind/>, $('main')[0]);
});