"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Main_1 = require("./views/Main");
exports.TexDBook = window.TexDBook;
exports.main = function () {
    Main_1.reactMain();
    console.log(window._clone());
    (async () => {
        const clrsIsbn = "9780262531962";
        // console.log((await (Isbn.parse(clrsIsbn) as Isbn).fetchBook()).title);
    })();
};
//# sourceMappingURL=TexDBook.js.map