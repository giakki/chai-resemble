/* jshint expr: true */
'use strict';

var chai     = require('chai'),
    expect   = chai.expect,
    path     = require('path'),
    resemble = require('../chai-resemble.js');

chai.use(resemble);

function abs(file) {
    return path.join(__dirname, file);
}

describe('chai-resemble', function () {
    this.timeout(15000);

    it('Should resemble itself', function (done) {
        expect('http://getbootstrap.com/examples/jumbotron/')
            .to.resemble('http://getbootstrap.com/examples/jumbotron/', done);
    });

    it('Should resemble the original', function (done) {
        expect(abs('fixtures/jumbotron.html'))
            .to.resemble('http://getbootstrap.com/examples/jumbotron/', done);
    });

    it('Should not resemble another page', function (done) {
        expect(abs('fixtures/jumbotron.html'))
            .to.not.resemble('http://getbootstrap.com/examples/grid/', done);
    });
});
