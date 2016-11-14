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
        {...this.props}
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
        {...this.props}
        getFormattedValue={getFormattedValue}
        getUnformattedValue={getUnformattedValue}
        defaultValue="1234"
        onChange={this.handleChange}
      />
    );
  }
}

function addThousandsSeparator(str = '') {
  return str.split('').reverse().map((l, i) => {
    if (i && i % 3 === 0) {
      return `${l},`;
    }
    return l;
  })
    .reverse()
    .join('');
}

function removeThousandsSeparator(str = '') {
  return str.replace(/\D/g, '');
}

function ThousandsSeparator(props) {
  return (
    <FormattedInput
      type="text"
      {...props}
      getFormattedValue={addThousandsSeparator}
      getUnformattedValue={removeThousandsSeparator}
      defaultValue="1234"
    />
  );
}

function App() {
  return (
    <div>
      <p>
        <label htmlFor="numberInput">Controlled input:</label>
        <br />
        <NumberInput id="numberInput" />
      </p>
      <p>
        <label htmlFor="numberInputUncontrolled">Uncontrolled input:</label>
        <br />
        <NumberInputUncontrolled id="numberInputUncontrolled" />
      </p>
      <p>
        <label htmlFor="thousandsSeparator">Simple thousands separator</label>
        <br />
        <ThousandsSeparator id="thousandsSeparator" />
      </p>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
