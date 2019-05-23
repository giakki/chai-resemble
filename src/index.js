const path = require('path');
const resemble = require('./resemble');

function infoMsg(outDir) {
    return 'The screenshots can be found at ' + outDir;
}

function makeDefaultOptions(src) {
    return {
        name: path.basename(src, '.html'),
        outDir: path.resolve(__dirname, '..', 'screenshots'),
    };
}

module.exports = chai => {
    chai.Assertion.addMethod('resemble', function(reference, optionsOrCallback, callbackOrUndefined) {
        const assertion = this;
        const options =
            typeof optionsOrCallback === 'function' ? makeDefaultOptions(this._obj, reference) : optionsOrCallback;
        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : callbackOrUndefined;

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
                    'expected ' + src.current + ' to resemble ' + src.reference + infoMsg(options.outDir),
                    'expected ' + src.current + ' to not resemble ' + src.reference + infoMsg(options.outDir)
                );
            })
            .then(() => callback())
            .catch(err => callback(err));
    });
};
