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
      <div>
        <p>testing examples page</p>
        <FormattedInput
          type="text"
          value={this.state.value}
          getFormattedValue={getFormattedValue}
          getUnformattedValue={getUnformattedValue}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <NumberInput />,
  document.getElementById('app'),
);
