import bem from 'bem-css-modules';


const mockCSSModule = {
    input: 'HASH_INPUT',
    input_disabled: 'HASH_INPUT_DISABLED',
    input__field: 'HASH_INPUT_FIELD',
    input__field_disabled: 'HASH_INPUT_FIELD_DISABLED',
    input__field_type_text: 'HASH_INPUT_FIELD_TYPE_TEXT',
    input__field_type_phone: 'HASH_INPUT_FIELD_TYPE_PHONE',
    input__icon: 'HASH_INPUT_ICON',
    'is-active': 'HASH_IS_ACTIVE',
    'is-removed': 'HASH_IS_REMOVED',
};

const namesToArray = (name) =>
    name.split(' ').sort();

describe('bem-css-modules', () => {
    const block = bem(mockCSSModule);

    it('should return base element', () => {
        expect(block()).toBe('HASH_INPUT');
        expect(block(null)).toBe('HASH_INPUT');
        expect(block('')).toBe('HASH_INPUT');
    });

    it('should return base element with mods', () => {
        expect(
            namesToArray(block('', {disabled: true}))
        ).toEqual(namesToArray('HASH_INPUT HASH_INPUT_DISABLED'));

        expect(
            namesToArray(block(null, {disabled: true}))
        ).toEqual(namesToArray('HASH_INPUT HASH_INPUT_DISABLED'));

        expect(
            namesToArray(block({disabled: true}))
        ).toEqual(namesToArray('HASH_INPUT HASH_INPUT_DISABLED'));
    });

    it('should return base element with mods and states', () => {
        expect(
            namesToArray(block('', {disabled: true}, {active: true}))
        ).toEqual(namesToArray('HASH_INPUT HASH_INPUT_DISABLED HASH_IS_ACTIVE'));

        expect(
            namesToArray(block(null, {disabled: true}, {active: true}))
        ).toEqual(namesToArray('HASH_INPUT HASH_INPUT_DISABLED HASH_IS_ACTIVE'));

        expect(
            namesToArray(block({disabled: true}, {active: true}))
        ).toEqual(namesToArray('HASH_INPUT HASH_INPUT_DISABLED HASH_IS_ACTIVE'));
    });

    it('should return elements', () => {
        expect(block('icon')).toBe('HASH_INPUT_ICON');
        expect(block('field')).toBe('HASH_INPUT_FIELD');

        expect(bem({input__field: 'foo'})('field')).toBe('foo');
    });

    it('should return elements with mods', () => {
        expect(block('field', {disabled: true})).toBe('HASH_INPUT_FIELD HASH_INPUT_FIELD_DISABLED');
        expect(block('field', {disabled: false})).toBe('HASH_INPUT_FIELD');
        expect(block('field', {type: 'text'})).toBe('HASH_INPUT_FIELD HASH_INPUT_FIELD_TYPE_TEXT');
        expect(
            namesToArray(block('field', {type: 'phone', disabled: true}))
        ).toEqual(namesToArray('HASH_INPUT_FIELD HASH_INPUT_FIELD_TYPE_PHONE HASH_INPUT_FIELD_DISABLED'));
    });

    it('should return elements with states', () => {
        expect(block('field', null, {active: true, removed: false})).toBe('HASH_INPUT_FIELD HASH_IS_ACTIVE');
        expect(
            namesToArray(block('field', null, {active: true, removed: true}))
        ).toEqual(namesToArray('HASH_INPUT_FIELD HASH_IS_ACTIVE HASH_IS_REMOVED'));

        expect(
            namesToArray(block(null, null, {active: true, removed: true}))
        ).toEqual(namesToArray('HASH_INPUT HASH_IS_ACTIVE HASH_IS_REMOVED'));
    });

    it('should return elements with mods and states', () => {
        expect(
            namesToArray(block('field', {disabled: true}, {active: true, removed: true}))
        ).toEqual(namesToArray('HASH_INPUT_FIELD HASH_IS_ACTIVE HASH_IS_REMOVED HASH_INPUT_FIELD_DISABLED'));
        expect(
            namesToArray(block('field', {disabled: true, type: 'text'}, {active: true, removed: true}))
        ).toEqual(
            namesToArray('HASH_INPUT_FIELD HASH_IS_ACTIVE HASH_IS_REMOVED HASH_INPUT_FIELD_DISABLED HASH_INPUT_FIELD_TYPE_TEXT')
        );
    });

    it('should work with dirty module', () => {
        let dirtyBlock = bem({
            input: 'INPUT',
            input__icon: 'INPUT__ICON',
            button: 'BUTTON',
            button__icon: 'BUTTON__ICON',
        }, 'button');

        expect(dirtyBlock()).toBe('BUTTON');
        expect(dirtyBlock('icon')).toBe('BUTTON__ICON');

        dirtyBlock = bem({
            input: 'INPUT',
            input__icon: 'INPUT__ICON',
            button: 'BUTTON',
            button__icon: 'BUTTON__ICON',
        }, 'input');

        expect(dirtyBlock()).toBe('INPUT');
        expect(dirtyBlock('icon')).toBe('INPUT__ICON');
    });

    describe('errors with throwOnError = true', () => {
        beforeEach(() => {
            bem.setSettings({throwOnError: true});
        });

        afterAll(() => {
            bem.setSettings({throwOnError: false});
        });

        it('should throw error with invalid css modules', () => {
            expect(() => bem()).toThrowError('cssModule object should be a Object with keys');
            expect(() => bem(null)).toThrowError('cssModule object should be a Object with keys');
            expect(() => bem(false)).toThrowError('cssModule object should be a Object with keys');
            expect(() => bem('foo')).toThrowError('cssModule object should be a Object with keys');
            expect(() => bem([])).toThrowError('cssModule object should be a Object with keys');
        });

        it('should throw error with css modules without keys', () => {
            expect(() => bem({})).toThrowError('cssModule has no keys');

            function SomeClass() {
                // pass
            }

            SomeClass.prototype = {foo: 1};

            expect(() => bem(new SomeClass())).toThrowError('cssModule has no keys');
        });

        it('should throw error with unexisted elements', () => {
            expect(() => block('foo')).toThrowError('There is no input__foo in cssModule');
        });

        it('should throw error with unexisted mods', () => {
            expect(() => block('icon', {foo: true})).toThrowError('There is no input__icon_foo in cssModule');
            expect(() => block('icon', {foo: 'bar'})).toThrowError('There is no input__icon_foo_bar in cssModule');
        });

        it('should throw error with unexisted states', () => {
            expect(() => block('icon', null, {foo: true})).toThrowError('There is no is-foo in cssModule');
        });
    });

    describe('errors with throwOnError = false', () => {
        let spy;

        beforeEach(() => {
            spy = jest.spyOn(global.console, 'warn').mockImplementation(() => null);
        });

        afterEach(() => {
            spy.mockReset();
            spy.mockRestore();
        });

        it('should throw error with invalid css modules', () => {
            [
                [() => bem(), 'cssModule object should be a Object with keys'],
                [() => bem(null), 'cssModule object should be a Object with keys'],
                [() => bem(false), 'cssModule object should be a Object with keys'],
                [() => bem('foo'), 'cssModule object should be a Object with keys'],
                [() => bem([]), 'cssModule object should be a Object with keys'],
            ].forEach(([fn, message]) => {
                spy.mockReset();
                fn();
                expect(spy).toHaveBeenCalledWith(message);
            });
        });

        it('should throw error with css modules without keys', () => {
            bem({});
            expect(spy).toHaveBeenCalledWith('cssModule has no keys');

            function SomeClass() {
                // pass
            }

            SomeClass.prototype = {foo: 1};

            bem(new SomeClass());
            expect(spy).toHaveBeenCalledWith('cssModule has no keys');
        });

        it('should throw error with unexisted elements', () => {
            block('foo');
            expect(spy).toHaveBeenCalledWith('There is no input__foo in cssModule');
        });

        it('should throw error with unexisted mods', () => {
            block('icon', {foo: true});
            expect(spy).toHaveBeenCalledWith('There is no input__icon_foo in cssModule');

            block('icon', {foo: 'bar'});
            expect(spy).toHaveBeenCalledWith('There is no input__icon_foo_bar in cssModule');
        });

        it('should throw error with unexisted states', () => {
            block('icon', null, {foo: true});
            expect(spy).toHaveBeenCalledWith('There is no is-foo in cssModule');
        });
    });
});
