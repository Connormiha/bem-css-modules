/**
 * Base function for bem naming with css modules
 * @param {Object} cssModule. Imported css module
 * @param {String} name. BEM name
 * @param {String} [element]
 * @param {Object} [mods]
 * @param {Object} [states]
 * @return {String}
 */
function block(cssModule, name, elementParam, modsParam, statesParam) {
    const isElementAsModes = elementParam && typeof elementParam === 'object';
    const mods = isElementAsModes ? elementParam : modsParam;
    const states = isElementAsModes ? modsParam : statesParam;
    const element = isElementAsModes ? '' : elementParam;

    const baseBlock = element ? `${name}__${element}` : name;
    let result = cssModule[baseBlock];

    if (process.env.NODE_ENV !== 'production') {
        if (!result) {
            throw Error(`There is no ${name}__${element} in cssModule`);
        }
    }

    if (mods) {
        result = Object.keys(mods)
            .reduce((acc, next) => {
                const modValue = mods[next];

                let mod;

                if (typeof modValue === 'boolean') {
                    if (process.env.NODE_ENV !== 'production') {
                        if (!(`${baseBlock}_${next}` in cssModule)) {
                            throw Error(`There is no ${baseBlock}_${next} in cssModule`);
                        }
                    }

                    if (modValue) {
                        mod = cssModule[`${baseBlock}_${next}`];
                    } else {
                        return acc;
                    }
                } else {
                    if (process.env.NODE_ENV !== 'production') {
                        if (!(`${baseBlock}_${next}_${mods[next]}` in cssModule)) {
                            throw Error(`There is no ${baseBlock}_${next}_${mods[next]} in cssModule`);
                        }
                    }

                    mod = cssModule[`${baseBlock}_${next}_${mods[next]}`];
                }

                return `${acc} ${mod}`;
            }, result);
    }

    if (states) {
        result = Object.keys(states)
            .reduce((acc, next) => {
                if (!states[next]) {
                    return acc;
                }

                const state = cssModule[`is-${next}`];

                if (!state) {
                    throw Error(`There is no is-${next} in cssModule`);
                }

                return `${acc} ${state}`;
            }, result);
    }

    return result;
}

const regExpClearBEM = /__.*/g;

const extractModuleName = (cssModule) => {
    if (process.env.NODE_ENV !== 'production') {
        if (!cssModule || typeof cssModule !== 'object' || Array.isArray(cssModule)) {
            throw Error('cssModule object should be a Object with keys');
        }
    }

    const [name] = Object.keys(cssModule);

    if (process.env.NODE_ENV !== 'production') {
        if (!name) {
            throw Error('cssModule has no keys');
        }
    }

    return name.replace(regExpClearBEM, '');
};

const bem = (cssModule, name) =>
    block.bind(null, cssModule, name || extractModuleName(cssModule));

export default bem;
