import React from 'react';
import test from 'tape';
import { mount, shallow } from 'enzyme';
import FormattedInput from '../src';

// TODO:
// 1. Test formatting according with passed formatter function
// 2. Test unformatting
// 3. Test cursor position

test('FormattedInput', (t) => {
  function getWrapperComponent() {
    return mount(
      <FormattedInput
        type="text"
        name="testElement"
        value=""
        getFormattedValue={() => {}}
        getUnformattedValue={() => {}}
        onChange={() => {}}
      />,
    );
  }

  function getShallowComponent() {
    return shallow(
      <FormattedInput
        type="text"
        name="testElement"
        value=""
        getFormattedValue={() => {}}
        getUnformattedValue={() => {}}
        onChange={() => {}}
      />,
    );
  }

  t.test('renders an input element', (assert) => {
    const wrapper = getWrapperComponent();

    const renderedInput = wrapper.find('input');
    const inputNode = renderedInput.get(0);

    assert.equal(renderedInput.length, 1, 'renders input element');
    assert.equal(inputNode.getAttribute('type'), 'text', 'passed type attribute');
    assert.equal(inputNode.name, 'testElement', 'has passed name attribute');

    assert.end();
  });

  t.test('provides a "focus" method', (assert) => {
    const wrapper = getShallowComponent();

    assert.equal(typeof wrapper.instance().focus, 'function');

    assert.end();
  });
});
