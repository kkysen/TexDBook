"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isString = function (t) {
    return Object.prototype.toString.call(t) === "[object String]";
};
exports.joinWords = function (words) {
    switch (words.length) {
        case 0:
            return "";
        case 1:
            return words[0];
        case 2:
            return words[0] + " and " + words[1];
        default:
            const lastWord = words.pop();
            return words.join(", ") + ", and " + lastWord;
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
    exports.filterInput(input, c => !Number.isNaN(+c));
};
//# sourceMappingURL=utils.js.map