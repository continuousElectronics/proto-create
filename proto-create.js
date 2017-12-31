"use strict";

// max value allowed for Unsigned 32 bit number (2^32 - 1)
const int32MaxValue = Math.pow(2, 32) - 1;

// takes object o as input and returns the maximum number which is a property of o as a number type
const getMaxIndex = function (o) {
    let maxIndex = -1;
    for (let prop in o) {
        if (
            String(prop >>> 0) === prop &&
            (prop >>> 0) !== int32MaxValue &&
            Object.prototype.hasOwnProperty.call(o, prop) &&
            prop > maxIndex
        ) {
            maxIndex = prop;
        }
    }
    return parseInt(maxIndex);
};

// used inside the getter for each execution context of the exported function.
// Call method used from context for "this"
const getValue = function (lengthFromClosure) {
    return Math.max(lengthFromClosure, getMaxIndex(this) + 1);
};

// used inside the getter for each execution context of the exported function. Call method used from context
// Call method used from context for "this"
const setValue = function (value) {
    let newLength = value >>> 0;
    if (newLength !== parseFloat(value)) {
        throw new RangeError("Invalid array length");
    }
    for (let i = newLength; i < this.length; i++) {
        delete this[i];
    }
    return newLength;
};

// exported function that returns a new object based from a prototype
module.exports = function (o) {
    if (!o || typeof o !== "object") {
        throw new TypeError("Argument must be an object");
    }
    let proto;
    o.descriptors = o.descriptors || {};
    if (Array.isArray(o.target)) {
        let lengthFromClosure = 0;
        proto = (o.proto === undefined) ? Array.prototype : o.proto;
        o.descriptors.length = {
            get: function () {
                return getValue.call(this, lengthFromClosure);
            },
            set: function (value) {
                lengthFromClosure = setValue.call(this, value);
            }
        };
    } else {
        proto = (o.proto === undefined) ? Object.prototype : o.proto;
    }
    return Object.assign(
        Object.create(proto, o.descriptors),
        o.target
    );
};