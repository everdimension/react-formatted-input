A react component for formatting input text based on the provided formatter
function.

### Usage

A simple input which adds commas as a thousands separator:

```javascript
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

function ThousandsSeparator() {
  return (
    <FormattedInput
      type="text"
      getFormattedValue={addThousandsSeparator}
      getUnformattedValue={removeThousandsSeparator}
      defaultValue="1234"
    />
  );
}
```
