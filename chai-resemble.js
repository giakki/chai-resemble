var fs      = require('fs'),
    gm      = require('gm'),
    path    = require('path'),
    phantom = require('phantomjs'),
    /**/
    info_msg = '\n     The screenshots can be located at ' +
               path.join(__dirname, 'screenshots');

module.exports = function (chai, utils) {
    'use strict';

    chai.Assertion.addMethod('resemble', function (other, callback) {
        var assertion = this.assert,
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
        require('child_process').execFile(phantom.path, child_args, function (err) {
            if (err) {
                return callback(err);
            }
            gm.compare(child_args[3], child_args[4], function (err, isEqual, equality) {
                if (err) {
                    return callback(err);
                }

                assertion(
                    isEqual === true,
                    'expected ' + assertion._obj + ' to resemble ' + other + info_msg,
                    'expected ' + assertion._obj + ' to not resemble ' + other + info_msg
                );

                /* If all was successful, cleanup */
                fs.unlink(this_destination, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    fs.unlink(other_destination, function (err) {
                        return callback(err);
                    });
                });
            });
        });
    });
};
