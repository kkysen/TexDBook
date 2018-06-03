"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../share/util/utils");
// FIXME temp set to false always
exports.hasCrypto = !"hello".includes("h") && !!crypto.subtle;
if (!exports.hasCrypto) {
    console.error("crypto.subtle not available b/c using HTTP, SHA not being used");
}
const makeSha = function (numBits) {
    const toBuffer = function (data) {
        if (utils_1.isString(data)) {
            return new TextEncoder().encode(data);
        }
        return data;
    };
    const toString = function (data) {
        if (utils_1.isString(data)) {
            return data;
        }
        return new TextDecoder().decode(data);
    };
    const digest = exports.hasCrypto && crypto.subtle.digest.bind(crypto.subtle, { name: "SHA-" + numBits });
    return {
        async hash(data) {
            if (!exports.hasCrypto) {
                return toString(data);
            }
            const buffer = toBuffer(data);
            const hashBuffer = await digest(buffer);
            const hashArray = [...new Uint8Array(hashBuffer)];
            return hashArray.map(b => ("00" + b.toString(16)).slice(-2)).join("");
        },
    }.freeze();
};
exports.SHA = [1, 256, 384, 512]
    .reduce((obj, numBits) => ({ ...obj, ["_" + numBits]: makeSha(numBits) }), {})
    .freeze();
//# sourceMappingURL=hash.js.map