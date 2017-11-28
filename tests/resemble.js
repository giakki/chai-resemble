/* eslint-env mocha */

'use strict';

const chai = require('chai');
const path = require('path');
const resemble = require('../chai-resemble.js');

const expect = chai.expect;

chai.use(resemble);

function abs(file) {
    return path.join(__dirname, file);
}

describe('chai-resemble', function () {
    this.timeout(15000);

    it('Should resemble itself', (done) => {
        expect('http://getbootstrap.com/docs/3.3/examples/jumbotron/')
            .to.resemble('http://getbootstrap.com/docs/3.3/examples/jumbotron/', done);
    });

    it('Should resemble the original', (done) => {
        expect(abs('fixtures/jumbotron.html'))
            .to.resemble('http://getbootstrap.com/docs/3.3/examples/jumbotron/', done);
    });

    it('Should not resemble another page', (done) => {
        expect(abs('fixtures/jumbotron.html'))
            .to.not.resemble('http://getbootstrap.com/docs/3.3/examples/grid/', done);
    });
});
