'use strict';

var path     = require('path'),
    phantom  = require('phantomjs'),
    resemble = require('./lib/resemble.js');

function info_msg(percentage) {
    return '\n     misMatchPercentage: ' + percentage  +
           '\n     The screenshots can be located at ' +
           path.join(__dirname, 'screenshots');
}

module.exports = function (chai) {

    chai.Assertion.addMethod('resemble', function (other, tolerance, callback) {
        if (typeof tolerance === 'function') {
            callback  = tolerance;
            tolerance = 0;
        }
        var assertion = this,
            this_destination  = path.join(__dirname, 'screenshots', path.basename(this._obj, '.html') + '.png'),
            other_destination = path.join(__dirname, 'screenshots', path.basename(this._obj, '.html') + '_2.png'),
            child_args = [
                /* Script */
                path.join(__dirname, 'lib/screenshot.js'),
                /* Sources */
                this._obj,
                other,
                /* Destinations */
                this_destination,
                other_destination
            ];

        /* Run PhantomJS */
        require('child_process').execFile(phantom.path, child_args, function (err, stdout, stderr) {
            if (err || stderr) {
                return callback(err || stderr);
            }
            resemble(child_args[3], child_args[4], function (data) {

                assertion.assert(
                    data.misMatchPercentage <= tolerance,
                    'expected ' + assertion._obj + ' to resemble ' + other +
                        info_msg(data.misMatchPercentage),
                    'expected ' + assertion._obj + ' to not resemble ' + other +
                        info_msg(data.misMatchPercentage)
                );
                return callback();
            });
        });
    });
};
