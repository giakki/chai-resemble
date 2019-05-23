# chai-resemble

[![NPM version](https://img.shields.io/npm/v/chai-resemble.svg)](https://www.npmjs.com/package/chai-resemble)
[![Build Status](https://img.shields.io/travis/giakki/chai-resemble/master.svg)](https://travis-ci.org/giakki/chai-resemble)
[![Dependency Status](https://img.shields.io/david/giakki/chai-resemble.svg)](https://david-dm.org/giakki/chai-resemble)
[![devDependency Status](https://img.shields.io/david/dev/giakki/chai-resemble.svg)](https://david-dm.org/giakki/chai-resemble#info=devDependencies)

Chai helper for visually comparing HTML pages.

## Installation

```shell
npm install chai-resemble
```

## Usage

```js
var chai = require('chai'),
    resemble = require('chai-resemble.js');

chai.use(resemble);

describe('chai-resemble', function() {
    it('Should resemble the original', function(done) {
        expect('https://www.google.com').to.resemble('https://www.google.com', done);
    });

    // Specify where to store files.
    it('Should resemble the original', function(done) {
        expect('https://www.google.com').to.resemble('https://www.google.com' { name: 'filename', outDir: 'directory' }, done);
    });
});
```

## License

Copyright (c) 2019 Giacomo Martino. See the [LICENSE](/LICENSE.md) file for license rights and limitations (MIT).
