'use strict';

var nodefn = require('when/node'),
    looksSame = require('looks-same'),
    path = require('path'),
    phridge = require('phridge');

var phantom;

function infoMsg() {
    return 'The screenshots can be found at ' + path.join(__dirname, 'screenshots');
}

module.exports = function (chai) {

    chai.Assertion.addMethod('resemble', function (otherSrc, callback) {
        var assertion = this,
            src = [
                assertion._obj,
                otherSrc
            ],
            dest = [
                path.join(__dirname, 'screenshots', path.basename(this._obj, '.html') + '.png'),
                path.join(__dirname, 'screenshots', path.basename(this._obj, '.html') + '_2.png')
            ];

        /* Run PhantomJS */
        return phridge.spawn()
            .then(function (instance) {
                phantom = instance;
            })
            .then(function () {
                return phantom.openPage(src[0]);
            })
            .then(function (page) {
                return page.run(dest[0], function (destination, resolve) {
                    this.render(destination);
                    resolve();
                });
            })
            .then(function () {
                return phantom.openPage(src[1]);
            })
            .then(function (page) {
                return page.run(dest[1], function (destination, resolve) {
                    this.render(destination);
                    resolve();
                });
            })
            .finally(phridge.disposeAll)
            .then(function () {
                return nodefn.call(looksSame, dest[0], dest[1]);
            })
            .then(function (equal) {
                assertion.assert(
                    equal === true,
                    'expected ' + assertion._obj + ' to resemble ' + otherSrc + infoMsg(),
                    'expected ' + assertion._obj + ' to not resemble ' + otherSrc + infoMsg()
                );
            })
            .then(function () {
                return nodefn.liftCallback(callback)();
            }).catch(function (err) {
                return nodefn.liftCallback(callback)(err);
            });
    });
};
