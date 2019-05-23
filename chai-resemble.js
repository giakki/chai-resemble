'use strict';

var looksSame = require('looks-same'),
    path = require('path'),
    puppeteer = require('puppeteer'),
    util = require('util');

function infoMsg() {
    return 'The screenshots can be found at ' + path.join(__dirname, 'screenshots');
}

function screenshot(browser, source, destination) {
    return browser.newPage().then(function (page) {
        return page.goto(source).then(function () {
            return page.screenshot({ path: destination });
        });
    });
}

var puppet;

module.exports = function (chai) {

    chai.Assertion.addMethod('resemble', function (otherSrc, callback) {
        var assertion = this,
            src = [
                assertion._obj,
                otherSrc
            ],
            dest = [
                path.join(__dirname, path.basename(this._obj, '.html') + '.png'),
                path.join(__dirname, path.basename(this._obj, '.html') + '_2.png')
            ];

        return puppeteer.launch()
            .then(function (browser) {
                puppet = browser;
            })
            .then(function () {
                return screenshot(puppet, src[0], dest[0]);
            })
            .then(function () {
                return screenshot(puppet, src[1], dest[1]);
            })
            .then(function () {
                if (puppet) {
                    puppet.close();
                }
            })
            .catch(function (err) {
                if (puppet) {
                    puppet.close();
                }
                throw err;
            })
            .then(function () {
                return util.promisify(looksSame)(dest[0], dest[1]);
            })
            .then(function (results) {
                assertion.assert(
                    results.equal === true,
                    'expected ' + assertion._obj + ' to resemble ' + otherSrc + infoMsg(),
                    'expected ' + assertion._obj + ' to not resemble ' + otherSrc + infoMsg()
                );
            })
            .then(function () {
                return callback();
            }).catch(function (err) {
                return callback(err);
            });
    });
};
