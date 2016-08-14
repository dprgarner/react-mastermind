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
  constructor(opts) {
    this.listeners = [];
    this.setInitialState();
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

  setInitialState() {
    this.state = {rows: []};
  }

  createSecret() {
    this.setInitialState();

    if (this.uniqueColours) {
      this.secret = _.sample(this.availableColours, 4);
    } else {
      this.secret = _.times(4, () => _.sample(this.availableColours));
    }
    console.log('secret:', JSON.stringify(this.secret))
    this.publish(this.state);
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
    row.black = row.white = 0;
    let pegs = JSON.parse(JSON.stringify(row.pegs));
    let maxPegs = pegs.length;
    let secret = JSON.parse(JSON.stringify(this.secret));
    for (let i = 0; i < maxPegs; i++) {
      if (pegs[i] === secret[i]) {
        row.black += 1;
        pegs[i] = null;
        secret[i] = null;
      }
    }

    for (let i = 0; i < maxPegs; i++) {
      let index = secret.indexOf(pegs[i]);
      if (pegs[i] !== null && index !== -1) {
        row.white += 1;
        pegs[i] = null;
        secret[index] = null;
      }
    }
  }
}

class Mastermind extends BaseComponent {
  constructor(props) {
    super(props);

    this.availableColours = _.chain(colourHex)
      .keys()
      .omit([BLACK, WHITE])
      .map((str)=>parseInt(str, 10))
      .value();
    this.model = new Model({
      maxPegs: 4,
      uniqueColours: true,
      availableColours: this.availableColours
    });

    this.model.createSecret();
    this.state = this.model.state;
    this.model.subscribe(() => this.setState(this.model.state));
  }

  handlePress(colour) {
    this.model.addPeg(colour);
  }

  render() {
    return (
      <div>
        <MastermindBoard rows={this.state.rows}/>
        <MastermindPanel
          availableColours={this.availableColours}
          handlePress={this.handlePress} />
        <MastermindState data={this.state} />
      </div>
    );
  }
}

export default Mastermind;