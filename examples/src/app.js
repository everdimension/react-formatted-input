/* global document */
import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line import/no-extraneous-dependencies
import FormattedInput from '../../src';

function getFormattedValue(str) {
  if (!str) {
    return str;
  }
  const formatted = new Intl.NumberFormat('ru', { maximumFractionDigits: 20 }).format(str);
  if (/[^.]+\.$/.test(str)) {
    return `${formatted},`;
  }
  return formatted;
}

function getUnformattedValue(str) {
  if (!str) {
    return str;
  }
  return str.replace(/([^\d,]|,(?=.*,))/g, '').replace(',', '.');
}

class NumberInput extends React.Component {
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
      <FormattedInput
        type="text"
        getFormattedValue={getFormattedValue}
        getUnformattedValue={getUnformattedValue}
        value={this.state.value || ''}
        onChange={this.handleChange}
      />
    );
  }
}

class NumberInputUncontrolled extends React.Component {
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
      <FormattedInput
        type="text"
        getFormattedValue={getFormattedValue}
        getUnformattedValue={getUnformattedValue}
        defaultValue="1234"
        onChange={this.handleChange}
      />
    );
  }
}

function App() {
  return (
    <div>
      <h3>formatted inputs</h3>
      <p>
        Controlled input:
        <br />
        <NumberInput />
      </p>
      <p>
        Uncontrolled input:
        <br />
        <NumberInputUncontrolled />
      </p>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
