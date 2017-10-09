[![Build Status](https://travis-ci.org/Connormiha/bem-css-modules.svg?branch=master)](https://travis-ci.org/Connormiha/bem-css-modules)

# BEM class names generator for Webpack CSS modules
Simple [BEM](https://en.bem.info/) class name generator for Webpack CSS modules.

### Rationale
Webpack generated CSS modules, that compress each css name. In production we have short css names like 'FAfaf', but in code base we have human names like 'input', 'input__label', 'input_type_text' etc.

We set up Webpack for modulality css files
```js
loader: {
    'css-loader',
    options: {
        localIdentName: '[hash:base64:5]', // or may be '[local]' for dev.
        modules: true
    }
}
```

We have some css with BEM CSS naming
```stylus
// form-payment.styl
.form
    display: block
    &__label
        color: blue
        &_error
            color: red
    &__title
        font-size: 18px
```
Now we can import css files inside Javascript files with short names(compressed by Webpack).

### Example (without BEM generator)
Javascript component
```jsx
import style from './form-payment.styl';

/**
    stylus is object like Map<realName, hashedName>
    {
        form: 'Daffg',
        form__title: 'FGsgT',
        form__label: 'RtHuS',
        form__label_error: 'AFGHs',
    }
*/

export default () => {
    return (
        <div className={stylus.form}>
            {/* We get className from imported style module*/}
            <h1 className={stylus['form__title']}>Title</h1>
            <label className={stylus['form__label']}>
                Simple label
            <labale>
            <label className={stylus['form__label'] + ' ' + stylus['form__label_error']}>
                Label Error
            <labale>
        </div>
    );
}
```
If we have many elements with a lot of modifiers, then it is difficult to concat the class name.  
With bem-css-modules we can simplify component code with BEM generator for imported module.
### Example (with BEM generator)
```jsx
import style from './form-payment.styl';
import block from 'bem-css-modules';

const b = block(style); // Create BEM Generator for current CSS module

export default () => {
    return (
        <div className={b()}>
            <h1 className={b('title')}>Title</h1>
            <label className={b('label')}>
                Simple label
            </label>
            <label className={b('label', {error: true})}>
                Label Error
            </label>
        </div>
    );
}
```

#API
```js
import style from './input.css';
import block from 'bem-css-modules';

const b = (style);// Create BEM Generator for current CSS module
/*
style is object like this
{
    input: 'HASH_INPUT',
    input__field: 'HASH_INPUT_FIELD',
    input__field_disabled: 'HASH_INPUT_FIELD_DISABLED',
    input__field_type_text: 'HASH_INPUT_FIELD_TYPE_TEXT',
    input__field_type_phone: 'HASH_INPUT_FIELD_TYPE_PHONE',
    input__icon: 'HASH_INPUT_ICON',
    'is-active': 'HASH_IS_ACTIVE',
    'is-removed': 'HASH_IS_REMOVED',
}
*/

b(); // 'HASH_INPUT'
b('field'); // 'HASH_INPUT_FIELD'  (form BEM's input__field)
b('field', {type: 'text'}); // 'HASH_INPUT_FIELD HASH_INPUT_FIELD_TYPE_TEXT'  (form BEM's 'input__field input__field_type_text')
b('field', {disabled: true}); // 'HASH_INPUT_FIELD HASH_INPUT_FIELD_DISABLED'  (form BEM's 'input__field input__field_type_text')
b('icon', null, {active: true, removed: false); // 'HASH_INPUT_ICON HASH_IS_ACTIVE' (from BEM's 'input__icon is-active')
b('icon', {active: true, removed: false); // 'HASH_INPUT_ICON HASH_IS_ACTIVE' (from BEM's 'input__icon is-active')
```

### Flow and Typescript

Flow and Typescript definitions already included.

### Options
Type: `Object`  

##### throwOnError
Type: `Boolean`  
Default: `false`  

Throw exception if mod, element or state didn't found.
