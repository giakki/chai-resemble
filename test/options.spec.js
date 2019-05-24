/* eslint-env mocha */

const chai = require('chai');
const fs = require('fs');
const path = require('path');
const resemble = require('../src');
const tmp = require('tmp-promise');

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
        const tmpDir = tmp.dirSync();
        const name = 'test';

        expect(abs('fixtures/album.html')).to.resemble(
            abs('fixtures/album.html'),
            { name, outDir: tmpDir.name },
            () => {
                const files = fs.readdirSync(tmpDir.name);
                files.sort();

                try {
                    expect(files[0]).to.equal('test.current.png');
                    expect(files[1]).to.equal('test.reference.png');

                    done();
                } catch (err) {
                    done(err);
                }
            }
        );
    });

    it('should work with no options or callback', done => {
        const expectError = () => {
            process.off('unhandledRejection', expectError);
            done();
        };

        process.on('unhandledRejection', expectError);

        expect(abs('fixtures/album.html')).to.resemble(abs('fixtures/album.html'));
    });
});
