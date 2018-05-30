"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anyWindow_1 = require("../anyWindow");
exports.fetchJson = async function (url, arg, options) {
    const responsePromise = fetch(url, Object.assign(options || {}, {
        credentials: "include",
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: !arg ? arg : JSON.stringify(arg),
    }));
    try {
        return await (await responsePromise).json();
    }
    catch (e) {
        console.error(e);
        return {
            success: false,
            message: e.message,
            response: undefined,
        };
    }
};
anyWindow_1.anyWindow.fetchJson = exports.fetchJson;
//# sourceMappingURL=fetchJson.js.map