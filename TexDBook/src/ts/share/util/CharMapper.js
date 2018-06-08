"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identity = (t) => t;
exports.makeTrue = (...args) => true;
exports.makeFalse = (...args) => false;
exports.makeEmpty = (c) => "";
/**
 * Check if a single character string is a allowDigits.
 *
 * @param {string} char a single character string
 * @returns {boolean} if the character is a allowDigits 0-9
 */
exports.isDigit = function (char) {
    return !Number.isNaN(parseInt(char));
};
exports.CharMapper = (() => {
    const any = {
        test: exports.makeTrue,
        map: exports.identity,
    };
    const none = {
        test: exports.makeTrue,
        map: exports.makeEmpty,
    };
    const allowDigits = {
        test: exports.isDigit,
        map: exports.identity,
    };
    const onlyDigits = {
        test: exports.isDigit.negate(),
        map: exports.makeEmpty,
    };
    const toUpper = {
        test: exports.makeTrue,
        map: c => c.toUpperCase(),
    };
    const toLower = {
        test: exports.makeTrue,
        map: c => c.toLowerCase(),
    };
    return {
        any,
        none,
        allowDigits,
        onlyDigits,
    }
        .freezeFields()
        .freeze();
})();
//# sourceMappingURL=CharMapper.js.map