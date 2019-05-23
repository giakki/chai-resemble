'use strict';

const looksSame = require('looks-same');
const path = require('path');
const puppeteer = require('puppeteer');
const util = require('util');

function infoMsg() {
    return 'The screenshots can be found at ' + path.join(__dirname, 'screenshots');
}

function screenshot(browser, source, destination) {
    return browser.newPage().then(page => page.goto(source).then(() => page.screenshot({ path: destination })));
}

let puppet;

module.exports = chai => {
    chai.Assertion.addMethod('resemble', function(otherSrc, callback) {
        const assertion = this;
        const src = [assertion._obj, otherSrc];
        const dest = [
            path.resolve(__dirname, '..', 'screenshots', path.basename(this._obj, '.html') + '.current.png'),
            path.resolve(__dirname, '..', 'screenshots', path.basename(this._obj, '.html') + '.reference.png'),
        ];

        return puppeteer
            .launch()
            .then(browser => {
                puppet = browser;
            })
            .then(() => screenshot(puppet, src[0], dest[0]))
            .then(() => screenshot(puppet, src[1], dest[1]))
            .then(() => {
                if (puppet) {
                    puppet.close();
                }
            })
            .catch(err => {
                if (puppet) {
                    puppet.close();
                }
                throw err;
            })
            .then(() => util.promisify(looksSame)(dest[0], dest[1]))
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
