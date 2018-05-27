"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJson = async function (url, arg, options) {
    const response = await fetch(url, Object.assign(options || {}, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: !arg ? arg : JSON.stringify(arg),
    }));
    return await response.json();
};
//# sourceMappingURL=fetchJson.js.map