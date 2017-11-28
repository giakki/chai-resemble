'use strict';

const path = require('path');
const nodefn = require('when/node');
const looksSame = require('looks-same');
const phridge = require('phridge');

let phantom;

function infoMsg() {
    return `The screenshots can be found at ${path.join(__dirname, 'screenshots')}`;
}

module.exports = (chai) => {

    chai.Assertion.addMethod('resemble', function (otherSrc, callback) {
        const assertion = this;

        const src = [
            assertion._obj,
            otherSrc
        ];

        const dest = [
            path.join(__dirname, 'screenshots', `${path.basename(this._obj, '.html')}.png`),
            path.join(__dirname, 'screenshots', `${path.basename(this._obj, '.html')}_2.png`)
        ];

        /* Run PhantomJS */
        return phridge.spawn()
            .then((instance) => {
                phantom = instance;
            })
            .then(() => phantom.openPage(src[0]))
            .then((page) => page.run(dest[0], function (destination, resolve) {
                this.render(destination);
                resolve();
            }))
            .then(() => phantom.openPage(src[1]))
            .then((page) => page.run(dest[1], function (destination, resolve) {
                this.render(destination);
                resolve();
            }))
            .finally(phridge.disposeAll)
            .then(() => nodefn.call(looksSame, dest[0], dest[1]))
            .then((equal) => {
                assertion.assert(
                    equal === true,
                    `expected ${assertion._obj} to resemble ${otherSrc}${infoMsg()}`,
                    `expected ${assertion._obj} to not resemble ${otherSrc}${infoMsg()}`
                );
            })
            .done(() => nodefn.liftCallback(callback)(), (err) => {
                throw err;
            });
    });
};
