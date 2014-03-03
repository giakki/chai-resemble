/*
Author: James Cryer
Company: Huddle
Last updated date: 30 Jan 2014
URL: https://github.com/Huddle/Resemble.js
Adaptation by: Giacomo Martino
*/
'use strict';

var pngparse = require('pngparse');

var tolerance = { // between 0 and 255
    red   : 4,
    green : 4,
    blue  : 4,
    alpha : 4
};

function loadImageData(filename, callback) {
    pngparse.parseFile(filename, function (err, imageData) {
        if (err) {
            throw err;
        }
        callback(imageData);
    });
}

function isColorSimilar(a, b, tol) {
    var absDiff = Math.abs(a - b);

    if (a === b) {
        return true;
    } else if (absDiff < tol) {
        return true;
    } else {
        return false;
    }
}

function isRGBASimilar(d1, d2) {
    return isColorSimilar(d1.r, d2.r, tolerance.red)   &&
           isColorSimilar(d1.g, d2.g, tolerance.green) &&
           isColorSimilar(d1.b, d2.b, tolerance.blue)  &&
           isColorSimilar(d1.a, d2.a, tolerance.alpha);
}

function getPixelInfo(data, offset) {
    var r, g, b, d, a;

    r = data[offset];

    if (typeof r !== 'undefined') {
        g = data[offset + 1];
        b = data[offset + 2];
        a = data[offset + 3];
        d = {
            r : r,
            g : g,
            b : b,
            a : a
        };

        return d;
    } else {
        return null;
    }
}

function analyseImages(one, two, width, height) {
    var mismatchCount = 0,
        i, j, offset, pixel1, pixel2;

    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
            offset = ((i * width) + j) * 4,
            pixel1 = getPixelInfo(one.data, offset),
            pixel2 = getPixelInfo(two.data, offset);

            if (pixel1 === null || pixel2 === null) {
                break;
            }

            if (!isRGBASimilar(pixel1, pixel2)) {
                mismatchCount++;
            }
        }
    }

    return mismatchCount / (height * width) * 100;
}

module.exports = function (filename, secondFilename, callback) {
    loadImageData(filename, function (one) {
        loadImageData(secondFilename, function (two) {
            var data = {};

            if ((one.width === two.width) &&
                (one.height === two.height)) {
                data.isSameDimensions = true;
            } else {
                data.isSameDimensions = false;
                data.dimensionDifference = {
                    width  : one.width - two.width,
                    height : one.height - two.height
                };
            }


            if (data.isSameDimensions) {
                data.misMatchPercentage =
                    analyseImages(one, two, one.width, one.height);
            }

            return callback(data);
        });
    });
};
