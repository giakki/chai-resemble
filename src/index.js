const makeDir = require('make-dir');
const path = require('path');
const resemble = require('./resemble');
const tmp = require('tmp-promise');

function validateOptions(options) {
    const dirPromise = options.outDir ? makeDir(options.outDir) : tmp.dir().then(({ path }) => path);

    return dirPromise.then(outDir => {
        const namePromise = options.name ? Promise.resolve(options.name) : tmp.file().then(({ name }) => name);

        return namePromise.then(name => ({ name, outDir }));
    });
}

module.exports = chai => {
    chai.Assertion.addMethod('resemble', function(reference, optionsOrCallback, callbackOrUndefined) {
        const assertion = this;
        const incompleteOptions =
            typeof optionsOrCallback === 'function'
                ? {
                      name: null,
                      outDir: null,
                  }
                : optionsOrCallback;
        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : callbackOrUndefined;

        return validateOptions(incompleteOptions).then(options => {
            const src = {
                current: this._obj,
                reference,
            };

            const dest = {
                current: path.join(options.outDir, options.name + '.current.png'),
                reference: path.join(options.outDir, options.name + '.reference.png'),
            };

            return resemble(src, dest)
                .then(results => {
                    assertion.assert(
                        results.equal === true,
                        'expected ' +
                            src.current +
                            ' to resemble ' +
                            src.reference +
                            'The screenshots can be found at ' +
                            options.outDir,
                        'expected ' +
                            src.current +
                            ' to not resemble ' +
                            src.reference +
                            'The screenshots can be found at ' +
                            options.outDir
                    );
                })
                .then(() => callback())
                .catch(err => callback(err));
        });
    });
};
