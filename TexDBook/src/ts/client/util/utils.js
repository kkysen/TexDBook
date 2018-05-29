"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.separateClassName = function (className) {
    return className.replace(/([A-Z])/g, " $1").trim();
};
exports.joinNodes = function (nodes, node) {
    if (nodes.length < 2) {
        return nodes;
    }
    const joinedNodes = new Array(nodes.length * 2);
    for (let i = 0, j = 0; i < nodes.length; i++) {
        joinedNodes[j++] = nodes[i];
        joinedNodes[j++] = node && node._clone();
    }
    joinedNodes.pop();
    return joinedNodes;
};
//# sourceMappingURL=utils.js.map