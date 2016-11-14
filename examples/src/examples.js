/* global document */
import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line import/no-extraneous-dependencies
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';
import FormattedInput from '../../src';
import PhoneNumberInput from './components/PhoneNumberInput';
import ShowMore from './components/ShowMore';

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

class App extends React.Component {
  componentDidMount() {
    const codeBlocks = document.querySelectorAll('.code-blocks');
    console.log('codeBlocks', codeBlocks);
    Array.prototype.forEach.call(codeBlocks, (block) => {
      hljs.highlightBlock(block);
    });
  }

  render() {
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
        <p>
          <label htmlFor="phoneInput">Phone number input</label>
          <br />
          <PhoneNumberInput id="phoneInput" />
        </p>
        <ShowMore>
          <pre className="code-blocks"><code>
            {require('raw!./components/PhoneNumberInputCode.html')}
          </code></pre>
        </ShowMore>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app'),
);
