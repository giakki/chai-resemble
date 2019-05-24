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

describe('options', function() {
    this.timeout(15000);

    it('should have a default destination', done => {
        expect(abs('fixtures/album.html')).to.resemble(abs('fixtures/album.html'), done);
    });

    it('should honor name and outDir', done => {
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
