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
  defaultValue: t.oneOfType([t.number, t.string]),
  onChange: t.func,
  getFormattedValue: t.func,
  getUnformattedValue: t.func,
  onKeyPress: t.func,
  onKeyDown: t.func,
  onKeyUp: t.func,
};

const defaultProps = {
  getFormattedValue: x => x,
  getUnformattedValue: x => x,
};

class FormattedInput extends React.Component {
  constructor(props) {
    super(props);

    if ('value' in props && 'defaultValue' in props) {
      console.error(
        'Both value and defaultValue props are provided to FormattedInput. ' +
        'Input elements must be either controlled or uncontrolled',
      );
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.saveCursorPosition = this.saveCursorPosition.bind(this);
    this.mount = this.mount.bind(this);
    this.focus = this.focus.bind(this);

    const value = 'value' in props ? props.value : props.defaultValue;

    this.state = {
      selectionStart: 0,
      selectionEnd: 0,
      cursorPosition: 0,
      value: value == null ? '' : String(value),
      inputLength: 0,
      isUncontrolledInput: !('value' in props),
      text: String(props.getFormattedValue(value)),
      keyCode: null,
      isModifiedEvent: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.isUncontrolledInput) {
      return;
    }
    const { value } = nextProps;
    const text = nextProps.getFormattedValue(value);

    const newState = {
      value: value == null ? '' : String(value),
      text: String(text),
    };
    this.setState(newState);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      cursorPosition,
      text,
      value,
      eventIsModified,
      keyCode,
      keyPressCode,
      inputLength,
    } = this.state;
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

    const prevPosition = Math.min(prevState.cursorPosition, cursorPosition);
    const prevValueBeforeCursor = prevState.value.slice(0, prevPosition);
    const prevTextBeforeCursor = prevState.text.slice(0, prevPosition);
    const valueBeforeCursor = value.slice(0, cursorPosition);
    const textBeforeCursor = text.slice(0, cursorPosition);
    const valueDifference = value.length - prevState.value.length;
    const unexpectedDifference = valueDifference - inputLength;
    const prevMaskDifference = difference(
      prevTextBeforeCursor.split(''),
      prevValueBeforeCursor.split(''),
    );
    const maskDifference = difference(textBeforeCursor.split(''), valueBeforeCursor.split(''));
    const maskDelta = maskDifference.length - prevMaskDifference.length;

    let newCursorPosition;

    const enteredChar = String.fromCharCode(keyPressCode);

    if (
      maskDelta === 0 &&
      maskDifference.join('') !== prevMaskDifference.join('') &&
      maskDifference.indexOf(enteredChar) !== -1 &&
      maskDifference.indexOf(text.charAt(prevState.cursorPosition - 1)) !== -1
    ) {
      newCursorPosition = prevState.cursorPosition;
    } else if (
      maskDelta === 1 &&
      maskDifference.join('') !== prevMaskDifference.join('') &&
      maskDifference.indexOf(enteredChar) !== -1 &&
      maskDifference.indexOf(text.charAt(cursorPosition - 1)) !== -1
    ) {
      newCursorPosition = cursorPosition;
    } else {
      newCursorPosition = cursorPosition + maskDelta + unexpectedDifference;
    }

    setCursorPosition(this.inputElement, newCursorPosition);
  }

  getInput() {
    return this.inputElement;
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
    const inputLength = value.length - this.state.text.length;
    this.setState({
      inputLength,
    });
    const newValue = this.props.getUnformattedValue(value).toString();
    this.saveCursorPosition();
    if (newValue === this.state.value) { return; }
    if (this.props.onChange) {
      this.props.onChange(evt, newValue);
    }
    if (this.state.isUncontrolledInput) {
      this.setState({
        value: String(newValue),
        text: String(this.props.getFormattedValue(newValue)),
        inputLength,
      });
    }
  }

  handleKeyDown(evt) {
    this.setState({
      keyCode: evt.which,
      eventIsModified: isModifiedEvent(evt),
    });
    if (this.props.onKeyDown) {
      this.props.onKeyDown(evt);
    }
  }

  handleKeyUp(evt) {
    this.saveCursorPosition();
    if (this.props.onKeyUp) {
      this.props.onKeyUp(evt);
    }
  }

  handleKeyPress(evt) {
    this.setState({
      keyPressCode: evt.which,
    });
    if (this.props.onKeyPress) {
      this.props.onKeyPress(evt);
    }
  }

  render() {
    const domProps = omit(this.props, [
      'value',
      'defaultValue',
      'getUnformattedValue',
      'getFormattedValue',
    ]);
    return (
      <input
        type="text"
        {...domProps}
        ref={this.mount}
        value={this.state.text}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        onKeyPress={this.handleKeyPress}
        onChange={this.handleChange}
      />
    );
  }
}

FormattedInput.propTypes = propTypes;
FormattedInput.defaultProps = defaultProps;

export default FormattedInput;
