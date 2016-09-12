/* global window */
import React, { PropTypes as t } from 'react';
import omit from 'lodash/omit';
import { KEY_CODES } from './constants';

const notNumberRe = /[^\d]/;

const shortLocaleMap = {
	en: 'en-US',
	zh: 'zh-CN',
	ru: 'ru-RU',
	de: 'de-DE',
	fr: 'fr-FR',
	pt: 'pt-PT',
	es: 'es-ES',
	id: 'id-ID',
	it: 'it-IT',
	nl: 'nl-NL',
	pl: 'pl-PL',
};

const localeRe = {
	'en-US': /[^\d\.\-]/g,
	'zh-CN': /[^\d\.\-]/g,
	'ru-RU': /[^\d,\-]/g,
	'de-DE': /[^\d,\-]/g,
	'fr-FR': /[^\d,\-]/g,
	'pt-PT': /[^\d,\-]/g,
	'pt-BR': /[^\d,\-]/g,
	'es-ES': /[^\d,\-]/g,
	'id-ID': /[^\d,\-]/g,
	'it-IT': /[^\d,\-]/g,
	'nl-NL': /[^\d,\-]/g,
	'pl-PL': /[^\d,\-]/g,
};

function getFullLocale(locale) {
	return locale.length === 2 ? shortLocaleMap[locale] : locale;
}

function getUnformattedValue(n, locale) {
	if (!n || n === '-' || typeof n === 'number') {
		return n;
	}

	const stripped = n
		.replace(localeRe[locale], '')
		.replace(',', '.');

	const parsed = parseFloat(stripped, 10);
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
	locale: t.string,
	onChange: t.func.isRequired,
	getFormattedNumber: t.func,
	getUnformattedValue: t.func,
};

const defaultProps = {
	value: '',
	locale: 'en-US',
};

class FormattedInput extends React.Component {
	constructor(props) {
		super(props);

		if (!window.Intl) {
			throw new Error('Intl API required on window');
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.setFormatter = this.setFormatter.bind(this);
		this.getFormattedNumber = props.getFormattedNumber || this.getFormattedNumber.bind(this);
		this.getUnformattedValue = props.getUnformattedValue || getUnformattedValue;
		this.mount = this.mount.bind(this);
		this.focus = this.focus.bind(this);

		const { locale, value } = props;
		const fullLocale = getFullLocale(locale);
		this.setFormatter(fullLocale);
		this.state = {
			selectionStart: 0,
			selectionEnd: 0,
			cursorPosition: 0,
			value,
			locale: fullLocale,
			text: this.getFormattedNumber(value),
			keyCode: null,
		};
	}

	componentWillReceiveProps(nextProps) {
		const { locale, value } = nextProps;
		let newLocale;
		if (locale !== this.props.locale) {
			newLocale = getFullLocale(locale);
			this.setFormatter(newLocale);
		}
		const text = this.getFormattedNumber(value);

		const newState = { value, text };
		if (newLocale) {
			newState.locale = newLocale;
		}
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

	setFormatter(locale) {
		this.formatter = new Intl.NumberFormat(locale);
	}

	getFormattedNumber(n) {
		if (!n || n === '-') { return n; }
		const formattedString = this.formatter.format(n);
		if (!/^[\-\d]/.test(formattedString)) { return n; }
		return formattedString;
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
		const newValue = this.getUnformattedValue(value, this.state.locale).toString();
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
		const otherProps = omit(this.props, ['value', 'locale', 'getUnformattedValue', 'getFormattedNumber']);
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
