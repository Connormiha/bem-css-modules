const tsc = require('typescript');
const tsconfig = require('../tsconfig.json');

module.exports = {
    process(src, path) {
        return {
            code: tsc.transpile(
                src,
                tsconfig.compilerOptions,
                path, []
            )
        };
    }
};
