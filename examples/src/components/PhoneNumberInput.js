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

class PhoneNumberInput extends React.Component {
  constructor() {
    super();
    this.state = {
      dialCode: '+1',
      exampleNumber: phoneUtil.format(phoneUtil.getExampleNumber('US')),
    };
  }

  render() {
    const { dialCode, exampleNumber } = this.state;
    return (
      <FormattedInput
        {...this.props}
        type="tel"
        defaultValue=""
        placeholder={`${dialCode} ${exampleNumber}`}
        getFormattedValue={getFormattedNumber}
        getUnformattedValue={getUnformattedValue}
      />
    );
  }
}

export default PhoneNumberInput;
