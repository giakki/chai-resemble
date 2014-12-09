chai-resemble
=============

Chai helper for visually comparing HTML pages.

#Installation#

```shell
npm install chai-resemble
```

Note: to use this helper, you should also have [PhantomJS](https://github.com/Obvious/phantomjs) installed.

#Usage#

```js
var resemble = require('chai-resemble'),

chai.use(resemble);

describe("chai-resemble", function () {
    it('Should resemble the original', function (done) {
        expect('http://google.com').to.resemble('http://google.com', done);
    });
});
```
## License
Copyright (c) 2013 Giacomo Martino. See the [LICENSE](/LICENSE.md) file for license rights and limitations (MIT).
