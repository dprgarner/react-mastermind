import BaseComponent from './BaseComponent';
import _ from 'underscore';

const RED = 0;
const GREEN = 1;
const BLUE = 2;
const YELLOW = 3;
const CYAN = 4;
const MAGENTA = 5;
const BLACK = 6;
const WHITE = 7;

const colourHex = {
  [RED]: '#f00',
  [GREEN]: '#0f0',
  [BLUE]: '#00f',
  [YELLOW]: '#ff0',
  [CYAN]: '#0ff',
  [MAGENTA]: '#f0f',
  [BLACK]: '#000',
  [WHITE]: '#fff',
}

class MastermindPeg extends BaseComponent {
  render() {
    let style = {
      'backgroundColor': colourHex[this.props.colour],
    }
    return <li className='peg' style={style} />;
  }
}

class MastermindPanel extends BaseComponent {
  render() {
    return (<ol className='panel'>
        {this.props.availableColours.map((colour, i) => (
          <MastermindPeg key={i} colour={colour}/>
        ))}
    </ol>);
  }
}

class MastermindRow extends BaseComponent {
  render() {
    return (
      <ol className='row'>
        {this.props.pegs.map((colour, i) => (
          <MastermindPeg key={i} colour={colour}/>
        ))}
      </ol>
    )
  }
}

class MastermindBoard extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {rows: [
      {pegs: [RED, GREEN, BLUE, YELLOW]},
      {pegs: [MAGENTA, CYAN, BLACK, WHITE]},
    ]};
  }

  render() {
    return (
      <ol className='board'>
        {this.state.rows.map((row, i) => (
          <li key={i}>
            <MastermindRow {...row}/>
          </li>
        ))}
      </ol>
    );
  }
}

class Mastermind extends BaseComponent {
  render() {
    let availableColours = _.keys(colourHex);
    return (
      <div>
        <MastermindBoard />
        <MastermindPanel availableColours={availableColours} />
      </div>
    );
  }
}

export default Mastermind;