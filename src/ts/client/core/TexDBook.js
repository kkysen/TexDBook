"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Isbn_1 = require("../../share/core/Isbn");
exports.main = function () {
    console.log(window._clone());
    (async () => {
        const clrsIsbn = "9780262531962";
        console.log((await Isbn_1.Isbn.parse(clrsIsbn).fetchBook()).title);
    })();
};
//# sourceMappingURL=TexDBook.js.map