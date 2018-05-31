"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const reactstrap_1 = require("reactstrap");
const InputBarcodes_1 = require("./InputBarcodes");
class InputIsbn extends react_1.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement(reactstrap_1.InputGroup, null,
                React.createElement(reactstrap_1.InputGroupAddon, { addonType: "prepend" }, "ISBN"),
                React.createElement(reactstrap_1.Input, { type: "text", innerRef: this.props.isbn.ref })),
            React.createElement(InputBarcodes_1.InputBarcodes, { startLength: 1, barcodes: this.props.barcodes })));
    }
}
exports.InputIsbn = InputIsbn;
//# sourceMappingURL=InputIsbn.js.map