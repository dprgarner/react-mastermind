import BaseComponent from './BaseComponent';
import _ from 'underscore';
import {BLACK, WHITE, colourHex} from './constants';
import Model from './Model';

class Peg extends BaseComponent {
  handlePress() {
    if (this.props.handlePress) {
      this.props.handlePress(this.props.colour);
    }
  }

  render() {
    let className = this.props.small ? 'small-peg' : 'peg';
    let style = {
      'backgroundColor': colourHex[this.props.colour],
    }
    return (
      <li className={className} style={style} onClick={this.handlePress}/>
    );
  }
}

class Panel extends BaseComponent {
  render() {
    return (<ol className='panel'>
        {this.props.availableColours.map((colour, i) => (
          <Peg
             key={i}
             colour={colour}
             handlePress={this.props.handlePress}/>
        ))}
    </ol>);
  }
}

class Score extends BaseComponent {
  render() {
    let i = 0;
    let scorePegs = [].concat(
      _(this.props.black).times(() => 
        <Peg key={i++} colour={BLACK} small />),
      _(this.props.white).times(() => 
        <Peg key={i++} colour={WHITE} small />)
    );
    return <ol className='score'>{scorePegs}</ol>;
  }
}

class Row extends BaseComponent {
  render() {
    let score = ('white' in this.props) ? (
      <Score white={this.props.white} black={this.props.black} />
    ) : '';

    return (
      <div className='row'>
        <ol className='pegs'>
          {this.props.pegs.map((colour, i) => (
            <Peg key={i} colour={colour}/>
          ))}
        </ol>
        {score}
      </div>
    )
  }
}

class Board extends BaseComponent {
  render() {
    return (
      <ol className='board'>
        {this.props.rows.map((row, i) => (
          <li key={i}>
            <Row {...row}/>
          </li>
        ))}
      </ol>
    );
  }
}

let State = (props) => <pre>{JSON.stringify(props.data,null,2)}</pre>;

class MastermindModel extends Model {
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

    this.model = new MastermindModel({
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
        <Board rows={this.state.rows}/>
        <Panel
          availableColours={this.availableColours}
          handlePress={this.handlePress} />
        <State data={this.state} />
      </div>
    );
  }
}

export default Mastermind;