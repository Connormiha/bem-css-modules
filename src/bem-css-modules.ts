type CssModuleType = {
    [key: string]: string;
} | {
    readonly [key: string]: string;
};

interface ModsType {
    [key: string]: boolean | string | number;
}

interface StatesType {
    [key: string]: boolean;
}

interface IBlock {
    (element?: string, mods?: ModsType | null, states?: StatesType | null): string;
    (mods?: ModsType | null, states?: StatesType | null): string;
}

interface IOptions {
    throwOnError?: boolean;
}

interface IModule {
    (cssModule: CssModuleType, name?: string): IBlock;
    setSettings(options: IOptions): void;
}

const isDev = process.env.NODE_ENV !== 'production';
const settings: IOptions = {
    throwOnError: false
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
function block(cssModule: CssModuleType, name, elementParam, modsParam, statesParam) {
    const isElementAsModes = elementParam && typeof elementParam === 'object';
    const mods = isElementAsModes ? elementParam : modsParam;
    const states = isElementAsModes ? modsParam : statesParam;
    const element = isElementAsModes ? '' : elementParam;

    const baseBlock = element ? `${name}__${element}` : name;
    let result = cssModule[baseBlock] || '';

    if (isDev) {
        if (!result && !mods) {
            const message = `There is no ${name}__${element} in cssModule`;

            if (settings.throwOnError) {
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

                let mod;

                if (typeof modValue === 'boolean') {
                    if (isDev) {
                        if (!(`${baseBlock}_${next}` in cssModule)) {
                            const message = `There is no ${baseBlock}_${next} in cssModule`;

                            if (settings.throwOnError) {
                                throw Error(message);
                            } else {
                                console.warn(message);
                                return '';
                            }
                        }
                    }

                    if (modValue) {
                        mod = cssModule[`${baseBlock}_${next}`];
                    } else {
                        return acc;
                    }
                } else {
                    if (isDev) {
                        if (!(`${baseBlock}_${next}_${mods[next]}` in cssModule)) {
                            const message = `There is no ${baseBlock}_${next}_${mods[next]} in cssModule`;

                            if (settings.throwOnError) {
                                throw Error(message);
                            } else {
                                console.warn(message);
                                return '';
                            }
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
                    const message = `There is no is-${next} in cssModule`;

                    if (settings.throwOnError) {
                        throw Error(message);
                    } else {
                        console.warn(message);
                        return '';
                    }
                }

                return `${acc} ${state}`;
            }, result);
    }

    return result.trim();
}

const regExpClearBEM = /__.*/g;

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

    const [name] = Object.keys(cssModule);

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

    return name.replace(regExpClearBEM, '');
};

const bem: any = (cssModule, name) =>
    block.bind(null, cssModule, name || extractModuleName(cssModule));

bem.setSettings = (newSettings) =>
    Object.assign(settings, newSettings);

export default (bem as IModule);
