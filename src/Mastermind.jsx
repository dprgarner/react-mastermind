import BaseComponent from './BaseComponent';

class MastermindPeg extends BaseComponent {
  render() {
    return <span className='peg'>{this.props.colour}</span>;
  }
}

class MastermindRow extends BaseComponent {
  render() {
    return (
      <div className='row'>
        {this.props.pegs.map((colour, i) => <MastermindPeg key={i} colour={colour}/>)}
      </div>
    )
  }
}

class Mastermind extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {rows: [
      {pegs: ['r','g','b','y']},
      {pegs: ['m','c','q','x']},
    ]};
  }

  render() {
    return (
      <div className='board'>
        {this.state.rows.map((row, i) => <MastermindRow key={i} {...row}/>)}
      </div>
    );
  }
}

export default Mastermind;