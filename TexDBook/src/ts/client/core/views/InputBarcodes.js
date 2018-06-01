"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const Button_1 = require("reactstrap/lib/Button");
const Range_1 = require("../../../share/util/Range");
const InputRef_1 = require("../../util/refs/InputRef");
const InputBarcode_1 = require("./InputBarcode");
class InputBarcodes extends react_1.Component {
    constructor(props) {
        super(props);
        const barcodes = props.barcodes;
        this.barcodes = barcodes;
        barcodes.clear();
        barcodes.addAll(Range_1.Range.new(props.startLength).map(() => InputRef_1.InputRef.new()));
        this.nodes = barcodes.map((barcode, i) => this.barcodeInput(barcode, i));
    }
    barcodeInput(barcode, i) {
        return React.createElement(InputBarcode_1.InputBarcode, { barcode: barcode, remove: () => this.removeBarcode(i) });
    }
    addBarcode() {
        const barcode = InputRef_1.InputRef.new();
        this.barcodes.push(barcode);
        this.nodes.push(this.barcodeInput(barcode, this.nodes.length));
        this.setState({});
    }
    removeBarcode(i) {
        this.barcodes.slice(i, 1);
        this.nodes.slice(i, 1);
        this.setState({});
    }
    render() {
        return (React.createElement("div", null,
            this.nodes.map((node, i) => React.createElement("div", { key: i }, node)),
            React.createElement(Button_1.default, { onClick: () => this.addBarcode() }, "New Barcode")));
    }
}
exports.InputBarcodes = InputBarcodes;
//# sourceMappingURL=InputBarcodes.js.map