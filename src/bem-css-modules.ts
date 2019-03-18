type CssModuleType = {
    [key: string]: string;
} | {
    readonly [key: string]: string;
};

interface ModsType {
    [key: string]: boolean | string | number | undefined;
}

interface StatesType {
    [key: string]: boolean | undefined;
}

interface IBlock {
    (element?: string, mods?: ModsType | null, states?: StatesType | null): string;
    (mods?: ModsType | null, states?: StatesType | null): string;
}

interface IOptions {
    throwOnError?: boolean;
    elementDelimiter?: string;
    modifierDelimiter?: string;
}

interface IModule {
    (cssModule: CssModuleType, name?: string): IBlock;
    setSettings(options: IOptions): void;
}

const isDev = process.env.NODE_ENV !== 'production';
const settings = {
    throwOnError: false,
    elementDelimiter: '__',
    modifierDelimiter: '_'
};

/**
 * Base function for bem naming with css modules
 * @param {Object} cssModule. Imported css module
 * @param {String} name. BEM name
 * @param {String} [element]
 * @param {Object} [mods]
 * @param {Object} [states]
 * @return {String}
 */
function block(cssModule: CssModuleType, name: string, elementParam, modsParam, statesParam) {
    const isElementAsModes = elementParam && typeof elementParam === 'object';
    const mods = isElementAsModes ? elementParam : modsParam;
    const states = isElementAsModes ? modsParam : statesParam;
    const element = isElementAsModes ? '' : elementParam;
    const {modifierDelimiter, elementDelimiter, throwOnError} = settings;

    const baseBlock = element ? `${name}${elementDelimiter}${element}` : name;
    let result = cssModule[baseBlock] || '';

    if (isDev) {
        if (!result && !mods) {
            const message = `There is no ${name}${elementDelimiter}${element} in cssModule`;

            if (throwOnError) {
                throw Error(message);
            } else {
                console.warn(message);
                return '';
            }
        }
    }

    if (mods) {
        result = Object.keys(mods)
            .reduce((acc, next) => {
                const modValue = mods[next];
                let mod: string;

                if (modValue === undefined) {
                    return acc;
                }

                if (typeof modValue === 'boolean') {
                    if (isDev) {
                        if (!(`${baseBlock}${modifierDelimiter}${next}` in cssModule)) {
                            const message = `There is no ${baseBlock}${modifierDelimiter}${next} in cssModule`;

                            if (throwOnError) {
                                throw Error(message);
                            } else {
                                console.warn(message);
                                return acc;
                            }
                        }
                    }

                    if (modValue) {
                        mod = cssModule[`${baseBlock}${modifierDelimiter}${next}`];
                    } else {
                        return acc;
                    }
                } else {
                    const currentMode = `${baseBlock}${modifierDelimiter}${next}${modifierDelimiter}${mods[next]}`;
                    if (isDev) {
                        if (!(currentMode in cssModule)) {
                            const message = `There is no ${currentMode} in cssModule`;

                            if (throwOnError) {
                                throw Error(message);
                            } else {
                                console.warn(message);
                                return acc;
                            }
                        }
                    }

                    mod = cssModule[currentMode];
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
                    const message = `There is no is-${next} in cssModule`;

                    if (throwOnError) {
                        throw Error(message);
                    } else {
                        console.warn(message);
                        return acc;
                    }
                }

                return `${acc} ${state}`;
            }, result);
    }

    return result.trim();
}

const extractModuleName = (cssModule) => {
    if (isDev) {
        if (!cssModule || typeof cssModule !== 'object' || Array.isArray(cssModule)) {
            const message = 'cssModule object should be an Object with keys';

            if (settings.throwOnError) {
                throw Error(message);
            } else {
                console.warn(message);
                return '';
            }
        }
    }

    let [name] = Object.keys(cssModule);

    if (isDev) {
        if (!name) {
            const message = 'cssModule has no keys';

            if (settings.throwOnError) {
                throw Error(message);
            } else {
                console.warn(message);
                return '';
            }
        }
    }

    const indexElement = name.indexOf(settings.elementDelimiter);

    if (indexElement !== -1) {
        name = name.slice(0, indexElement);
    }

    const indexModifier = name.indexOf(settings.modifierDelimiter);

    if (indexModifier !== -1) {
        name = name.slice(0, indexModifier);
    }

    return name;
};

const bem: any = (cssModule, name) =>
    block.bind(null, cssModule, name || extractModuleName(cssModule));

bem.setSettings = (newSettings: IOptions) =>
    Object.assign(settings, newSettings);

export default (bem as IModule);
