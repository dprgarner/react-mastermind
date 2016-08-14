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
  handlePress() {
    if (this.props.handlePress) {
      this.props.handlePress(this.props.colour);
    }
  }

  render() {
    let style = {
      'backgroundColor': colourHex[this.props.colour],
    }
    return <li className='peg' style={style} onClick={this.handlePress}/>;
  }
}

class MastermindPanel extends BaseComponent {
  render() {
    return (<ol className='panel'>
        {this.props.availableColours.map((colour, i) => (
          <MastermindPeg
             key={i}
             colour={colour}
             handlePress={this.props.handlePress}/>
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
  render() {
    return (
      <ol className='board'>
        {this.props.rows.map((row, i) => (
          <li key={i}>
            <MastermindRow {...row}/>
          </li>
        ))}
      </ol>
    );
  }
}

class Model {
  constructor(opts) {
    this.state = {rows: []};
    this.maxPegs = opts.maxPegs;
  }

  addPeg(colour) {
    let newState = JSON.parse(JSON.stringify(this.state));
    let currentTurn = newState.rows.length - 1;
    if (currentTurn === -1 || newState.rows[currentTurn].pegs.length === this.maxPegs) {
      newState.rows.push({pegs: []});
      currentTurn++;
    }
    newState.rows[currentTurn].pegs.push(colour);
    this.state = newState;
  }
}

let MastermindState = (props) =>
<pre dangerouslySetInnerHTML={{__html: JSON.stringify(props.data,null,2)}}></pre>;

class Mastermind extends BaseComponent {
  constructor(props) {
    super(props);
    this.model = new Model({maxPegs: 4});
    this.state = this.model.state;
  }

  handlePress(colour) {
    this.model.addPeg(colour);
    this.setState(this.model.state);
  }

  render() {
    let availableColours = _.keys(colourHex);
    return (
      <div>
        <MastermindBoard rows={this.state.rows}/>
        <MastermindPanel
          availableColours={availableColours}
          handlePress={this.handlePress} />
        <MastermindState data={this.state} />
      </div>
    );
  }
}

export default Mastermind;