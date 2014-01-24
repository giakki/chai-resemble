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

describe("Pages should resemble the reference", function () {
    this.timeout(15000);

    it('Bootstrap', function (done) {
        expect(abs('fixtures/jumbotron.html'))
            .to.resemble('http://getbootstrap.com/examples/jumbotron/', done);
    });

    it('Bootstrap - Error case', function (done) {
        expect(abs('fixtures/jumbotron.html'))
            .to.not.resemble('http://getbootstrap.com/examples/grid/', done);
    });
});
