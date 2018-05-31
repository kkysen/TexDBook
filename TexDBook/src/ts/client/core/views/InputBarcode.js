"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const reactstrap_1 = require("reactstrap");
class InputBarcode extends react_1.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement(reactstrap_1.InputGroup, null,
                React.createElement(reactstrap_1.InputGroupAddon, { addonType: "prepend" }, "Barcode"),
                React.createElement(reactstrap_1.Input, { type: "text", innerRef: this.props.barcode.ref }))));
    }
}
exports.InputBarcode = InputBarcode;
//# sourceMappingURL=InputBarcode.js.map