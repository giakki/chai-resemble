const makeDir = require('make-dir');
const path = require('path');
const resemble = require('./resemble');
const tmp = require('tmp-promise');

async function validateOptions(options) {
    let { name, outDir } = options;

    if (!outDir) {
        const tmpDir = await tmp.dir();
        outDir = tmpDir.path;
    } else {
        await makeDir(outDir);
    }

    if (!name) {
        name = path.basename(await tmp.tmpName());
    }

    return {
        name,
        outDir,
    };
}

module.exports = chai => {
    chai.Assertion.addMethod('resemble', async function(reference, optionsOrCallback, callbackOrUndefined) {
        const assertion = this;
        const incompleteOptions = typeof optionsOrCallback === 'function' ? {} : optionsOrCallback;
        const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : callbackOrUndefined;

        /* istanbul ignore if */
        if (!callback) {
            // Ignored because it throws an unhandledRejection.
            throw new Error('No callback supplied to chai-resemble');
        }

        try {
            const options = await validateOptions(incompleteOptions);
            const src = {
                current: assertion._obj,
                reference,
            };

            const dest = {
                current: path.join(options.outDir, options.name + '.current.png'),
                reference: path.join(options.outDir, options.name + '.reference.png'),
            };

            const results = await resemble(src, dest);

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

            callback(null, results);
        } catch (err) {
            callback(err);
        }
    });
};
