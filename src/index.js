import React, { PropTypes as t } from 'react';
import omit from 'lodash/omit';
import difference from 'lodash/difference';
import findIndex from 'lodash/findIndex';
import KEY_CODES from './constants';

function getCursorPosition(el) {
  return el.selectionStart;
}

function setCursorPosition(el, pos) {
  el.setSelectionRange(pos, pos);
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

const propTypes = {
  value: t.oneOfType([t.number, t.string]),
  onChange: t.func.isRequired,
  getFormattedValue: t.func,
  getUnformattedValue: t.func,
};

const defaultProps = {
  value: '',
};

class FormattedInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.saveCursorPosition = this.saveCursorPosition.bind(this);
    this.getFormattedValue = props.getFormattedValue;
    this.getUnformattedValue = props.getUnformattedValue;
    this.mount = this.mount.bind(this);
    this.focus = this.focus.bind(this);

    const { value } = props;
    this.state = {
      selectionStart: 0,
      selectionEnd: 0,
      cursorPosition: 0,
      value,
      text: this.getFormattedValue(value),
      keyCode: null,
      isModifiedEvent: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    const text = this.getFormattedValue(value);

    const newState = { value, text };
    this.setState(newState);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      cursorPosition,
      text,
      value,
      eventIsModified,
      keyCode,
    } = this.state;
    if (this.inputElement.value !== text) {
      this.inputElement.value = text;
    }
    if (text === prevState.text) {
      if (
        !eventIsModified &&
        (cursorPosition !== prevState.cursorPosition || keyCode === KEY_CODES.DEL)
      ) {
        setCursorPosition(this.inputElement, cursorPosition);
      }
      return;
    }

    if (!text) {
      // dont calculate and set cursor position for empty value
      // because it is always correct anyway
      return;
    }

    const differenceStartPos = findIndex(
      text.split(''),
      (letter, i) => letter !== prevState.text.charAt(i),
    );
    const differentBeforeCursor = differenceStartPos < cursorPosition;
    if (!differentBeforeCursor) {
      setCursorPosition(this.inputElement, cursorPosition);
      return;
    }

    const prevValueBeforeCursor = prevState.value.slice(0, prevState.cursorPosition);
    const prevTextBeforeCursor = prevState.text.slice(0, prevState.cursorPosition);
    const valueBeforeCursor = value.slice(0, cursorPosition);
    const textBeforeCursor = text.slice(0, cursorPosition);
    const prevMaskDifference = difference(prevTextBeforeCursor.split(''), prevValueBeforeCursor.split(''));
    const maskDifference = difference(textBeforeCursor.split(''), valueBeforeCursor.split(''));
    const maskDelta = maskDifference.length - prevMaskDifference.length;

    let newCursorPosition;

    if (
      maskDelta === 0 &&
      maskDifference.join('') !== prevMaskDifference.join('') &&
      maskDifference.indexOf(text.charAt(prevState.cursorPosition - 1)) !== -1
    ) {
      newCursorPosition = prevState.cursorPosition;
    } else if (
      maskDelta === 1 &&
      maskDifference.join('') !== prevMaskDifference.join('') &&
      maskDifference.indexOf(text.charAt(cursorPosition - 1)) !== -1
    ) {
      newCursorPosition = cursorPosition;
    } else {
      newCursorPosition = cursorPosition + maskDelta;
    }

    setCursorPosition(this.inputElement, newCursorPosition);
  }

  mount(node) {
    this.inputElement = node;
  }

  focus() {
    setCursorPosition(this.inputElement, this.inputElement.value.length);
    this.inputElement.focus();
  }

  saveCursorPosition() {
    this.setState({
      cursorPosition: getCursorPosition(this.inputElement),
    });
  }

  handleChange(evt) {
    const { value } = evt.target;
    const newValue = this.getUnformattedValue(value).toString();
    this.saveCursorPosition(evt);
    if (newValue === this.state.value) { return; }
    this.props.onChange(evt, newValue);
  }

  handleKeyDown(evt) {
    this.setState({
      keyCode: evt.which,
      eventIsModified: isModifiedEvent(evt),
    });
  }

  render() {
    const domProps = omit(this.props, ['value', 'getUnformattedValue', 'getFormattedValue']);
    return (
      <input
        type="text"
        {...domProps}
        ref={this.mount}
        defaultValue={this.state.text}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.saveCursorPosition}
        onChange={this.handleChange}
      />
    );
  }
}

FormattedInput.propTypes = propTypes;
FormattedInput.defaultProps = defaultProps;

export default FormattedInput;
