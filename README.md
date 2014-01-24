chai-resemble
=============

Chai helper for visually comparing HTML pages

#Installation#
    npm install chai-resemble

Note: to use this helper, you should also have PhantomJS, imagemagick and graphicsmagick installed.

#Usage#

    var resemble = require('chai-resemble'),
        tolerance = 0.4;

    chai.use(resemble);

    describe("chai-resemble", function () {
        it('Should resemble the original', function (done) {
            expect('http://google.com').to.resemble('http://google.com', tolerance, done);
            // Tolerance argument is optional, it defaults to 0
            expect('http://google.com').to.resemble('http://google.com', done);
        });
    });
