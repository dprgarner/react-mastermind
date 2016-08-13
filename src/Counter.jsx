import BaseComponent from './BaseComponent';

export default class Counter extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {count: this.props.initialCount};
  }

  handleClick() {
    this.setState({count: this.state.count + 1});
  }

  render() {
    return <div onClick={this.handleClick}>{this.state.count}</div>;
  }
}