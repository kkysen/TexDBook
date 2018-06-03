"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const InputBooksComponent_1 = require("../InputBooksComponent");
class UploadBooks extends react_1.Component {
    constructor(props) {
        super(props);
        console.log("constructing UploadBooks");
    }
    render() {
        console.log("rendering UploadBooks");
        return (React.createElement("div", null,
            React.createElement(InputBooksComponent_1.InputBooksComponent, null)));
    }
}
exports.UploadBooks = UploadBooks;
//# sourceMappingURL=UploadBooks.js.map