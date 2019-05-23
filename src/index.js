const path = require('path');
const resemble = require('./resemble');

function infoMsg() {
    return 'The screenshots can be found at ' + path.join(__dirname, 'screenshots');
}

module.exports = chai => {
    chai.Assertion.addMethod('resemble', function(otherSrc, callback) {
        const assertion = this;
        const src = [assertion._obj, otherSrc];
        const dest = [
            path.resolve(__dirname, '..', 'screenshots', path.basename(this._obj, '.html') + '.current.png'),
            path.resolve(__dirname, '..', 'screenshots', path.basename(this._obj, '.html') + '.reference.png'),
        ];

        return resemble(src, dest)
            .then(results => {
                assertion.assert(
                    results.equal === true,
                    'expected ' + src[0] + ' to resemble ' + otherSrc + infoMsg(),
                    'expected ' + src[0] + ' to not resemble ' + otherSrc + infoMsg()
                );
            })
            .then(() => callback())
            .catch(err => callback(err));
    });
};
