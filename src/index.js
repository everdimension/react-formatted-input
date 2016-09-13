import React, { PropTypes as t } from 'react';
import omit from 'lodash/omit';
import { KEY_CODES } from './constants';

const notNumberRe = /[^\d]/g;

function getFormattedString(n) {
	if (!n || !n.toString) {
		return n;
	}

	return n.toString()
		.split('')
		.reverse()
		.reduce((res, d, index) => {
		  if (index && index % 3 === 0) {
		   res.push(' ');
		  }
		  res.push(d);
		  return res;
		}, [])
		.reverse()
		.join('');
}

function getUnformattedValue(n) {
	if (!n || n === '-' || typeof n === 'number') {
		return n;
	}

	const stripped = n
		.replace(notNumberRe, '');

	const parsed = parseFloat(stripped);
	if (isNaN(parsed)) { return n; }

	return parsed;
}

function getCursorPosition(el) {
	return el.selectionStart;
}

function setCursorPosition(el, pos) {
	el.setSelectionRange(pos, pos);
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
		this.getFormattedValue = props.getFormattedValue || this.getFormattedValue.bind(this);
		this.getUnformattedValue = props.getUnformattedValue || getUnformattedValue;
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
			selectionStart,
			selectionEnd,
			cursorPosition,
			text,
			keyCode,
			value,
		} = this.state;
		if (text === prevState.text) {
			return;
		}

		this.inputElement.value = text;
		if (!text) {
			// dont calculate and set cursor position for empty value
			// because it is always correct anyway
			return;
		}

		const valueDifference = value.length - prevState.value.length;
		const textDifference = text.length - prevState.text.length;
		const delta = textDifference - valueDifference;
		const isDeletion = valueDifference < 0;

		// if some text was selected and new text differs from old text,
		// it means that selected text has been removed
		const isDeletionOfSelection = selectionEnd > selectionStart;
		let newCursorPosition;
		if (isDeletionOfSelection) {
			// if selected text was removed and/or new text has been
			// pasted or entered in place of selected text,
			// cursor position must be at the end of newly added text
			// or in place of selection if there's no new text
			newCursorPosition = selectionEnd + textDifference;
		} else if (isDeletion && keyCode === KEY_CODES.DEL) {
			newCursorPosition = cursorPosition + delta;
		} else if (isDeletion) {
			newCursorPosition = (cursorPosition - 1) + delta;
		} else {
			newCursorPosition = cursorPosition + textDifference;
		}

		setCursorPosition(this.inputElement, newCursorPosition);
	}

	getFormattedValue(n) {
		if (!n) {
			return n;
		}

		return getFormattedString(n);
	}

	mount(node) {
		this.inputElement = node;
	}

	focus() {
		setCursorPosition(this.inputElement, this.inputElement.value.length);
		this.inputElement.focus();
	}

	handleChange(evt) {
		const { value } = evt.target;
		const newValue = this.getUnformattedValue(value).toString();
		if (newValue === this.state.value) { return; }
		// const updatedEvent = Object.assign({}, evt, {
		//	 target: Object.assign({}, evt.target, {
		//		 value: newValue,
		//	 }),
		// });
		this.props.onChange(evt, newValue);
	}

	handleKeyDown(evt) {
		this.setState({
			cursorPosition: getCursorPosition(this.inputElement),
			keyCode: evt.which,
			selectionStart: evt.target.selectionStart,
			selectionEnd: evt.target.selectionEnd,
		});
	}

	render() {
		const otherProps = omit(this.props, ['value', 'getUnformattedValue', 'getFormattedValue']);
		return (
			<input
				type="text"
				{...otherProps}
				ref={this.mount}
				value={this.state.text}
				onKeyDown={this.handleKeyDown}
				onChange={this.handleChange}
			/>
		);
	}
}

FormattedInput.propTypes = propTypes;
FormattedInput.defaultProps = defaultProps;

export default FormattedInput;
