import React from 'react';
import test from 'tape';
import { mount } from 'enzyme';
import FormattedInput from '../src';
import { KEY_CODES } from '../src/constants';

// TODO:
// 1. test pasting
// 2. test cutting partial text
// 3. test formatting negative numbers
// 4. test formatting float numbers

test('FormattedInput', t => {
	function getWrapperComponent() {
		return mount(
			<FormattedInput
				type="text"
				name="testElement"
				value=""
				onChange={() => {}}
			/>
		);
	}

	t.test('renders an input element', assert => {
		const wrapper = mount(
			<FormattedInput
				type="text"
				name="testElement"
				onChange={() => {}}
			/>
		);

		const renderedInput = wrapper.find('input');
		const inputNode = renderedInput.get(0);

		assert.equal(renderedInput.length, 1, 'renders input element');
		assert.equal(inputNode.getAttribute('type'), 'text', 'passed type attribute');
		assert.equal(inputNode.name, 'testElement', 'has passed name attribute');

		assert.end();
	});

	t.test('adds thousands separator to the passed value', assert => {
		const numberValue = '1234';
		const formattedValueRe = /^1\W234$/;
		const wrapper = mount(
			<FormattedInput
				type="text"
				name="testElement"
				value={numberValue}
				onChange={() => {}}
			/>
		);

		const inputNode = wrapper.find('input').get(0);

		assert.ok(
			formattedValueRe.test(inputNode.value),
			`${numberValue} -> ${inputNode.value}`
		);

		const numberValue2 = '5000222';
		const formattedValueRe2 = /^5\W000\W222$/;
		const wrapper2 = mount(
			<FormattedInput
				type="text"
				name="testElement"
				value={numberValue2}
				onChange={() => {}}
			/>
		);

		const inputNode2 = wrapper2.find('input').get(0);

		assert.ok(
			formattedValueRe2.test(inputNode2.value),
			`${numberValue2} -> ${inputNode2.value}`
		);

		assert.end();
	});

	t.test('updates value when props are changed', assert => {
		const initialValue = '1234';
		const expectedFormattedValueRe = /^1\W234$/;

		const newValue = '789456123';
		const expectedFormattedValueAfterUpdateRe = /^789\W456\W123$/;

		const wrapper = mount(
			<FormattedInput
				type="text"
				name="testElement"
				value={initialValue}
				onChange={() => {}}
			/>
		);

		const inputNode = wrapper.find('input').get(0);

		assert.ok(
			expectedFormattedValueRe.test(inputNode.value),
			`initial value ${initialValue} -> ${inputNode.value}`
		);

		// update props
		wrapper.setProps({ value: newValue });

		assert.ok(
			expectedFormattedValueAfterUpdateRe.test(inputNode.value),
			`after props changed to ${newValue}, updated value -> ${inputNode.value}`
		);

		assert.end();
	});

	t.test('updates accordingly when new value is empty', assert => {
		const initialValue = '1234';
		const wrapper = mount(
			<FormattedInput
				type="text"
				name="testElement"
				value={initialValue}
				onChange={() => {}}
			/>
		);

		const inputNode = wrapper.find('input').get(0);
		assert.ok(
			inputNode.value,
			'initial value is not empty'
		);

		wrapper.setProps({ value: '' });
		assert.equals(
			inputNode.value,
			'',
			'after props changed to empty value, input value is empty, too'
		);

		assert.end();
	});

	t.test('-- Cursor position', tt => {
		tt.test('Backspace', ttt => {
			ttt.test('cursorPosition for simple value', assert => {
				const numberValue = '123';
				// formattedValue should be '123';
				const initialCursorPosition = 2; // after digit '2'

				const numberValueAfterBackspace = '13';
				// formattedValueAfterBackspace should be '13';
				const expectedCursorPositionAfterBackspace = 1;

				const wrapper = getWrapperComponent();
				wrapper.setProps({ value: numberValue });

				const inputNode = wrapper.find('input').get(0);
				inputNode.focus();
				// set cursor to initial position
				inputNode.setSelectionRange(initialCursorPosition, initialCursorPosition);

				// simulate backspace
				wrapper.simulate('keyDown', { which: KEY_CODES.BACKSPACE });
				// set "backspaced" value as a new prop
				wrapper.setProps({ value: numberValueAfterBackspace });

				// cursor should have moved to position 1
				assert.equals(
					inputNode.selectionStart,
					expectedCursorPositionAfterBackspace,
					'sets correct cursorPosition after BACKSPACE when formatting is unchanged'
				);

				assert.end();
			});

			ttt.test('cursorPosition for formatted value', assert => {
				const numberValue = '1234';
				// formattedValue = '1,234';
				const initialCursorPosition = 3; // after digit '2'

				const numberValueAfterBackspace = '134';
				// backspace removes both the digit '2' and the thousands separator
				// formattedValueAfterBackspace = '134';
				const expectedCursorPositionAfterBackspace = 1;

				const wrapper = getWrapperComponent();
				wrapper.setProps({ value: numberValue });

				const renderedInput = wrapper.find('input');
				const inputNode = renderedInput.get(0);
				inputNode.focus();
				// set cursor to initial position
				inputNode.setSelectionRange(initialCursorPosition, initialCursorPosition);

				// simulate backspace
				wrapper.simulate('keyDown', { which: KEY_CODES.BACKSPACE });
				// set "backspaced" value as a new prop
				wrapper.setProps({ value: numberValueAfterBackspace });

				// cursor should have moved to position 1
				assert.equals(
					inputNode.selectionStart,
					expectedCursorPositionAfterBackspace,
					'sets correct cursorPosition after backspace when formatting is changed'
				);

				assert.end();
			});
		});

		tt.test('Delete', ttt => {
			ttt.test('cursorPosition for simple value', assert => {
				const numberValue = '123';
				// formattedValue = '123';
				const initialCursorPosition = 1; // before digit '2'

				const numberValueAfterDelete = '13';
				// formattedValueAfterDelete = '13';
				const expectedCursorPositionAfterDelete = 1;

				const wrapper = getWrapperComponent();
				wrapper.setProps({ value: numberValue });

				const inputNode = wrapper.find('input').get(0);
				inputNode.focus();
				// set cursor to initial position
				inputNode.setSelectionRange(initialCursorPosition, initialCursorPosition);

				// simulate delete
				wrapper.simulate('keyDown', { which: KEY_CODES.DEL });
				// set "value after delete" as a new prop
				wrapper.setProps({ value: numberValueAfterDelete });

				// cursor should not have moved
				assert.equals(
					inputNode.selectionStart,
					expectedCursorPositionAfterDelete,
					'sets correct cursorPosition after DELETE when formatting is unchanged'
				);

				assert.end();
			});

			ttt.test('cursorPosition for formatted value', assert => {
				const numberValue = '1234';
				// formattedValue = '1,234';
				const initialCursorPosition = 2; // before digit '2'

				const numberValueAfterDelete = '134';
				// formattedValueAfterDelete = '134';
				const expectedCursorPositionAfterDelete = 1; // before digit '3'

				const wrapper = getWrapperComponent();
				wrapper.setProps({ value: numberValue });

				const inputNode = wrapper.find('input').get(0);
				inputNode.focus();
				// set cursor to initial position
				inputNode.setSelectionRange(initialCursorPosition, initialCursorPosition);

				// simulate delete
				wrapper.simulate('keyDown', { which: KEY_CODES.DEL });
				// set "value after delete" as a new prop
				wrapper.setProps({ value: numberValueAfterDelete });

				// cursor should have moved to position 1
				assert.equals(
					inputNode.selectionStart,
					expectedCursorPositionAfterDelete,
					'sets correct cursorPosition after DELETE when formatting is changed'
				);

				assert.end();
			});
		});

		tt.test('Cursor position after multiple deletion', assert => {
			const wrapper = getWrapperComponent();
			const inputNode = wrapper.find('input').get(0);
			const testValues = ['123', '1234', '123456', '1234567'];

			wrapper.setProps({ value: testValues[0] });
			// select all text
			inputNode.setSelectionRange(0, testValues[0].length);
			// interact with the element so that selection range is "recorded"
			wrapper.simulate('keyDown', { which: KEY_CODES.LEFT }); // just some keycode

			// type another number instead of selected text
			wrapper.setProps({ value: '9' });
			assert.equals(
				inputNode.selectionStart,
				1,
				'simple value case — all text replaced with one digit'
			);

			wrapper.setProps({ value: testValues[3] });
			// select all text
			inputNode.setSelectionRange(0, testValues[3].length + 2);
			// interact with the element so that selection range is "recorded"
			wrapper.simulate('keyDown', { which: KEY_CODES.LEFT }); // just some keycode

			// type another number instead of selected text
			wrapper.setProps({ value: '9' });
			assert.equals(
				inputNode.selectionStart,
				1,
				'formatted value case — all text replaced with one digit'
			);

			wrapper.setProps({ value: testValues[3] });
			// select all text
			inputNode.setSelectionRange(0, testValues[3].length + 2);
			// interact with the element so that selection range is "recorded"
			wrapper.simulate('keyDown', { which: KEY_CODES.LEFT }); // just some keycode

			// type another number instead of selected text
			wrapper.setProps({ value: '999' });
			assert.equals(
				inputNode.selectionStart,
				3,
				'formatted value case — pasting text instead of selected text'
			);

			wrapper.setProps({ value: testValues[2] });
			// select all text
			inputNode.setSelectionRange(3, 5);
			// interact with the element so that selection range is "recorded"
			wrapper.simulate('keyDown', { which: KEY_CODES.LEFT }); // just some keycode

			// type another number instead of selected text
			wrapper.setProps({ value: '12399956' });
			assert.equals(
				inputNode.selectionStart,
				8,
				`formatted value case — pasting text instead of partially selected text ${inputNode.value}`
			);

			assert.end();
		});
	});

	t.test('exposes .focus() method', tt => {
		tt.test('method exists', assert => {
			const wrapper = getWrapperComponent();
			const component = wrapper.get(0);

			assert.ok(component.focus, 'has \'focus\' property');
			assert.equals(
				typeof component.focus,
				'function',
				'\'focus\' property is function'
			);

			assert.end();
		});

		tt.test('method workds', assert => {
			const numberValue = '1234';
			const initialCursorPosition = 1; // before digit '2'

			const newValue = '123456789';

			const wrapper = getWrapperComponent();
			wrapper.setProps({ value: numberValue });

			const inputNode = wrapper.find('input').get(0);
			inputNode.focus();
			// set cursor to initial position
			inputNode.setSelectionRange(initialCursorPosition, initialCursorPosition);

			assert.equals(inputNode.selectionStart, initialCursorPosition, 'cursor before focus');

			// blur input
			inputNode.blur();

			// update value
			wrapper.setProps({ value: newValue });

			const component = wrapper.get(0);
			// use component's focus mehtod
			component.focus();

			assert.equals(
				inputNode.selectionStart,
				inputNode.value.length,
				'cursor is set to end after focus method has been invoked'
			);

			assert.end();
		});
	});
});
