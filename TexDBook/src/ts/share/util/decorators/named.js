"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.named = function named(name) {
    return function (target) {
        return target.named(name);
    };
};
//# sourceMappingURL=named.js.map