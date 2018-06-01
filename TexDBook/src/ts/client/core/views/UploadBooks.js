"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const InputBooks_1 = require("./InputBooks");
class UploadBooks extends react_1.Component {
    constructor(props) {
        super(props);
        console.log("constructing UploadBooks");
    }
    render() {
        console.log("rendering UploadBooks");
        return (React.createElement("div", null,
            "Upload Books",
            React.createElement(InputBooks_1.InputBooks, null)));
    }
}
exports.UploadBooks = UploadBooks;
//# sourceMappingURL=UploadBooks.js.map