"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const Isbn_1 = require("../../share/core/Isbn");
const Main_1 = require("./views/Main");
const reactMain = function () {
    const root = document.body.appendDiv();
    ReactDOM.render(React.createElement(Main_1.Main, null), root);
};
exports.main = function () {
    reactMain();
    console.log(window._clone());
    (async () => {
        const clrsIsbn = "9780262531962";
        console.log((await Isbn_1.Isbn.parse(clrsIsbn).fetchBook()).title);
    })();
};
//# sourceMappingURL=TexDBook.js.map