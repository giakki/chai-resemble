/* eslint-env mocha */

'use strict';

var chai = require('chai'),
    path = require('path'),
    resemble = require('../chai-resemble.js');

var expect = chai.expect;

chai.use(resemble);

function abs(file) {
    return 'file://' + path.join(__dirname, file);
}

describe('chai-resemble', function () {
    this.timeout(15000);

    it('Should resemble itself', function (done) {
        expect('https://getbootstrap.com/docs/4.3/examples/album/')
            .to.resemble('https://getbootstrap.com/docs/4.3/examples/album/', done);
    });

    it('Should resemble the original', function (done) {
        expect(abs('fixtures/album.html'))
            .to.resemble('https://getbootstrap.com/docs/4.3/examples/album/', done);
    });

    it('Should not resemble another page', function (done) {
        expect(abs('fixtures/album.html'))
            .to.not.resemble('https://getbootstrap.com/docs/4.3/examples/pricing/', done);
    });
});
