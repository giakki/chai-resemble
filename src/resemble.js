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
        .then(() =>
            Promise.all([
                screenshot(puppet, src.current, dest.current),
                screenshot(puppet, src.reference, dest.reference),
            ])
        )
        .then(() => {
            puppet.close();
        })
        .catch(err => {
            /* istanbul ignore next */
            if (puppet) {
                // There might be cases in which puppeteer.launch fails, but they are ignored from coverage right now.
                puppet.close();
            }
            throw err;
        })
        .then(() => util.promisify(looksSame)(dest.current, dest.reference));
}

module.exports = resemble;
