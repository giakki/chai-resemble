/* global phantom */
'use strict';

var page   = require('webpage').create(),
    system = require('system'),
    paths  = system.args.slice(1);

function render(source, target, callback) {
    page.open(source, function (status) {
        if (status !== 'success') {
            system.stderr.write('Unable to open: ' + source);
            return phantom.exit(1);
        }
        page.render(target);
        return callback();
    });
}

render(paths[0], paths[2], function () {
    render(paths[1], paths[3], function () {
        phantom.exit();
    });
});
