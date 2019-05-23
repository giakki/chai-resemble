/* eslint-env mocha */

'use strict';

const chai = require('chai');
const del = require('del');
const fs = require('fs');
const path = require('path');
const resemble = require('../src');

const expect = chai.expect;

chai.use(resemble);

function abs(file) {
    return 'file://' + path.join(__dirname, file);
}

describe('chai-resemble', function() {
    this.timeout(15000);

    it('Should resemble itself', done => {
        expect('https://getbootstrap.com/docs/4.3/examples/album/').to.resemble(
            'https://getbootstrap.com/docs/4.3/examples/album/',
            done
        );
    });

    it('Should resemble the original', done => {
        expect(abs('fixtures/album.html')).to.resemble('https://getbootstrap.com/docs/4.3/examples/album/', done);
    });

    it('Should not resemble another page', done => {
        expect(abs('fixtures/album.html')).to.not.resemble('https://getbootstrap.com/docs/4.3/examples/pricing/', done);
    });

    it('Should have default destination options', done => {
        expect(abs('fixtures/album.html')).to.resemble(abs('fixtures/album.html'), done);

        expect(fs.existsSync(path.resolve(__dirname, '../screenshots/album.current.png'))).to.be.true;
        expect(fs.existsSync(path.resolve(__dirname, '../screenshots/album.reference.png'))).to.be.true;
    });

    it('Should honor destination options', done => {
        const name = Math.random()
            .toString()
            .substring(2);

        const files = [
            path.resolve(__dirname, '../screenshots/' + name + '.current.png'),
            path.resolve(__dirname, '../screenshots/' + name + '.reference.png'),
        ];

        files.forEach(f => {
            if (fs.existsSync(f)) {
                del.sync(f);
            }
        });

        expect(abs('fixtures/album.html')).to.resemble(
            abs('fixtures/album.html'),
            { name, outDir: path.resolve(__dirname, '../screenshots') },
            () => {
                files.forEach(f => {
                    expect(fs.existsSync(f)).to.be.true;
                    del.sync(f);
                });

                done();
            }
        );
    });
});
