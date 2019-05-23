const looksSame = require('looks-same');
const puppeteer = require('puppeteer');
const util = require('util');

function screenshot(browser, source, destination) {
    return browser.newPage().then(page => page.goto(source).then(() => page.screenshot({ path: destination })));
}

function resemble(src, dest) {
    let puppet;

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
        .then(() => util.promisify(looksSame)(dest[0], dest[1]));
}

module.exports = resemble;
