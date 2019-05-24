/* eslint-env mocha */

'use strict';

const chai = require('chai');
const path = require('path');
const resemble = require('../src');

const expect = chai.expect;

chai.use(resemble);

function abs(file) {
    return 'file://' + path.join(__dirname, file);
}

describe('chai-resemble', function() {
    this.timeout(15000);

    it('should throw an error if an invalid argument is supplied', done => {
        expect('https://getbootstrap.com/docs/4.3/examples/album/').to.resemble(
            'https://getbootstrap.com/docs/4.3/examples/album/',
            (err, result) => {
                expect(err).not.to.be.undefined;
                expect(result).to.be.undefined;

                done();
            }
        );
    })

    it('should resemble itself', done => {
        expect('https://getbootstrap.com/docs/4.3/examples/album/').to.resemble(
            'https://getbootstrap.com/docs/4.3/examples/album/',
            done
        );
    });

    it('should resemble the original', done => {
        expect(abs('fixtures/album.html')).to.resemble('https://getbootstrap.com/docs/4.3/examples/album/', done);
    });

    it('should not resemble another page', done => {
        expect(abs('fixtures/album.html')).to.not.resemble('https://getbootstrap.com/docs/4.3/examples/pricing/', done);
    });
});
