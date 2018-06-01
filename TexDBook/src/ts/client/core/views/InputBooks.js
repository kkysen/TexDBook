"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const InputIsbns_1 = require("./InputIsbns");
class InputBooks extends react_1.Component {
    constructor(props) {
        super(props);
        this.books = [];
        console.log("constructing InputBooks");
    }
    render() {
        console.log("rendering InputBooks");
        return (React.createElement("div", null,
            React.createElement(InputIsbns_1.InputIsbns, { startLength: 1, books: this.books })));
    }
}
exports.InputBooks = InputBooks;
//# sourceMappingURL=InputBooks.js.map