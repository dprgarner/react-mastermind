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

class MastermindSmallPeg extends BaseComponent {
  render() {
    let style = {
      'backgroundColor': colourHex[this.props.colour],
    }
    return <li className='small-peg' style={style}/>;
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

class MastermindScore extends BaseComponent {
  render() {
    let i = 0;
    let scorePegs = [].concat(
      _(this.props.black).times(() => 
        <MastermindSmallPeg key={i++} colour={BLACK} />),
      _(this.props.white).times(() => 
        <MastermindSmallPeg key={i++} colour={WHITE} />)
    );
    return <ol className='score'>{scorePegs}</ol>;
  }
}

class MastermindRow extends BaseComponent {
  render() {
    let score = ('white' in this.props) ? (
      <MastermindScore white={this.props.white} black={this.props.black} />
    ) : '';

    return (
      <div className='row'>
        <ol className='pegs'>
          {this.props.pegs.map((colour, i) => (
            <MastermindPeg key={i} colour={colour}/>
          ))}
        </ol>
        {score}
      </div>
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

let MastermindState = (props) =>
<pre dangerouslySetInnerHTML={{__html: JSON.stringify(props.data,null,2)}}></pre>;

class Model {
  constructor(initialState, opts) {
    this.listeners = [];
    this.state = initialState;
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

  addPeg(colour) {
    let state = this.cloneState();
    let currentTurn = state.rows.length - 1;
    if (currentTurn === -1 || state.rows[currentTurn].pegs.length === this.maxPegs) {
      state.rows.push({pegs: []});
      currentTurn++;
    }
    let pegs = state.rows[currentTurn].pegs;
    if (this.uniqueColours && pegs.indexOf(colour) !== -1) return;
    pegs.push(colour);
    if (pegs.length === this.maxPegs) this.score(state.rows[currentTurn]);
    this.publish(state);
  }

  score(row) {
    row.white = 2;
    row.black = 1;
  }
}

class Mastermind extends BaseComponent {
  constructor(props) {
    super(props);
    this.model = new Model({rows: []}, {
      maxPegs: 4,
      uniqueColours: true,
      secret: [RED, GREEN, BLUE, YELLOW],
    });
    this.state = this.model.state;
    this.model.subscribe(() => this.setState(this.model.state));
  }

  handlePress(colour) {
    this.model.addPeg(colour);
  }

  render() {
    let availableColours = _.keys(_.omit(colourHex, [WHITE, BLACK]));
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