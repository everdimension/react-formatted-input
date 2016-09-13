import React from 'react';
import ReactDOM from 'react-dom';
import FormattedInput from '../../src';

class ExamplePage extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt, rawValue) {
    this.setState({
      value: rawValue,
    });
  }

  render() {
    return (
      <div>
        <p>testing examples page</p>
        <FormattedInput
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>

    );
  }
}

ReactDOM.render(
  <ExamplePage />,
  document.getElementById('app')
);
