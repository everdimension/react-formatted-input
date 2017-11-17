import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const jsdom = require('jsdom').jsdom;

Enzyme.configure({ adapter: new Adapter() });

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
	if (typeof global[property] === 'undefined') {
		exposedProperties.push(property);
		global[property] = document.defaultView[property];
	}
});

global.navigator = {
	userAgent: 'node.js',
};

global.documentRef = document;

// ignore css
function noop() {
	return null;
}

require.extensions['.css', '.scss'] = noop;
