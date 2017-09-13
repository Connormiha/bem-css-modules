import block from '../../src/bem-css-modules.js';

block({foo: '1'});
block({foo: '1'})('element');
block({foo: '1'})();
block({foo: '1'})(null);
block({foo: '1'})(null, {foo: true, foo2: '', foo3: '1'});
block({foo: '1'})(null, null, {foo: true, foo1: false});
