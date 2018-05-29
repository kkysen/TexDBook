"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const makeSha = function (numBits) {
    const toBuffer = function (data) {
        if (Object.prototype.toString.call(data) === "[object String]") {
            return new TextEncoder().encode(data);
        }
        return data;
    };
    const digest = crypto.subtle.digest.bind(crypto.subtle, { name: "SHA-" + numBits });
    return {
        async hash(data) {
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