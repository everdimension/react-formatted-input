import React from 'react';
import { AsYouTypeFormatter, PhoneNumberUtil } from 'google-libphonenumber';
import FormattedInput from '../../../src';

const NUMBER_RE = /[^\d]/g;
const formatter = new AsYouTypeFormatter();
const phoneUtil = PhoneNumberUtil.getInstance();

function getFormattedNumber(str = '') {
  formatter.clear();
  const result = str.split('').reduce((output, d) => formatter.inputDigit(d), '');
  return result.trim();
}

function getUnformattedValue(n = '') {
  if (!n) {
    return n;
  }

  const stripped = n
    .replace(NUMBER_RE, '');

  return `+${stripped}`;
}

class PhoneNumberInputControlled extends React.Component {
  constructor() {
    super();
    this.state = {
      // NOTE: phone is initially undefined
      dialCode: '+1',
      exampleNumber: phoneUtil.format(phoneUtil.getExampleNumber('US')),
    };
  }

  onChange(evt, rawValue) {
    this.setState({
      [evt.target.name]: rawValue,
    });
  }

  render() {
    const { dialCode, exampleNumber } = this.state;
    return (
      <FormattedInput
        {...this.props}
        type="tel"
        name="phone"
        value={this.state.phone}
        placeholder={`${dialCode} ${exampleNumber}`}
        getFormattedValue={getFormattedNumber}
        getUnformattedValue={getUnformattedValue}
      />
    );
  }
}

export default PhoneNumberInputControlled;
