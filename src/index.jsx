import ReactDOM from 'react-dom';
import _ from 'underscore';

import Mastermind from './Mastermind';
import {BLACK, WHITE, colourHex} from './constants';

// Initialise the app
$(function () {
  let availableColours = _.chain(colourHex)
    .omit([BLACK, WHITE])
    .keys()
    .map((str) => parseInt(str, 10))
    .value();

  let props = {
    maxPegs: 4,
    uniqueColours: true,
    availableColours,
  };

  ReactDOM.render(<Mastermind {...props}/>, $('main')[0]);
});