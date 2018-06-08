"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CharMapper_1 = require("./CharMapper");
exports.isString = function (t) {
    return Object.prototype.toString.call(t) === "[object String]";
};
exports.capitalize = function (word) {
    return word.length === 0
        ? ""
        : word[0].toUpperCase() + word.slice(1);
};
exports.joinWords = function (words) {
    const _words = [...words];
    switch (_words.length) {
        case 0:
            return "";
        case 1:
            return _words[0];
        case 2:
            return _words[0] + " and " + _words[1];
        default:
            const lastWord = _words.pop();
            return _words.join(", ") + ", and " + lastWord;
    }
};
exports.separateClassName = function (className) {
    return className.replace(/([A-Z])/g, " $1").trim();
};
exports.joinNodes = function (nodes, node) {
    if (nodes.length < 2) {
        return nodes;
    }
    const joinedNodes = [];
    for (let i = 0, j = 0; i < nodes.length; i++) {
        joinedNodes.push(nodes[i]);
        joinedNodes.push(node && node._clone());
    }
    joinedNodes.pop();
    return joinedNodes;
};
exports.singletonAsArray = function (singletonOrArray) {
    return Array.isArray(singletonOrArray) ? singletonOrArray : [singletonOrArray];
};
exports.filterInput = function (input, charFilter) {
    input.value = input.value.split("").filter(charFilter).join("");
};
exports.onlyDigitsInput = function (input) {
    exports.filterInput(input, CharMapper_1.isDigit);
};
exports.mapInput = function (input, charMappers) {
    input.value = input.value.split("").map(c => {
        for (const charMapper of charMappers) {
            if (charMapper.test(c)) {
                return charMapper.map(c);
            }
        }
        return "";
    }).join("");
};
//# sourceMappingURL=utils.js.map