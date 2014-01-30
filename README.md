chai-resemble
=============

Chai helper for visually comparing HTML pages.
Inspired by [Resemble.js](https://github.com/Huddle/Resemble.js)

#Installation#
    npm install chai-resemble

Note: to use this helper, you should also have [PhantomJS](https://github.com/Obvious/phantomjs) installed.

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

## License
Copyright (c) 2013 Giacomo Martino. See the [LICENSE](/LICENSE.md) file for license rights and limitations (MIT).
This module includes code from [Resemble.js](https://github.com/Huddle/Resemble.js), released under the MIT license.
